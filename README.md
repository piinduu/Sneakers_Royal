# SNKRS Royal - Plataforma de Compra, Venta e Intercambio de Zapatillas

SNKRS Royal es una plataforma digital diseñada para facilitar la compra, venta e intercambio de zapatillas exclusivas, con especial enfoque en ofrecer una experiencia amigable, segura y accesible.

## 🚀 Características Principales

- **Gestión de productos**: Catálogo de zapatillas, incluyendo próximos lanzamientos.
- **Intercambio directo**: Sistema integrado para permitir a los usuarios intercambiar zapatillas de forma segura.
- **Búsqueda avanzada**: Encuentra zapatillas específicas mediante filtros por nombre y características.
- **Gestión de precios**: Sistema dinámico que permite establecer precios mínimos para los productos.
- **Página de perfil**: Permite a los usuarios gestionar su información personal de forma sencilla.
- **Automatización**: Un scrapper recoge lanzamientos de zapatillas de fuentes externas y los actualiza diariamente.

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **Express** para manejar las rutas y lógica del servidor.
- **PostgreSQL** como base de datos para almacenar información de usuarios, zapatillas e intercambios.
- **Puppeteer** y **Cheerio** para el scraping de datos de lanzamientos.
- **JWT (JSON Web Tokens)** para la autenticación de usuarios.

### Frontend
- **React.js** con diseño responsivo.
- **Tailwind CSS** para estilos.

### Herramientas adicionales
- **Jest**: Para pruebas unitarias.
- **Cron Jobs**: Para la ejecución de tareas periódicas, como limpiar intercambios expirados y actualizar lanzamientos.

## ⚙️ Instalación y Configuración

### Requisitos previos
- **Node.js** (v14 o superior)
- **PostgreSQL**
- **Git**

### Pasos
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-repo/snkrs-royal.git
   cd snkrs-royal
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env`:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/snkrs_royal
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. Inicializa la base de datos:
   ```bash
   node src/config/initDB.js
   ```

5. Ejecuta el servidor:
   ```bash
   npm start
   ```

6. Accede a la aplicación en tu navegador:
   ```
   http://localhost:3000
   ```

## 🧪 Pruebas
Ejecuta las pruebas unitarias con:
```bash
npm test
```

## 📜 Licencia
Este proyecto está bajo la licencia [MIT](LICENSE).

## ✨ Autor
Proyecto desarrollado como parte de un Trabajo de Fin de Grado en Ingeniería Informática por Alex Javier Pinduisaca 
