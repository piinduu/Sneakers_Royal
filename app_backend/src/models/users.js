const pool = require('../config/db');

// Obtener todos los usuarios
const getUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// Crear un nuevo usuario con contraseña encriptada
const createUser = async (username, email, password, direccion) => {
    const result = await pool.query(
        'INSERT INTO users (username, email, password, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, password, direccion]
    );
    return result.rows[0];
};

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Buscar un usuario por nombre de usuario
const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

// Buscar un usuario por su ID
const findUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    getUsers,
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserById
};
