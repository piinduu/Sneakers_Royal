const pool = require('../config/db');

// Obtener todos los precios para una zapatilla específica
const getPreciosByZapatilla = async (zapatilla_id) => {
    const result = await pool.query(
        'SELECT * FROM precios_user WHERE zapatilla_id = $1 ORDER BY size, price ASC',
        [zapatilla_id]
    );
    return result.rows;
};

// Obtener el precio mínimo para cada talla de una zapatilla
const getMinPreciosByZapatilla = async (zapatilla_id) => {
    const result = await pool.query(`
        SELECT size, MIN(price) AS min_price
        FROM precios_user
        WHERE zapatilla_id = $1
        GROUP BY size
        ORDER BY size ASC
    `, [zapatilla_id]);
    return result.rows;
};

// Obtener el precio mínimo para una talla específica de una zapatilla
const getMinPrecioByZapatillaAndSize = async (zapatilla_id, size) => {
    const result = await pool.query(
        'SELECT MIN(price) AS min_price FROM precios_user WHERE zapatilla_id = $1 AND size = $2',
        [zapatilla_id, size]
    );
    return result.rows[0]?.min_price || null;
};

// Crear o actualizar un precio definido por un usuario
const createOrUpdatePrecio = async (zapatilla_id, user_id, size, price) => {
    // Verificar si el usuario ya tiene un precio definido para esta talla y zapatilla
    const existingPrecio = await pool.query(
        'SELECT * FROM precios_user WHERE zapatilla_id = $1 AND user_id = $2 AND size = $3',
        [zapatilla_id, user_id, size]
    );

    if (existingPrecio.rows.length > 0) {
        // Si ya existe, actualizamos el precio
        const result = await pool.query(
            'UPDATE precios_user SET price = $1 WHERE zapatilla_id = $2 AND user_id = $3 AND size = $4 RETURNING *',
            [price, zapatilla_id, user_id, size]
        );
        return result.rows[0];
    } else {
        // Si no existe, creamos un nuevo registro
        const result = await pool.query(
            'INSERT INTO precios_user (zapatilla_id, user_id, size, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [zapatilla_id, user_id, size, price]
        );
        return result.rows[0];
    }
};

module.exports = {
    getPreciosByZapatilla,
    getMinPreciosByZapatilla,
    getMinPrecioByZapatillaAndSize,
    createOrUpdatePrecio,
};
