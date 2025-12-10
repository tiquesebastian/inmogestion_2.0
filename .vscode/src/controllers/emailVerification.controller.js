/**
 * Controlador de Verificación de Email
 * Maneja la verificación de correos electrónicos para usuarios y clientes
 */

import crypto from 'crypto';
import db from '../config/db.js';
import {
  enviarEmailVerificacionUsuario,
  enviarEmailVerificacionCliente,
  enviarEmailBienvenida,
} from '../services/emailService.js';
import { audit } from '../middleware/audit.middleware.js';

/**
 * Genera un token de verificación único (64 caracteres hexadecimales)
 * @returns {string} Token aleatorio
 */
const generarToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hashea un token con SHA256 para almacenamiento seguro
 * @param {string} token - Token en texto plano
 * @returns {string} Hash SHA256 del token
 */
const hashearToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Calcula la fecha de expiración del token (24 horas desde ahora)
 * @returns {Date} Fecha de expiración
 */
const calcularExpiracion = () => {
  const expiracion = new Date();
  expiracion.setHours(expiracion.getHours() + 24); // Token válido por 24 horas
  return expiracion;
};

/**
 * POST /api/auth/reenviar-verificacion-usuario
 * Reenvía el email de verificación a un usuario
 */
export const reenviarVerificacionUsuario = async (req, res) => {
  const { correo } = req.body;

  try {
    // Verificar que el usuario existe
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, email_verificado FROM usuario WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = usuarios[0];

    // Verificar si ya está verificado
    if (usuario.email_verificado === 1) {
      return res.status(400).json({ message: 'El correo ya está verificado' });
    }

    // Generar nuevo token
    const token = generarToken();
    const tokenHash = hashearToken(token);
    const expiracion = calcularExpiracion();

    // Actualizar token hasheado en la base de datos
    await db.query(
      'UPDATE usuario SET email_token = ?, email_token_expires = ? WHERE id_usuario = ?',
      [tokenHash, expiracion, usuario.id_usuario]
    );

    // Enviar email de verificación (con token original, no el hash)
    await enviarEmailVerificacionUsuario({
      nombre: usuario.nombre,
      correo: correo,
      token: token,
    });

    // Auditar reenvío
    await audit.verifyEmail(correo, 'usuario', req).catch(err => 
      console.error('Error auditando reenvío:', err)
    );

    res.json({
      message: 'Email de verificación enviado correctamente',
      expiresAt: expiracion,
    });
  } catch (error) {
    console.error('Error reenviando verificación:', error);
    res.status(500).json({
      message: 'Error al reenviar el email de verificación',
      error: error.message,
    });
  }
};

/**
 * POST /api/auth/reenviar-verificacion-cliente
 * Reenvía el email de verificación a un cliente
 */
