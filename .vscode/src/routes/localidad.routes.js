import express from 'express';
import * as localidadController from '../controllers/localidad.controller.js';

const router = express.Router();

// Rutas de localidades
router.get('/', localidadController.obtenerLocalidades);
router.get('/:id', localidadController.obtenerLocalidadPorId);

export default router;
