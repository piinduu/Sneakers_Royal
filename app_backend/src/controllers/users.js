const pool = require('../config/db');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener usuarios');
    }
};

// Crear un usuario
const createUser = async (req, res) => {
    const { username, email, password, direccion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (username, email, password, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, password, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear usuario');
    }
};

module.exports = { getUsers, createUser };
