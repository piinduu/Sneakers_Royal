const pool = require('../config/db');

// Obtener todas las zapatillas
const getSnkrs = async () => {
    const result = await pool.query('SELECT * FROM snkrs');
    return result.rows;
};

// Crear una nueva zapatilla
const createSnkr = async (style_id, name, colorway, description, release_date, retail_price, image_url) => {
    const result = await pool.query(
        'INSERT INTO snkrs (style_id, name, colorway, description, release_date, retail_price, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [style_id, name, colorway, description, release_date, retail_price, image_url]
    );
    return result.rows[0];
};

// Obtener una zapatilla por su ID
const getSnkrById = async (id) => {
    const result = await pool.query('SELECT * FROM snkrs WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getSnkrs,
    createSnkr,
    getSnkrById,
};
