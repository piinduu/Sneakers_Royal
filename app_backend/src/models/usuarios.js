const pool = require('../config/db');

// Obtener todos los usuarios
const getUsuarios = async () => {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
};

// Crear un nuevo usuario
const createUsuario = async (username, email, password, direccion) => {
    const result = await pool.query(
        'INSERT INTO usuarios (username, email, password, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, password, direccion]
    );
    return result.rows[0];
};

// Buscar un usuario por correo electrónico
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0]; // Devuelve el usuario encontrado o `undefined`
};

// Buscar un usuario por nombre de usuario
const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    return result.rows[0]; // Devuelve el usuario encontrado o `undefined`
};



module.exports = {
    getUsuarios,
    createUsuario,
    findUserByEmail,
    findUserByUsername
};
