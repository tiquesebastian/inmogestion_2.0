import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clienteRoutes from "./routes/cliente.routes.js";
import db from "./config/db.js";
import propiedadRoutes from "./routes/propiedad.routes.js";

// Cargar variables del .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

//rutas prinsipales

app.use("/api/clientes", clienteRoutes);
app.use("/api/propiedades", propiedadRoutes);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});


//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
  //console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//});