const pool = require('../config/db');

// Obtener precios mínimos por talla para una zapatilla
const getMinPricesBySnkr = async (snkr_id) => {
    const result = await pool.query(`
        WITH all_sizes AS (
            SELECT generate_series(35, 50) AS size -- Genera todas las tallas entre 35 y 50
        )
        SELECT 
            all_sizes.size::VARCHAR AS size, 
            COALESCE(MIN(up.price), s.retail_price) AS min_price
        FROM all_sizes
        LEFT JOIN user_prices up ON up.size::INTEGER = all_sizes.size AND up.snkr_id = $1
        LEFT JOIN snkrs s ON s.id = $1
        GROUP BY all_sizes.size, s.retail_price
        ORDER BY all_sizes.size;
    `, [snkr_id]);
    return result.rows;
};


// Obtener el precio más bajo actual para una zapatilla y talla
const getLowestPriceBySnkr = async (snkr_id, size) => {
    const result = await pool.query(`
        SELECT price
        FROM lowest_prices
        WHERE snkr_id = $1 AND size = $2
    `, [snkr_id, size]);
    return result.rows[0];
};

// Crear o actualizar un precio definido por un usuario
const createOrUpdatePrice = async (snkr_id, user_id, size, price) => {
    const existingPrice = await pool.query(`
        SELECT * FROM user_prices
        WHERE snkr_id = $1 AND user_id = $2 AND size = $3
    `, [snkr_id, user_id, size]);

    if (existingPrice.rows.length > 0) {
        // Actualizar el precio existente
        const result = await pool.query(`
            UPDATE user_prices
            SET price = $1
            WHERE snkr_id = $2 AND user_id = $3 AND size = $4
            RETURNING *
        `, [price, snkr_id, user_id, size]);
        return result.rows[0];
    } else {
        // Insertar un nuevo precio
        const result = await pool.query(`
            INSERT INTO user_prices (snkr_id, user_id, size, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [snkr_id, user_id, size, price]);
        return result.rows[0];
    }
};

// Actualizar la tabla `lowest_prices` con el precio más bajo
const updateLowestPrice = async (snkr_id, user_id, size, price) => {
    await pool.query(`
        INSERT INTO lowest_prices (snkr_id, size, price, user_id, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (snkr_id, size)
        DO UPDATE SET price = EXCLUDED.price, user_id = EXCLUDED.user_id, created_at = NOW()
        WHERE lowest_prices.price > EXCLUDED.price
    `, [snkr_id, size, price, user_id]);
};

module.exports = {
    getMinPricesBySnkr,
    getLowestPriceBySnkr,
    createOrUpdatePrice,
    updateLowestPrice,
};
