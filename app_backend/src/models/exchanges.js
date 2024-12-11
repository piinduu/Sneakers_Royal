const pool = require('../config/db');

// Crear un nuevo intercambio
const createExchange = async (snkr_id, user_id, size, condition, status, duration) => {
    const result = await pool.query(
        `INSERT INTO exchanges (snkr_id, user_id, size, condition, status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [snkr_id, user_id, size, condition, status]
    );
    return result.rows[0];
};

// Obtener intercambios activos
const getActiveExchanges = async () => {
    const result = await pool.query(`
        SELECT * 
        FROM exchanges 
        WHERE NOW() - created_at <= INTERVAL '30 days'
        ORDER BY created_at DESC
    `);
    return result.rows;
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
    return result.rows[0]; // Devuelve el registro eliminado si existía
};

const deleteExpiredExchanges = async () => {
    const result = await pool.query(`
        DELETE FROM exchanges
        WHERE created_at + (duration || ' days')::interval < NOW()
    `);
    return result;
};

module.exports = {
    createExchange,
    getActiveExchanges,
    getExchangesWithPagination,
    updateExchange,
    deleteExchange,
    deleteExpiredExchanges,
};
