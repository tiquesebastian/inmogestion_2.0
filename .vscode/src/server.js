import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from "./config/db.js"; // Configuración y conexión a la base de datos

// Importación de las rutas del backend
import clienteRoutes from "./routes/cliente.routes.js";
import propiedadRoutes from "./routes/propiedad.routes.js";
import contratoRoutes from "./routes/contrato.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";
import historialRoutes from "./routes/historial.routes.js";
import interaccionRoutes from "./routes/interaccion.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import authRegisterRoutes from "./routes/auth.register.routes.js";

// Middlewares para seguridad y autorización
import { verificarToken, verificarRol } from "./middleware/auth.middleware.js";

// Cargar variables de entorno desde archivo .env
dotenv.config();

const app = express();

// Puerto en el que correrá el servidor, puede venir del .env o usar 4000 por defecto
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors()); // Permite solicitudes desde otros orígenes (CORS)
app.use(express.json()); // Permite interpretar solicitudes con JSON en el cuerpo

// Ruta raíz para comprobar que el servidor está activo
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

// Rutas principales protegidas con autenticación y autorización



// Rutas de usuarios: requieren token y rol (ejemplo: admin)
app.use("/api/usuarios", verificarToken, verificarRol, usuarioRoutes);

// Rutas de clientes: requieren token (usuario autenticado)
//app.use("/api/clientes", verificarToken, clienteRoutes);
app.use("/api/clientes", clienteRoutes);

// Rutas de propiedades: (en este ejemplo no están protegidas, agregar middleware si se desea)
app.use("/api/propiedades", propiedadRoutes);

// Rutas de contratos
app.use("/api/contratos", contratoRoutes);

// Rutas de reportes
app.use("/api/reportes", reporteRoutes);

// Rutas de historial
app.use("/api/historial", historialRoutes);

// Rutas de interacciones
app.use("/api/interacciones", interaccionRoutes);

// Rutas públicas (sin autenticación)
// Aquí va el login, registro y otras rutas abiertas
app.use("/api/auth", authRoutes);

// Iniciar el servidor en el puerto configurado
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
