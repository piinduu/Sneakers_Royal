const { getSnkrs, createSnkr, getSnkrById, searchSnkrs } = require('../controllers/snkrs.controller');
const SnkrModel = require('../models/snkrs');

jest.mock('../models/snkrs');

describe('Controlador de Snkrs', () => {
    describe('getSnkrs', () => {
        it('debe devolver todas las zapatillas', async () => {
            const mockData = [
                { id: 1, name: 'Nike Air Jordan', retail_price: 150 },
                { id: 2, name: 'Adidas Yeezy Boost', retail_price: 200 },
            ];

            SnkrModel.getSnkrs.mockResolvedValue(mockData);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getSnkrs(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        it('debe devolver un error 500 si ocurre un fallo', async () => {
            SnkrModel.getSnkrs.mockRejectedValue(new Error('Database error'));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await getSnkrs(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al obtener zapatillas');
        });
    });

    describe('createSnkr', () => {
        it('debe crear una nueva zapatilla', async () => {
            const newSnkr = {
                id: 1,
                name: 'Nike Dunk Low',
                retail_price: 120,
            };

            SnkrModel.createSnkr.mockResolvedValue(newSnkr);

            const req = {
                body: {
                    style_id: '12345',
                    name: 'Nike Dunk Low',
                    colorway: 'Black/White',
                    description: 'Classic Dunk silhouette',
                    release_date: '2023-01-01',
                    retail_price: 120,
                    image_url: 'https://example.com/image.jpg',
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createSnkr(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newSnkr);
        });

        it('debe devolver un error 500 si ocurre un fallo', async () => {
            SnkrModel.createSnkr.mockRejectedValue(new Error('Database error'));

            const req = {
                body: {
                    style_id: '12345',
                    name: 'Nike Dunk Low',
                    colorway: 'Black/White',
                    description: 'Classic Dunk silhouette',
                    release_date: '2023-01-01',
                    retail_price: 120,
                    image_url: 'https://example.com/image.jpg',
                },
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await createSnkr(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al crear zapatilla');
        });
    });
});
