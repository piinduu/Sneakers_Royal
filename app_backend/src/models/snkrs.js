const pool = require('../config/db');

// Obtener todas las zapatillas
const getZapatillas = async () => {
    const result = await pool.query('SELECT * FROM snkr');
    return result.rows;
};

// Crear una nueva zapatilla
const createZapatilla = async (style_id, name, colorway, description, release_date, retail_price, image_url) => {
    const result = await pool.query(
        'INSERT INTO snkr (style_id, name, colorway, description, release_date, retail_price, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [style_id, name, colorway, description, release_date, retail_price, image_url]
    );
    return result.rows[0];
};

module.exports = {
    getZapatillas,
    createZapatilla,
};
