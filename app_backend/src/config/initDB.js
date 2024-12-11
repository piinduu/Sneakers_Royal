const pool = require('./db');

const createTables = async () => {
    try {
        // Crear tabla users
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                direccion TEXT,
                telefono VARCHAR(15),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla snkrs
        await pool.query(`
            CREATE TABLE IF NOT EXISTS snkrs (
                id SERIAL PRIMARY KEY,
                style_id VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                colorway VARCHAR(100),
                description TEXT,
                release_date DATE,
                retail_price NUMERIC(10, 2),
                image_url TEXT
            );
        `);

        // Crear tabla user_prices
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_prices (
                id SERIAL PRIMARY KEY,
                snkr_id INT REFERENCES snkrs(id) ON DELETE CASCADE,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                size VARCHAR(10) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla exchanges
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exchanges (
                id SERIAL PRIMARY KEY,
                snkr_id INT REFERENCES snkrs(id) ON DELETE CASCADE,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                size VARCHAR(10) NOT NULL,
                condition VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pendiente',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla exchange_requests
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exchange_requests (
                id SERIAL PRIMARY KEY,
                exchange_id INT REFERENCES exchanges(id) ON DELETE CASCADE,
                snkr_id INT REFERENCES snkrs(id) ON DELETE CASCADE,
                size VARCHAR(10) NOT NULL,
                condition VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tablas creadas exitosamente.');
        pool.end();
    } catch (error) {
        console.error('Error creando las tablas:', error);
        pool.end();
    }
};

createTables();
