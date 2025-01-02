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

const searchSnkrs = async (req, res) => {
    const { query } = req.query; // Término de búsqueda recibido del frontend
    try {
        const results = await SnkrModel.searchSnkrs(query); // Llama al modelo para buscar
        res.status(200).json(results);
    } catch (error) {
        console.error('Error al buscar zapatillas:', error);
        res.status(500).json({ error: 'Error al buscar zapatillas' });
    }
};

const searchByName = async (query) => {
    const result = await pool.query(
        'SELECT * FROM snkrs WHERE name ILIKE $1',
        [`%${query}%`]
    );
    return result.rows;
};

module.exports = {
    getSnkrs,
    createSnkr,
    getSnkrById,
    searchSnkrs,
    searchByName,
};
