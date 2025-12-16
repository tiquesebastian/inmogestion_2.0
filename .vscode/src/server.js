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
import visitaRoutes from "./routes/visita.routes.js";
import authRoutes from "./routes/auth.routes.js";
import authClienteRoutes from "./routes/authCliente.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import imagenRoutes from "./routes/imagen.routes.js";
import localidadRoutes from "./routes/localidad.routes.js";
import barrioRoutes from "./routes/barrio.routes.js";
import contratoDocumentoRoutes from "./routes/contratoDocumento.routes.js";
import documentoClienteRoutes from "./routes/documentoCliente.routes.js";
import passwordRecoveryRoutes from "./routes/passwordRecovery.routes.js";
import emailVerificationRoutes from "./routes/emailVerification.routes.js";

// Servicios
import { iniciarTareaRecordatorios } from "./services/recordatorios.service.js";

// Middlewares para seguridad y autorización
import { verificarToken, verificarRol } from "./middleware/auth.middleware.js";

// Cargar variables de entorno desde archivo .env solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// Confiar en proxies (Railway, Vercel, etc.) para headers X-Forwarded-*
app.set('trust proxy', true);

// Puerto en el que correrá el servidor, puede venir del .env o usar 4000 por defecto
const PORT = process.env.PORT || 4000;

// Configurar CORS para permitir peticiones desde el frontend en Vercel
const corsOptions = {
  origin: [
    'http://localhost:5173', // Desarrollo local
    'http://localhost:3000',  // Alternativa desarrollo
    'https://inmogestion-2-0.vercel.app', // Frontend en Vercel
    'https://inmogestin-2-0.vercel.app', // Con caracteres especiales (si aplica)
    process.env.FRONTEND_URL || '' // Variable de entorno si existe
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares globales
app.use(cors(corsOptions)); // Permite solicitudes desde otros orígenes (CORS)
app.use(express.json()); // Permite interpretar solicitudes con JSON en el cuerpo

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

// Ruta raíz para comprobar que el servidor está activo
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀 v4');
});

// Ruta de test simple
app.get('/test', (req, res) => {
  res.json({ mensaje: 'Backend respondiendo correctamente desde Railway', timestamp: new Date() });
});

// Rutas principales protegidas con autenticación y autorización



// Rutas de usuarios: requieren token; rol se puede reforzar en controladores si se necesita
app.use("/api/usuarios", verificarToken(), usuarioRoutes);

// Rutas de clientes: requieren token (usuario autenticado)
//app.use("/api/clientes", verificarToken, clienteRoutes);
app.use("/api/clientes", clienteRoutes);

// Rutas de propiedades: (en este ejemplo no están protegidas, agregar middleware si se desea)
app.use("/api/propiedades", propiedadRoutes);

// Rutas de imágenes de propiedades
app.use("/api/imagenes", imagenRoutes);

// Rutas de localidades y barrios
app.use("/api/localidades", localidadRoutes);
app.use("/api/barrios", barrioRoutes);

// Rutas de contratos
app.use("/api/contratos", contratoRoutes);

// Rutas de contratos documentos (generación de PDFs)
app.use("/api/contratos-documentos", contratoDocumentoRoutes);

// Rutas de reportes
app.use("/api/reportes", reporteRoutes);

// Rutas de historial
app.use("/api/historial", historialRoutes);

// Rutas de interacciones
app.use("/api/interacciones", interaccionRoutes);

// Rutas de visitas (agendar, listar por agente)
app.use("/api/visitas", visitaRoutes);

// Rutas de documentos de clientes (carga masiva)
app.use("/api/documentos-clientes", documentoClienteRoutes);

// Rutas públicas (sin autenticación)
// Aquí va el login, registro y otras rutas abiertas
app.use("/api/auth", authRoutes);
app.use("/api/auth", authClienteRoutes);
app.use("/api/auth", emailVerificationRoutes);
app.use("/api/password-recovery", passwordRecoveryRoutes);

// Iniciar el servidor en el puerto configurado
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  
  // Iniciar tareas programadas
  iniciarTareaRecordatorios();
});
