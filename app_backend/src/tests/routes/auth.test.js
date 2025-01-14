const request = require('supertest');
const app = require('../../index'); // Asegúrate de que exportas el app en index.js

describe('Auth Routes', () => {
    it('should login a user and return a token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
