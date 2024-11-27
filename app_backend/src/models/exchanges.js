const pool = require('../config/db');

// Obtener todos los intercambios
const getIntercambios = async () => {
    const result = await pool.query('SELECT * FROM intercambios');
    return result.rows;
};

// Crear un intercambio
const createIntercambio = async (zapatilla_id, user_id, size, status) => {
    const result = await pool.query(
        'INSERT INTO intercambios (zapatilla_id, user_id, size, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [zapatilla_id, user_id, size, status]
    );
    return result.rows[0];
};

module.exports = {
    getIntercambios,
    createIntercambio,
};
