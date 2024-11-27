const PreciosUserModel = require('../models/users_price');
const SnkrModel = require('../models/snkrs'); // Para validar zapatillas
const UsuariosModel = require('../models/usuarios'); // Para validar usuarios

// Obtener precios mínimos por talla para una zapatilla
const getPreciosBySnkr = async (req, res) => {
    const { zapatilla_id } = req.params;

    try {
        // Verificar que la zapatilla existe
        const zapatilla = await SnkrModel.getZapatillaById(zapatilla_id);
        if (!zapatilla) {
            return res.status(404).json({ error: 'Zapatilla no encontrada' });
        }

        // Obtener precios mínimos por talla
        const precios = await PreciosUserModel.getMinPreciosByZapatilla(zapatilla_id);

        // Devolver solo los campos necesarios
        const preciosFiltrados = precios.map((precio) => ({
            size: precio.size,
            min_price: parseFloat(precio.min_price), // Aseguramos que sea un número
        }));

        res.status(200).json(preciosFiltrados);
    } catch (error) {
        console.error('Error al obtener precios:', error);
        res.status(500).json({ error: 'Error al obtener precios' });
    }
};


// Crear o actualizar un precio definido por un usuario
const createPrecio = async (req, res) => {
    const { zapatilla_id, user_id, size, price } = req.body;

    try {
        // Validar que la zapatilla existe
        const zapatilla = await SnkrModel.getZapatillaById(zapatilla_id);
        if (!zapatilla) {
            return res.status(404).json({ error: 'Zapatilla no encontrada' });
        }

        // Validar que el usuario existe
        const usuario = await UsuariosModel.findUserById(user_id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Obtener el precio mínimo actual para esa talla
        const precioMinimoActual = await PreciosUserModel.getMinPrecioByZapatillaAndSize(zapatilla_id, size);

        // Validar que el precio es menor que el mínimo actual
        if (precioMinimoActual && price >= precioMinimoActual) {
            return res.status(400).json({
                error: 'El precio debe ser menor que el precio actual para esta talla',
                precioMinimoActual,
            });
        }

        // Crear o actualizar el precio
        const nuevoPrecio = await PreciosUserModel.createOrUpdatePrecio(zapatilla_id, user_id, size, price);

        res.status(201).json(nuevoPrecio);
    } catch (error) {
        console.error('Error al crear o actualizar precio:', error);
        res.status(500).json({ error: 'Error al crear o actualizar precio' });
    }
};

module.exports = {
    getPreciosBySnkr,
    createPrecio,
};
