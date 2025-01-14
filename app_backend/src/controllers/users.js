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

const updateUser = async (req, res) => {
    const userId = req.user.id; // ID del usuario autenticado (se obtiene del token)
    const { username, email, password, direccion, telefono } = req.body;

    console.log('Inicio de updateUser');
    console.log('Campos recibidos del cuerpo de la solicitud:', { username, email, password, direccion, telefono });
    console.log('ID del usuario autenticado:', userId);

    // Validar si al menos uno de los campos ha sido proporcionado
    if (!username && !email && !password && !direccion && !telefono) {
        console.error('Error: No se proporcionó ningún campo para actualizar');
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar.' });
    }

    try {
        // Construir la consulta dinámica con los campos proporcionados
        const fields = [];
        const values = [];
        let index = 1;

        if (username) {
            fields.push(`username = $${index++}`);
            values.push(username);
        }
        if (email) {
            fields.push(`email = $${index++}`);
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push(`password = $${index++}`);
            values.push(hashedPassword);
        }
        if (direccion) {
            fields.push(`direccion = $${index++}`);
            values.push(direccion);
        }
        if (telefono) {
            fields.push(`telefono = $${index++}`);
            values.push(telefono);
        }

        // Agregar el ID del usuario al final de los valores
        values.push(userId);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING id, username, email, direccion, telefono, created_at;
        `;

        console.log('Consulta generada:', query);
        console.log('Valores para la consulta:', values);

        const result = await pool.query(query, values);

        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length === 0) {
            console.error('Error: Usuario no encontrado');
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        console.log('Usuario actualizado con éxito:', result.rows[0]);
        res.status(200).json({ message: 'Usuario actualizado con éxito.', user: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario.' });
    }
};

module.exports = { getUsers, createUser, getUserDetails, updateUser };
