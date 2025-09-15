import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from "./config/db.js";
import clienteRoutes from "./routes/cliente.routes.js";
import propiedadRoutes from "./routes/propiedad.routes.js";
import contratoRoutes from "./routes/contrato.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";
import historialRoutes from "./routes/historial.routes.js";
import interaccionRoutes from "./routes/interaccion.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";


import { verificarToken, verificarRol } from "./middleware/auth.middleware.js";


// Cargar variables del .env
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

//rutas prinsipales

app.use("/api/usuarios", verificarToken, verificarRol(1), usuarioRoutes);
app.use("/api/clientes", verificarToken, clienteRoutes);
app.use("/api/propiedades", propiedadRoutes);
app.use("/api/contratos", contratoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/interacciones", interaccionRoutes);

// rutas públicas
app.use("/api/auth", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});



//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
  //console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//});

// rutas protegidas (ejemplo clientes)



