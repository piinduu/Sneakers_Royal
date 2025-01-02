const express = require('express');
const router = express.Router();
const SnkrController = require('../controllers/snkrs');

// Ruta para buscar zapatillas
router.get('/search', SnkrController.searchSnkrs);

// Ruta para obtener todas las zapatillas
router.get('/', SnkrController.getSnkrs);

// Ruta para obtener una zapatilla específica por ID
router.get('/:id', SnkrController.getSnkrById);

// Ruta para crear una nueva zapatilla
router.post('/', SnkrController.createSnkr);

module.exports = router;
