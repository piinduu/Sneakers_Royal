const pool = require('../config/db');

// Obtener precios de usuarios para una zapatilla específica
const getPreciosByZapatilla = async (zapatilla_id) => {
    const result = await pool.query('SELECT * FROM precios_user WHERE zapatilla_id = $1', [zapatilla_id]);
    return result.rows;
};

// Crear un precio definido por un usuario
const createPrecio = async (zapatilla_id, user_id, size, price) => {
    const result = await pool.query(
        'INSERT INTO precios_user (zapatilla_id, user_id, size, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [zapatilla_id, user_id, size, price]
    );
    return result.rows[0];
};

module.exports = {
    getPreciosByZapatilla,
    createPrecio,
};
