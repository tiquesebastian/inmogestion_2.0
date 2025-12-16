import express from 'express';
import crypto from 'crypto';
import { enviarEmailVerificacion, enviarEmailRecuperacionPassword } from '../services/email.service.js';

const router = express.Router();

/**
 * POST /api/test/email
 * Prueba de envío de email (con respuesta de token en dev)
 */
router.post('/email', async (req, res) => {
  try {
    const { email, tipo = 'verificacion' } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Falta el email' 
      });
    }

    let resultado;
    let testToken = crypto.randomBytes(32).toString('hex');

    if (tipo === 'verificacion') {
      resultado = await enviarEmailVerificacion({
        email,
        nombre: 'Usuario de Prueba',
        token: testToken,
        tipoUsuario: 'usuario'
      });
    } else if (tipo === 'recuperacion') {
      resultado = await enviarEmailRecuperacionPassword({
        email,
        nombre: 'Usuario de Prueba',
        resetToken: testToken,
        tipoUsuario: 'usuario'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Tipo inválido. Usa: verificacion o recuperacion' 
      });
    }

    // Si el email falló pero estamos en desarrollo, devolvemos el token igual
    if (!resultado.success && process.env.NODE_ENV !== 'production') {
      return res.json({
        success: true,
        message: `⚠️ [DEV MODE] Email no se pudo enviar, pero aquí está el token para testing:`,
        token: testToken,
        email: email,
        tipo: tipo,
        verificationUrl: tipo === 'verificacion' 
          ? `${process.env.FRONTEND_URL}/verify-email?token=${testToken}`
          : `${process.env.FRONTEND_URL}/reset-password?token=${testToken}`
      });
    }

    if (resultado.success) {
      return res.json({
        success: true,
        message: `✅ Email de ${tipo} enviado correctamente`,
        messageId: resultado.messageId,
        email: email
      });
    } else {
      return res.status(500).json({
        success: false,
        message: '❌ Error al enviar email',
        error: resultado.error
      });
    }
  } catch (error) {
    console.error('Error en test de email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al probar email',
      error: error.message
    });
  }
});

/**
 * POST /api/test/token-directo
 * Genera un token sin intentar enviar email (para testing sin servicio de email)
 */
router.post('/token-directo', (req, res) => {
  try {
    const { tipo = 'verificacion' } = req.body;
    
    const testToken = crypto.randomBytes(32).toString('hex');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const urls = {
      verificacion: `${frontendUrl}/verify-email?token=${testToken}`,
      recuperacion: `${frontendUrl}/reset-password?token=${testToken}`
    };
    
    return res.json({
      success: true,
      message: '🧪 Token generado para testing (sin envío de email)',
      token: testToken,
      tipo: tipo,
      verificarUrl: urls[tipo] || urls.verificacion,
      ejemplo: `Copia este enlace en tu navegador:\n${urls[tipo]}`
    });
  } catch (error) {
    console.error('Error al generar token:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar token',
      error: error.message
    });
  }
});

export default router;

