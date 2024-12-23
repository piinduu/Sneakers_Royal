const pool = require('../config/db');

// Obtener todos los precios para una zapatilla específica
const getPricesBySnkr = async (snkr_id) => {
    const result = await pool.query(
        'SELECT * FROM user_prices WHERE snkr_id = $1 ORDER BY size, price ASC',
        [snkr_id]
    );
    return result.rows;
};

// Obtener el precio mínimo para cada talla de una zapatilla
const getMinPricesBySnkr = async (snkr_id) => {
    const result = await pool.query(`
        SELECT size, MIN(price) AS min_price
        FROM user_prices
        WHERE snkr_id = $1
        GROUP BY size
        ORDER BY size ASC
    `, [snkr_id]);
    return result.rows;
};

// Obtener el precio actual por snkr_id, user_id y size
const getPriceBySnkrAndUser = async (snkr_id, user_id, size) => {
    const result = await pool.query(
        'SELECT price FROM user_prices WHERE snkr_id = $1 AND user_id = $2 AND size = $3',
        [snkr_id, user_id, size]
    );
    return result.rows[0]; // Devuelve el precio actual o undefined si no existe
};

// Crear o actualizar un precio definido por un usuario
const createOrUpdatePrice = async (snkr_id, user_id, size, price) => {
    const existingPrice = await pool.query(
        'SELECT * FROM user_prices WHERE snkr_id = $1 AND user_id = $2 AND size = $3',
        [snkr_id, user_id, size]
    );

    if (existingPrice.rows.length > 0) {
        // Si ya existe, actualizamos el precio
        const result = await pool.query(
            'UPDATE user_prices SET price = $1 WHERE snkr_id = $2 AND user_id = $3 AND size = $4 RETURNING *',
            [price, snkr_id, user_id, size]
        );
        return result.rows[0];
    } else {
        // Si no existe, creamos un nuevo registro
        const result = await pool.query(
            'INSERT INTO user_prices (snkr_id, user_id, size, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [snkr_id, user_id, size, price]
        );
        return result.rows[0];
    }
};

module.exports = {
    getPricesBySnkr,
    getMinPricesBySnkr,
    getPriceBySnkrAndUser,
    createOrUpdatePrice,
};
