const pool = require('../config/db');

// Obtener todos los exchanges
const getExchanges = async () => {
    const result = await pool.query('SELECT * FROM exchanges');
    return result.rows;
};

// Crear un intercambio
const createExchange = async (snkr_id, user_id, size, status) => {
    const result = await pool.query(
        'INSERT INTO exchanges (snkr_id, user_id, size, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [snkr_id, user_id, size, status]
    );
    return result.rows[0];
};

module.exports = {
    getExchanges,
    createExchange,
};
