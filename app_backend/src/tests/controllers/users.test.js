const { getUsers, createUser, getUserDetails } = require('../controllers/users.controller');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

jest.mock('../config/db');
jest.mock('bcrypt');

describe('Users Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('debería devolver todos los usuarios', async () => {
            const mockUsers = [
                { id: 1, username: 'user1', email: 'user1@example.com' },
                { id: 2, username: 'user2', email: 'user2@example.com' },
            ];

            pool.query.mockResolvedValue({ rows: mockUsers });

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUsers(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('debería manejar errores al obtener usuarios', async () => {
            pool.query.mockRejectedValue(new Error('Error al obtener usuarios'));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await getUsers(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al obtener usuarios');
        });
    });

    describe('createUser', () => {
        it('debería crear un nuevo usuario', async () => {
            const req = {
                body: {
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    direccion: '123 Street Name',
                },
            };

            const hashedPassword = 'hashedpassword123';
            const mockUser = {
                id: 1,
                username: 'newuser',
                email: 'newuser@example.com',
                direccion: '123 Street Name',
            };

            bcrypt.hash.mockResolvedValue(hashedPassword);
            pool.query.mockResolvedValue({ rows: [mockUser] });

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await createUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (username, email, password, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
                ['newuser', 'newuser@example.com', hashedPassword, '123 Street Name']
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('debería manejar errores al crear un usuario', async () => {
            const req = {
                body: {
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'password123',
                    direccion: '123 Street Name',
                },
            };

            bcrypt.hash.mockRejectedValue(new Error('Error al encriptar contraseña'));

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await createUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al crear usuario');
        });
    });

    describe('getUserDetails', () => {
        it('debería devolver los datos del usuario autenticado', async () => {
            const req = { user: { id: 1 } };
            const mockUser = {
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
                direccion: '123 Street Name',
                password: 'hashedpassword123',
            };

            pool.query.mockResolvedValue({ rows: [mockUser] });

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
                direccion: '123 Street Name',
            });
        });

        it('debería manejar errores si el usuario no existe', async () => {
            const req = { user: { id: 1 } };

            pool.query.mockResolvedValue({ rows: [] });

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getUserDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
        });

        it('debería manejar errores al obtener los datos del usuario', async () => {
            const req = { user: { id: 1 } };

            pool.query.mockRejectedValue(new Error('Error al obtener los datos del usuario'));

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await getUserDetails(req, res);

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error al obtener los datos del usuario');
        });
    });
});