const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuariosModel = require('../models/usuarios');

// Manejar el registro
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validar si el usuario ya existe
        const existingUserByEmail = await UsuariosModel.findUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'El email ya está en uso' });
        }

        const existingUserByUsername = await UsuariosModel.findUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await UsuariosModel.createUsuario(username, email, hashedPassword, null);

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
        const user = await UsuariosModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secreto', // Clave secreta para firmar el token
            { expiresIn: '1h' } // Duración del token
        );

        res.status(200).json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    register,
    login,
};
