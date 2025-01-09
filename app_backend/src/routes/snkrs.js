const express = require('express');
const router = express.Router();
const SnkrController = require('../controllers/snkrs');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticación

// Ruta para buscar zapatillas (pública)
router.get('/search', SnkrController.searchSnkrs);

// Ruta para obtener todas las zapatillas (pública)
router.get('/', SnkrController.getSnkrs);

// Ruta para obtener una zapatilla específica por ID (pública)
router.get('/:id', SnkrController.getSnkrById);

// Ruta para crear una nueva zapatilla (protegida, solo para administradores)
router.post('/', authMiddleware, SnkrController.createSnkr);

module.exports = router;