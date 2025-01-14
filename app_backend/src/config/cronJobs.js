const cron = require('node-cron');
const ExchangeModel = require('../models/exchanges');
const fetchUpcomingReleases = require('../scripts/fetchUpcomingReleases');

// Función para limpiar intercambios expirados
const cleanExpiredExchanges = async () => {
    try {
        console.log('Iniciando limpieza de intercambios expirados...');
        const result = await ExchangeModel.deleteExpiredExchanges();
        console.log(`Se eliminaron ${result.rowCount} intercambios expirados.`);
    } catch (error) {
        console.error('Error al limpiar intercambios expirados:', error);
    }
};

// Programar la tarea para que se ejecute diariamente a la medianoche
cron.schedule('0 0 * * *', cleanExpiredExchanges);
console.log('Cron job de limpieza de intercambios programado.');

// Función para actualizar lanzamientos de zapatillas
const updateSneakerReleases = async () => {
    try {
        console.log('Iniciando actualización de lanzamientos de zapatillas...');
        await fetchUpcomingReleases();
        console.log('Actualización de lanzamientos completada.');
    } catch (error) {
        console.error('Error al actualizar lanzamientos de zapatillas:', error);
    }
};

// Programar la tarea para que se ejecute diariamente a las 3:00 AM
cron.schedule('0 3 * * *', updateSneakerReleases);
console.log('Cron job de actualización de lanzamientos programado.');
