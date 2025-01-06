const pool = require('../config/db');

// Crear un nuevo intercambio con zapatillas aceptadas
const createExchange = async (snkr_id, user_id, size, condition, duration, acceptedSneakers = []) => {
    const client = await pool.connect();
    console.log("Datos procesados en el modelo:", { snkr_id, user_id, size, condition, duration, acceptedSneakers });

    try {
        await client.query("BEGIN");

        // Crear el intercambio principal
        const exchangeResult = await client.query(
            `INSERT INTO exchanges (snkr_id, user_id, size, condition, status, duration, created_at)
             VALUES ($1, $2, $3, $4, 'pendiente', $5, NOW()) RETURNING *`,
            [snkr_id, user_id, size, condition, duration]
        );

        const exchangeId = exchangeResult.rows[0].id;

        // Solo agregar solicitudes si hay zapatillas aceptadas
        if (acceptedSneakers.length > 0) {
            for (const sneaker of acceptedSneakers) {
                console.log("Registrando zapatilla aceptada:", sneaker);
                await client.query(
                    `INSERT INTO exchange_requests (exchange_id, snkr_id, size, condition, created_at)
                     VALUES ($1, $2, $3, $4, NOW())`,
                    [exchangeId, sneaker.snkr_id, sneaker.size, sneaker.condition]
                );
            }
        }

        await client.query("COMMIT");
        return exchangeResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en la transacción:", error);
        throw error;
    } finally {
        client.release();
    }
};

// Obtener intercambios activos para un usuario con información adicional
const getActiveExchanges = async (userId) => {
    const result = await pool.query(`
        SELECT 
            e.id,
            e.size,
            e.condition,
            e.status,
            e.duration,
            e.created_at,
            s.name AS sneaker_name,
            s.image_url AS image_url
        FROM exchanges e
        JOIN snkrs s ON e.snkr_id = s.id
        WHERE e.user_id = $1
        ORDER BY e.created_at DESC
    `, [userId]);

    console.log("Resultado de la consulta:", result.rows); // Agrega este log

    return result.rows.map((row) => ({
        ...row,
        time_left: Math.max(0, Math.ceil((new Date(row.created_at).getTime() + row.duration * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) // Calcula los días restantes
    }));
};


// Obtener intercambios activos con paginación
const getExchangesWithPagination = async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query(
        `SELECT * FROM exchanges 
         WHERE NOW() - created_at <= INTERVAL '30 days' 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
};

// Actualizar un intercambio con zapatillas aceptadas
const updateExchangeAcceptedSneakers = async (exchangeId, acceptedSneakers) => {
    const client = await pool.connect();
    console.log(`Actualizando intercambio ID ${exchangeId} con zapatillas:`, acceptedSneakers);

    try {
        await client.query("BEGIN");

        for (const sneaker of acceptedSneakers) {
            await client.query(
                `INSERT INTO exchange_requests (exchange_id, snkr_id, size, condition, created_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [exchangeId, sneaker.snkr_id, sneaker.size || 'CUALQUIERA', sneaker.condition || 'CUALQUIERA']
            );
        }

        await client.query("COMMIT");

        // Devolver el intercambio actualizado
        const result = await client.query(
            `SELECT * FROM exchanges WHERE id = $1`,
            [exchangeId]
        );

        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error al actualizar zapatillas aceptadas:", error);
        throw error;
    } finally {
        client.release();
    }
};

// Actualizar un intercambio
const updateExchange = async (id, status, condition) => {
    const result = await pool.query(
        `UPDATE exchanges 
         SET status = $1, condition = $2 
         WHERE id = $3 RETURNING *`,
        [status, condition, id]
    );
    return result.rows[0];
};

// Eliminar un intercambio
const deleteExchange = async (id) => {
    const result = await pool.query(
        `DELETE FROM exchanges WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};

// Eliminar intercambios expirados
const deleteExpiredExchanges = async () => {
    const result = await pool.query(`
        DELETE FROM exchanges
        WHERE created_at + (duration || ' days')::interval < NOW()
    `);
    return result.rowCount;
};

module.exports = {
    createExchange,
    getActiveExchanges,
    getExchangesWithPagination,
    updateExchangeAcceptedSneakers,
    updateExchange,
    deleteExchange,
    deleteExpiredExchanges,
};
