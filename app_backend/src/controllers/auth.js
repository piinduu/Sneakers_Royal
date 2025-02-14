const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsersModel = require('../models/users');

// Manejar el registro
const register = async (req, res) => {
    const { username, email, password, direccion = null } = req.body; // Direccion por defecto es null

    try {
        // Validar si el usuario ya existe
        const existingUserByEmail = await UsersModel.findUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'El email ya está en uso' });
        }

        const existingUserByUsername = await UsersModel.findUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await UsersModel.createUser(username, email, hashedPassword, direccion);

        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Manejar el inicio de sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await UsersModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: true, message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secreto', // Clave secreta para firmar el token
            { expiresIn: '1h', algorithm: 'HS512' } // Duración del token y algoritmo seguro
        );

        res.status(200).json({
            error: false,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                direccion: user.direccion,
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: true, message: 'Error en el servidor' });
    }
};

module.exports = {
    register,
    login,
};
