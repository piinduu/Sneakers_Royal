const pool = require('./db');

const createTables = async () => {
    try {
        // Crear tabla usuarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                direccion TEXT,
                telefono VARCHAR(15),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla snkr (zapatillas)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS snkr (
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

        // Crear tabla precios_user
        await pool.query(`
            CREATE TABLE IF NOT EXISTS precios_user (
                id SERIAL PRIMARY KEY,
                zapatilla_id INT REFERENCES snkr(id) ON DELETE CASCADE,
                user_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
                size VARCHAR(10) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla intercambios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS intercambios (
                id SERIAL PRIMARY KEY,
                zapatilla_id INT REFERENCES snkr(id) ON DELETE CASCADE,
                user_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
                size VARCHAR(10) NOT NULL,
                status VARCHAR(20) DEFAULT 'pendiente',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Tablas creadas exitosamente.');
        pool.end(); // Cierra la conexión con la base de datos
    } catch (error) {
        console.error('Error creando las tablas:', error);
        pool.end(); // Asegúrate de cerrar la conexión en caso de error
    }
};

createTables();
