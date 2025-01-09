const UserPricesModel = require('../models/users_price');
const SnkrModel = require('../models/snkrs');

// Obtener precios mínimos por talla para una zapatilla
const getPricesBySnkr = async (req, res) => {
    const { snkr_id } = req.params;
    try {
        const prices = await UserPricesModel.getMinPricesBySnkr(snkr_id);
        res.status(200).json(prices);
    } catch (error) {
        console.error('Error al obtener precios:', error);
        res.status(500).json({ error: 'Error al obtener precios' });
    }
};

// Crear o actualizar un precio definido por un usuario
const createPrice = async (req, res) => {
    const { snkr_id, size, price } = req.body;
    const user_id = req.user.id; // Extraer el ID del usuario autenticado

    try {
        // Validar que la zapatilla existe
        const snkr = await SnkrModel.getSnkrById(snkr_id);
        if (!snkr) {
            return res.status(404).json({ error: 'Zapatilla no encontrada' });
        }

        // Validar si el precio es menor al precio más bajo actual
        const lowestPrice = await UserPricesModel.getLowestPriceBySnkr(snkr_id, size);
        if (lowestPrice && price >= lowestPrice.price) {
            return res.status(400).json({
                error: `El precio debe ser menor que el precio actual más bajo: €${lowestPrice.price}`,
            });
        }

        // Crear o actualizar el precio en `user_prices`
        const newPrice = await UserPricesModel.createOrUpdatePrice(snkr_id, user_id, size, price);

        // Actualizar la tabla `lowest_prices`
        await UserPricesModel.updateLowestPrice(snkr_id, user_id, size, price);

        res.status(201).json(newPrice);
    } catch (error) {
        console.error('Error al crear o actualizar precio:', error);
        res.status(500).json({ error: 'Error al crear o actualizar precio' });
    }
};

module.exports = {
    getPricesBySnkr,
    createPrice,
};
