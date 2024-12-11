const pool = require('./db');

const seedDB = async () => {
    try {
        // Insertar usuarios
        await pool.query(`
            INSERT INTO users (username, email, password, direccion, telefono)
            VALUES
                ('Antonio Perez', 'antonio.perez@email.com', 'password123', 'Calle Gran Vía 45, Madrid', '612345678'),
                ('María López', 'maria.lopez@email.com', 'password456', 'Calle Alcalá 100, Madrid', '622345678'),
                ('Carlos García', 'carlos.garcia@email.com', 'password789', 'Paseo de la Castellana 200, Madrid', '632345678')
            ON CONFLICT (email) DO NOTHING;
        `);

        // Insertar zapatillas
        await pool.query(`
            INSERT INTO snkrs (style_id, name, colorway, description, release_date, retail_price, image_url)
            VALUES
                ('AJ1-OG', 'Jordan 1 Retro High OG', 'Black/White/Red', 'Classic high-top sneaker', '2024-01-01', 170.00, 'https://via.placeholder.com/150'),
                ('YZB-V2', 'Yeezy Boost 350 V2', 'Beluga Reflective', 'Comfortable and stylish', '2023-10-10', 220.00, 'https://via.placeholder.com/150')
            ON CONFLICT (style_id) DO NOTHING;
        `);

        console.log('Datos insertados exitosamente.');
        pool.end();
    } catch (error) {
        console.error('Error insertando datos:', error);
        pool.end();
    }
};

seedDB();
