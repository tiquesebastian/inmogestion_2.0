import express from 'express';
import {
  solicitarRecuperacionUsuario,
  solicitarRecuperacionCliente,
  restablecerPasswordUsuario,
  restablecerPasswordCliente
} from '../controllers/passwordRecovery.controller.js';

const router = express.Router();

// Rutas para usuarios (admin/agentes)
router.post('/forgot-password-usuario', solicitarRecuperacionUsuario);
router.post('/reset-password-usuario', restablecerPasswordUsuario);

// Rutas para clientes
router.post('/forgot-password-cliente', solicitarRecuperacionCliente);
router.post('/reset-password-cliente', restablecerPasswordCliente);

export default router;
