const pool = require('./db');

const seedDB = async () => {
    try {
        // Insertar usuarios
        await pool.query(`
            INSERT INTO usuarios (username, email, password, direccion, telefono)
            VALUES
                ('Antonio Perez', 'antonio.perez@email.com', 'password123', 'Calle Gran Vía 45, Madrid', '612345678'),
                ('María López', 'maria.lopez@email.com', 'password456', 'Calle Alcalá 100, Madrid', '622345678'),
                ('Carlos García', 'carlos.garcia@email.com', 'password789', 'Paseo de la Castellana 200, Madrid', '632345678')
            ON CONFLICT (email) DO NOTHING;
        `);

        // Insertar zapatillas
        await pool.query(`
            INSERT INTO snkr (style_id, name, colorway, description, release_date, retail_price, image_url)
            VALUES
                ('AJ1-OG', 'Jordan 1 Retro High OG', 'Black/White/Red', 'Classic high-top sneaker', '2024-01-01', 170.00, 'https://via.placeholder.com/150'),
                ('YZB-V2', 'Yeezy Boost 350 V2', 'Beluga Reflective', 'Comfortable and stylish', '2023-10-10', 220.00, 'https://via.placeholder.com/150'),
                ('DUNK-LOW', 'Nike Dunk Low', 'Panda', 'Sleek and trendy', '2023-05-15', 100.00, 'https://via.placeholder.com/150'),
                ('FORCE-1', 'Air Force 1 Low', 'White', 'Timeless design', '2020-08-25', 90.00, 'https://via.placeholder.com/150'),
                ('NB-990', 'New Balance 990v5', 'Gray', 'Classic running shoe', '2019-04-10', 175.00, 'https://via.placeholder.com/150'),
                ('SB-DUNK', 'Nike SB Dunk Low', 'What The P-Rod', 'Unique colorway', '2021-11-20', 150.00, 'https://via.placeholder.com/150'),
                ('ULTRA-BOOST', 'Adidas UltraBoost 21', 'Core Black', 'High-performance running shoe', '2022-06-15', 180.00, 'https://via.placeholder.com/150'),
                ('CONVERSE-CT', 'Converse Chuck Taylor', 'Black/White', 'Classic canvas sneaker', '1980-01-01', 55.00, 'https://via.placeholder.com/150'),
                ('VANS-ERA', 'Vans Era', 'Checkerboard', 'Casual skater style', '1995-03-20', 50.00, 'https://via.placeholder.com/150'),
                ('REACT-INFINITY', 'Nike React Infinity Run', 'Black/Volt', 'Designed to reduce injuries', '2022-09-01', 160.00, 'https://via.placeholder.com/150')
            ON CONFLICT (style_id) DO NOTHING;
        `);

        // Insertar precios definidos por usuarios
        await pool.query(`
            INSERT INTO precios_user (zapatilla_id, user_id, size, price)
            VALUES
                (1, 1, '9', 250.00),
                (1, 2, '10', 270.00),
                (2, 3, '8', 300.00),
                (3, 1, '9.5', 110.00),
                (4, 2, '8', 100.00),
                (5, 3, '9', 180.00)
            ON CONFLICT DO NOTHING;
        `);

        // Insertar intercambios
        await pool.query(`
            INSERT INTO intercambios (zapatilla_id, user_id, size, status)
            VALUES
                (1, 1, '9', 'pendiente'),
                (2, 2, '8', 'aceptado'),
                (3, 3, '10', 'pendiente')
            ON CONFLICT DO NOTHING;
        `);

        console.log('Base de datos inicializada con datos de ejemplo.');
        pool.end(); // Cierra la conexión con la base de datos
    } catch (error) {
        console.error('Error insertando datos iniciales:', error);
        pool.end();
    }
};

seedDB();
