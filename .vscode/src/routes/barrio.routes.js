import express from 'express';
import * as localidadController from '../controllers/localidad.controller.js';

const router = express.Router();

// Rutas de barrios
router.get('/', localidadController.obtenerBarriosPorLocalidad);

export default router;
