// Importación de dependencias principales

import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Configuración de variables de entorno
// Cargar variables de entorno
dotenv.config();

// Crear conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "inmogestion",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;

// Inicialización de la aplicación Express y definición del puerto

// Middlewares para habilitar CORS y parsear JSON

// Ruta de prueba para verificar la conexión con la base de datos

// Ruta principal de bienvenida a la API

// Inicio del servidor y mensaje en consola