export const reenviarVerificacionCliente = async (req, res) => {
  const { correo } = req.body;

  try {
    // Verificar que el cliente existe
    const [clientes] = await db.query(
      'SELECT id_cliente, nombre_cliente, email_verificado FROM cliente WHERE correo_cliente = ?',
      [correo]
    );

    if (clientes.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const cliente = clientes[0];

    // Verificar si ya está verificado
    if (cliente.email_verificado === 1) {
      return res.status(400).json({ message: 'El correo ya está verificado' });
    }

    // Generar nuevo token
    const token = generarToken();
    const tokenHash = hashearToken(token);
    const expiracion = calcularExpiracion();

    // Actualizar token hasheado en la base de datos
    await db.query(
      'UPDATE cliente SET email_token = ?, email_token_expires = ? WHERE id_cliente = ?',
      [tokenHash, expiracion, cliente.id_cliente]
    );

    // Enviar email de verificación (con token original, no el hash)
    await enviarEmailVerificacionCliente({
      nombre: cliente.nombre_cliente,
      correo: correo,
      token: token,
    });

    // Auditar reenvío
    await audit.verifyEmail(correo, 'cliente', req).catch(err => 
      console.error('Error auditando reenvío:', err)
    );

    res.json({
      message: 'Email de verificación enviado correctamente',
      expiresAt: expiracion,
    });
  } catch (error) {
    console.error('Error reenviando verificación:', error);
    res.status(500).json({
      message: 'Error al reenviar el email de verificación',
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/verificar-email-usuario/:token
 * Verifica el email de un usuario mediante el token
 */
export const verificarEmailUsuario = async (req, res) => {
  const { token } = req.params;

  try {
    console.log('🔍 DEBUG - Token recibido:', token);
    console.log('🔍 DEBUG - Longitud del token:', token.length);
    
    // Hashear el token recibido para comparar con el almacenado
    const tokenHash = hashearToken(token);
    console.log('🔍 DEBUG - Token hasheado:', tokenHash);

    // Buscar usuario por token hasheado
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, correo, email_verificado, email_token_expires, email_token FROM usuario WHERE email_token = ?',
      [tokenHash]
    );
    
    console.log('🔍 DEBUG - Usuarios encontrados:', usuarios.length);
    if (usuarios.length > 0) {
      console.log('🔍 DEBUG - Token en DB:', usuarios[0].email_token);
      console.log('🔍 DEBUG - Expira:', usuarios[0].email_token_expires);
      console.log('🔍 DEBUG - Ahora:', new Date());
    }

    // No revelar si el token existe o no (seguridad)
    if (usuarios.length === 0) {
      return res.status(400).json({
        message: 'Token de verificación inválido o expirado',
      });
    }

    const usuario = usuarios[0];

    // Verificar si ya está verificado
    if (usuario.email_verificado === 1) {
      return res.status(400).json({
        message: 'El correo ya ha sido verificado previamente',
      });
    }

    // Verificar si el token ha expirado
    const ahora = new Date();
    const expiracion = new Date(usuario.email_token_expires);

    if (ahora > expiracion) {
      return res.status(400).json({
        message: 'El token de verificación ha expirado. Solicita un nuevo enlace.',
      });
    }

    // Marcar como verificado y limpiar token
    await db.query(
      'UPDATE usuario SET email_verificado = 1, email_token = NULL, email_token_expires = NULL WHERE id_usuario = ?',
      [usuario.id_usuario]
    );

    // Enviar email de bienvenida
    try {
      await enviarEmailBienvenida({
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo: 'usuario',
      });
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No fallar la verificación si falla el email de bienvenida
    }

    // Auditar verificación exitosa
    await audit.verifyEmail(usuario.correo, 'usuario', req).catch(err => 
      console.error('Error auditando verificación:', err)
    );

    res.json({
      message: 'Correo verificado exitosamente',
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      message: 'Error al verificar el correo',
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/verificar-email-cliente/:token
 * Verifica el email de un cliente mediante el token
 */
export const verificarEmailCliente = async (req, res) => {
  const { token } = req.params;

  try {
    // Hashear el token recibido para comparar con el almacenado
    const tokenHash = hashearToken(token);

    // Buscar cliente por token hasheado
    const [clientes] = await db.query(
      'SELECT id_cliente, nombre_cliente, correo_cliente, email_verificado, email_token_expires FROM cliente WHERE email_token = ?',
      [tokenHash]
    );

    // No revelar si el token existe o no (seguridad)
    if (clientes.length === 0) {
      return res.status(400).json({
        message: 'Token de verificación inválido o expirado',
      });
    }

    const cliente = clientes[0];

    // Verificar si ya está verificado
    if (cliente.email_verificado === 1) {
      return res.status(400).json({
        message: 'El correo ya ha sido verificado previamente',
      });
    }

    // Verificar si el token ha expirado
    const ahora = new Date();
    const expiracion = new Date(cliente.email_token_expires);

    if (ahora > expiracion) {
      return res.status(400).json({
        message: 'El token de verificación ha expirado. Solicita un nuevo enlace.',
      });
    }

    // Marcar como verificado y limpiar token
    await db.query(
      'UPDATE cliente SET email_verificado = 1, email_token = NULL, email_token_expires = NULL WHERE id_cliente = ?',
      [cliente.id_cliente]
    );

    // Enviar email de bienvenida
    try {
      await enviarEmailBienvenida({
        nombre: cliente.nombre_cliente,
        correo: cliente.correo_cliente,
        tipo: 'cliente',
      });
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No fallar la verificación si falla el email de bienvenida
    }

    // Auditar verificación exitosa
    await audit.verifyEmail(cliente.correo_cliente, 'cliente', req).catch(err => 
      console.error('Error auditando verificación:', err)
    );

    res.json({
      message: 'Correo verificado exitosamente',
      cliente: {
        nombre: cliente.nombre_cliente,
        correo: cliente.correo_cliente,
      },
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      message: 'Error al verificar el correo',
      error: error.message,
    });
  }
};

export default {
  reenviarVerificacionUsuario,
  reenviarVerificacionCliente,
  verificarEmailUsuario,
  verificarEmailCliente,
};
