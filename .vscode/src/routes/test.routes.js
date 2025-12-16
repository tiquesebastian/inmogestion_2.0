import express from 'express';
import { enviarEmailVerificacion, enviarEmailRecuperacionPassword } from '../services/email.service.js';

const router = express.Router();

/**
 * POST /api/test/email
 * Prueba rápida de envío de email
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

    if (tipo === 'verificacion') {
      resultado = await enviarEmailVerificacion({
        email,
        nombre: 'Usuario de Prueba',
        token: 'TEST123456',
        tipoUsuario: 'usuario'
      });
    } else if (tipo === 'recuperacion') {
      resultado = await enviarEmailRecuperacionPassword({
        email,
        nombre: 'Usuario de Prueba',
        resetToken: 'TEST123456',
        tipoUsuario: 'usuario'
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Tipo inválido. Usa: verificacion o recuperacion' 
      });
    }

    if (resultado.success) {
      return res.json({
        success: true,
        message: `✅ Email de ${tipo} enviado correctamente`,
        messageId: resultado.messageId
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

export default router;
