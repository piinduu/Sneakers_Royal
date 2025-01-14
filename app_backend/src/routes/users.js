const express = require('express');
const router = express.Router();
const { getUsers, createUser, getUserDetails, updateUser } = require('../controllers/users');
const verifyToken = require('../middleware/authMiddleware');

// Ruta protegida para obtener los datos del usuario autenticado
router.get('/me', verifyToken, getUserDetails);

// Ruta pública para crear un usuario
router.post('/', createUser);

// Ruta protegida para obtener todos los usuarios (solo como ejemplo)
router.get('/', verifyToken, getUsers);

// Ruta protegida para actualizar los datos del usuario autenticado
router.put('/me', verifyToken, updateUser);


module.exports = router;
