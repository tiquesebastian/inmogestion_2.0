import crypto from 'crypto';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { enviarEmailRecuperacionPassword } from '../services/email.service.js';
import { audit } from '../middleware/audit.middleware.js';

/**
 * Solicitar recuperación de contraseña (Usuario/Agente/Admin)
 */
export const solicitarRecuperacionUsuario = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    // Buscar usuario por email
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, apellido, correo FROM usuario WHERE correo = ?',
      [email]
    );

    if (usuarios.length === 0) {
      // Por seguridad, no revelar si el email existe o no
      return res.json({ message: 'Si el email existe, recibirás un correo con instrucciones' });
    }

    const usuario = usuarios[0];

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token hasheado en BD
    await db.query(
      'UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE id_usuario = ?',
      [resetTokenHash, resetTokenExpires, usuario.id_usuario]
    );

    // Enviar email (con token original, no el hash)
    const emailResult = await enviarEmailRecuperacionPassword({
      email: usuario.correo,
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      resetToken,
      tipoUsuario: 'usuario'
    });

    // Auditar solicitud de recuperación
    await audit.passwordReset(usuario.correo, 'usuario', req, 'request').catch(err => 
      console.error('Error auditando solicitud reset:', err)
    );

    // Devolver token en respuesta (para testing sin email externo)
    // Token es seguro porque está hasheado en BD y expira en 1h
    res.json({ 
      success: true,
      message: 'Si el email existe, recibirás un correo con instrucciones',
      token: resetToken,
      resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Error en solicitarRecuperacionUsuario:', error);
    res.status(500).json({ message: 'Error al procesar solicitud' });
  }
};

/**
 * Solicitar recuperación de contraseña (Cliente)
 */
export const solicitarRecuperacionCliente = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    // Buscar cliente por email
    const [clientes] = await db.query(
      'SELECT id_cliente, nombre_cliente, apellido_cliente, correo_cliente FROM cliente WHERE correo_cliente = ?',
      [email]
    );

    if (clientes.length === 0) {
      return res.json({ message: 'Si el email existe, recibirás un correo con instrucciones' });
    }

    const cliente = clientes[0];

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token hasheado en BD
    await db.query(
      'UPDATE cliente SET reset_token = ?, reset_token_expires = ? WHERE id_cliente = ?',
      [resetTokenHash, resetTokenExpires, cliente.id_cliente]
    );

    // Enviar email (con token original, no el hash)
    const emailResult = await enviarEmailRecuperacionPassword({
      email: cliente.correo_cliente,
      nombre: `${cliente.nombre_cliente} ${cliente.apellido_cliente}`,
      resetToken,
      tipoUsuario: 'cliente'
    });

    // Auditar solicitud de recuperación
    await audit.passwordReset(cliente.correo_cliente, 'cliente', req, 'request').catch(err => 
      console.error('Error auditando solicitud reset cliente:', err)
    );

    // Devolver token en respuesta (para testing sin email externo)
    res.json({ 
      success: true,
      message: 'Si el email existe, recibirás un correo con instrucciones',
      token: resetToken,
      resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password-cliente?token=${resetToken}`,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Error en solicitarRecuperacionCliente:', error);
    res.status(500).json({ message: 'Error al procesar solicitud' });
  }
};

/**
 * Verificar token y restablecer contraseña (Usuario)
 */
export const restablecerPasswordUsuario = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Hashear el token recibido para comparar con el almacenado
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token hasheado válido
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()',
      [tokenHash]
    );

    if (usuarios.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const usuario = usuarios[0];

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await db.query(
      'UPDATE usuario SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_usuario = ?',
      [hashedPassword, usuario.id_usuario]
    );

    // Auditar restablecimiento exitoso
    await audit.passwordReset(usuario.nombre, 'usuario', req, 'reset').catch(err => 
      console.error('Error auditando reset exitoso:', err)
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecerPasswordUsuario:', error);
    res.status(500).json({ message: 'Error al restablecer contraseña' });
  }
};

/**
 * Verificar token y restablecer contraseña (Cliente)
 */
export const restablecerPasswordCliente = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Hashear el token recibido para comparar con el almacenado
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar cliente con token hasheado válido
    const [clientes] = await db.query(
      'SELECT id_cliente, nombre_cliente FROM cliente WHERE reset_token = ? AND reset_token_expires > NOW()',
      [tokenHash]
    );

    if (clientes.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const cliente = clientes[0];

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await db.query(
      'UPDATE cliente SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_cliente = ?',
      [hashedPassword, cliente.id_cliente]
    );

    // Auditar restablecimiento exitoso
    await audit.passwordReset(cliente.nombre_cliente, 'cliente', req, 'reset').catch(err => 
      console.error('Error auditando reset exitoso cliente:', err)
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en restablecerPasswordCliente:', error);
    res.status(500).json({ message: 'Error al restablecer contraseña' });
  }
};
