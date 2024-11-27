const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

// Ruta para iniciar sesión
router.post('/login', AuthController.login);

// RUta para registro de usuario
router.post('/register', AuthController.register);

module.exports = router;
