const express = require('express');
const router = express.Router();
const { getUsuarios, createUsuario } = require('../controllers/usuarios');

// Ruta para obtener todos los usuarios
router.get('/', getUsuarios);

// Ruta para crear un usuario
router.post('/', createUsuario);

module.exports = router;