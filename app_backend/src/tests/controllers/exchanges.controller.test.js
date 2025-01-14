const {
    getActiveExchanges,
    getExchangesWithPagination,
    createExchange,
    updateExchange,
    updateAcceptedSneakers,
    deleteExchange,
    getAllActiveExchanges,
    getExchangeById
} = require('../controllers/exchanges.controller');

const ExchangeModel = require('../models/exchanges');
const pool = require('../config/db');

jest.mock('../models/exchanges');
jest.mock('../config/db');

describe('Controlador de Exchanges', () => {
    describe('getActiveExchanges', () => {
        it('debe devolver intercambios activos del usuario autenticado', async () => {
            const mockExchanges = [{ id: 1, user_id: 1, status: 'active' }];
            ExchangeModel.getActiveExchanges.mockResolvedValue(mockExchanges);

            const req = { user: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getActiveExchanges(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockExchanges);
        });

        it('debe manejar errores internos', async () => {
            ExchangeModel.getActiveExchanges.mockRejectedValue(new Error('Error interno'));

            const req = { user: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getActiveExchanges(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener intercambios' });
        });
    });

    describe('getExchangesWithPagination', () => {
        it('debe devolver intercambios paginados', async () => {
            const mockExchanges = [{ id: 1 }, { id: 2 }];
            ExchangeModel.getExchangesWithPagination.mockResolvedValue(mockExchanges);

            const req = { query: { page: 1, limit: 10 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getExchangesWithPagination(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockExchanges);
        });
    });

    describe('createExchange', () => {
        it('debe crear un nuevo intercambio con datos válidos', async () => {
            const mockExchange = { id: 1, snkr_id: 123, user_id: 1, size: '42', condition: 'new', duration: 7 };
            ExchangeModel.createExchange.mockResolvedValue(mockExchange);

            const req = {
                body: { snkr_id: 123, size: '42', condition: 'new', duration: 7 },
                user: { id: 1 }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockExchange);
        });

        it('debe devolver un error 400 si faltan datos', async () => {
            const req = { body: {}, user: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await createExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Datos incompletos o incorrectos.' });
        });
    });

    describe('updateExchange', () => {
        it('debe actualizar el estado de un intercambio existente', async () => {
            const mockExchange = { id: 1, status: 'completed' };
            ExchangeModel.updateExchange.mockResolvedValue(mockExchange);

            const req = { params: { id: '1' }, body: { status: 'completed' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await updateExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Intercambio actualizado con éxito.',
                exchange: mockExchange
            });
        });

        it('debe devolver un error 400 si el estado no está presente', async () => {
            const req = { params: { id: '1' }, body: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await updateExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "El campo 'status' es obligatorio." });
        });
    });

    describe('deleteExchange', () => {
        it('debe eliminar un intercambio existente', async () => {
            ExchangeModel.deleteExchange.mockResolvedValue(true);

            const req = { params: { id: '1' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await deleteExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Intercambio eliminado exitosamente' });
        });

        it('debe devolver un error 404 si el intercambio no existe', async () => {
            ExchangeModel.deleteExchange.mockResolvedValue(false);

            const req = { params: { id: '999' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await deleteExchange(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Intercambio no encontrado' });
        });
    });

    describe('getAllActiveExchanges', () => {
        it('debe devolver todos los intercambios activos', async () => {
            const mockExchanges = [{ id: 1, status: 'active' }];
            pool.query.mockResolvedValue({ rows: mockExchanges });

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllActiveExchanges(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockExchanges);
        });
    });
});
