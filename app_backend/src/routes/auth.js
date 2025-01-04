const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const verifyToken = require('../middleware/authMiddleware');

// Ruta para iniciar sesión
router.post('/login', AuthController.login);

// Ruta para registrar un nuevo usuario
router.post('/register', AuthController.register);

// Ruta protegida para obtener datos del usuario autenticado
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ message: "Acceso permitido", user: req.user });
});

module.exports = router;
