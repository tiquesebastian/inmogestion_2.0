import express from 'express';
const router = express.Router();
import { 
  upload, 
  subirDocumento, 
  getDocumentosPorCliente, 
  getTodosLosDocumentos,
  descargarDocumento,
  eliminarDocumento 
} from '../controllers/documentoCliente.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Subir documento
router.post('/subir', upload.single('documento'), subirDocumento);

// Obtener documentos por cliente
router.get('/cliente/:clienteId', getDocumentosPorCliente);

// Obtener todos (solo admin)
router.get('/todos', getTodosLosDocumentos);

// Descargar documento
router.get('/descargar/:id', descargarDocumento);

// Eliminar documento
router.delete('/:id', eliminarDocumento);

export default router;
