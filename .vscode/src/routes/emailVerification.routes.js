/**
 * Rutas de Verificación de Email
 * Endpoints para verificar correos electrónicos de usuarios y clientes
 */

import { Router } from 'express';
import {
  verificarEmailUsuario,
  verificarEmailCliente,
  reenviarVerificacionUsuario,
  reenviarVerificacionCliente,
} from '../controllers/emailVerification.controller.js';
import { resendVerificationLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

/**
 * GET /api/auth/verificar-email-usuario/:token
 * Verifica el email de un usuario mediante el token
 */
router.get('/verificar-email-usuario/:token', verificarEmailUsuario);

/**
 * GET /api/auth/verificar-email-cliente/:token
 * Verifica el email de un cliente mediante el token
 */
router.get('/verificar-email-cliente/:token', verificarEmailCliente);

/**
 * POST /api/auth/reenviar-verificacion-usuario
 * Reenvía el email de verificación a un usuario
 * Body: { correo: "email@example.com" }
 * Limitado a 5 reenvíos por hora por email/IP
 */
router.post('/reenviar-verificacion-usuario', resendVerificationLimiter, reenviarVerificacionUsuario);

/**
 * POST /api/auth/reenviar-verificacion-cliente
 * Reenvía el email de verificación a un cliente
 * Body: { correo: "email@example.com" }
 * Limitado a 5 reenvíos por hora por email/IP
 */
router.post('/reenviar-verificacion-cliente', resendVerificationLimiter, reenviarVerificacionCliente);

export default router;
