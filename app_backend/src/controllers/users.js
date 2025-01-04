const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('Error al obtener usuarios');
    }
};

// Crear un usuario
const createUser = async (req, res) => {
    const { username, email, password, direccion } = req.body;
    try {
        // Encriptar la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error al crear usuario');
    }
};

// Obtener los datos del usuario autenticado
const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // `req.user` contiene el ID del usuario autenticado (gracias al middleware)
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { password, ...userWithoutPassword } = result.rows[0]; // Excluir la contraseña al devolver el usuario
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).send('Error al obtener los datos del usuario');
    }
};

module.exports = { getUsers, createUser, getUserDetails };
