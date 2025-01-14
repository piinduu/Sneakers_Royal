const puppeteer = require('puppeteer');
const pool = require('../config/db'); // Configuración de la base de datos

const fetchUpcomingReleases = async () => {
    try {
        console.log("Iniciando scraping con Puppeteer...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const url = "https://todosneakers.com/lanzamientos-de-sneakers";
        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log("Página cargada. Extrayendo datos...");
        const releases = await page.evaluate(() => {
            const items = [];
            document.querySelectorAll(".grid-item").forEach((element) => {
                const name = element.querySelector(".title")?.textContent.trim();
                const releaseDate = element.querySelector(".date")?.textContent.trim();
                if (name && releaseDate) {
                    items.push({ name, release_date: releaseDate });
                }
            });
            return items;
        });

        console.log("Lanzamientos extraídos:", releases);

        if (releases.length === 0) {
            console.log("No se encontraron lanzamientos. Verifica la estructura de la página.");
            await browser.close();
            return;
        }

        // Insertar los lanzamientos en la base de datos
        for (const release of releases) {
            try {
                const styleId = release.name.replace(/\s+/g, '-').toLowerCase();
                const result = await pool.query(
                    `INSERT INTO snkrs (style_id, name, release_date)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (style_id) DO NOTHING`,
                    [styleId, release.name, new Date(release.release_date)]
                );

                if (result.rowCount > 0) {
                    console.log(`Lanzamiento añadido: ${release.name} (${release.release_date})`);
                } else {
                    console.log(`Lanzamiento omitido (ya existe): ${release.name}`);
                }
            } catch (err) {
                console.error(`Error al insertar ${release.name}:`, err.message);
            }
        }

        console.log("Lanzamientos actualizados en la base de datos.");
        await browser.close();
    } catch (error) {
        console.error("Error al realizar el scraping con Puppeteer:", error.message);
    }
};

fetchUpcomingReleases();
