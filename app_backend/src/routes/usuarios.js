const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/users');

// Ruta para obtener todos los usuarios
router.get('/', getUsers);

// Ruta para crear un usuario
router.post('/', createUser);

module.exports = router;