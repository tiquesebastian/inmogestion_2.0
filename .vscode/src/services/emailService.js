/**
 * Servicio de Email - InmoGestión
 * 
 * Utiliza Nodemailer para enviar correos electrónicos
 * Configurado con Gmail SMTP
 * 
 * @module emailService
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar .env solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

/**
 * Configuración del transportador de email
 * Utiliza las credenciales de Gmail configuradas en .env
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true para port 465, false para otros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Contraseña de aplicación de Gmail
  },
});

/**
 * Verifica la configuración del transportador de email
 * Se ejecuta al iniciar el servidor
 */
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});

/**
 * Envía email de verificación a un usuario (Admin/Agente)
 * 
 * @param {Object} params - Parámetros del email
 * @param {string} params.nombre - Nombre del usuario
 * @param {string} params.correo - Email del usuario
 * @param {string} params.token - Token de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
export const enviarEmailVerificacionUsuario = async ({ nombre, correo, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verificar-email?tipo=usuario&token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"InmoGestión" <no-reply@inmogestion.com>',
    to: correo,
    subject: '✉️ Verifica tu correo en InmoGestión',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 15px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #d97706; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏡 InmoGestión</h1>
            <p>Plataforma de Gestión Inmobiliaria</p>
          </div>
          
          <div class="content">
            <h2>¡Hola, ${nombre}! 👋</h2>
            
            <p>Gracias por registrarte en <strong>InmoGestión</strong>. Estamos emocionados de tenerte en nuestro equipo.</p>
            
            <p>Para completar tu registro y activar tu cuenta, necesitamos verificar tu dirección de correo electrónico.</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">
                ✅ Verificar mi correo
              </a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px;">
              <code>${verificationLink}</code>
            </p>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>24 horas</strong>.
            </div>
            
            <p>Si no solicitaste esta cuenta, puedes ignorar este correo de forma segura.</p>
          </div>
          
          <div class="footer">
            <p><strong>InmoGestión</strong> - Grupo Inmobiliario Cortés</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>© 2025 InmoGestión. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hola ${nombre},
      
      Gracias por registrarte en InmoGestión.
      
      Para verificar tu correo, haz clic en el siguiente enlace:
      ${verificationLink}
      
      Este enlace expira en 24 horas.
      
      Si no solicitaste esta cuenta, ignora este correo.
      
      Equipo InmoGestión
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificación enviado a:', correo);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de verificación:', error);
    throw error;
  }
};

/**
 * Envía email de verificación a un cliente
 * 
 * @param {Object} params - Parámetros del email
 * @param {string} params.nombre - Nombre del cliente
 * @param {string} params.correo - Email del cliente
 * @param {string} params.token - Token de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
export const enviarEmailVerificacionCliente = async ({ nombre, correo, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verificar-email?tipo=cliente&token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"InmoGestión" <no-reply@inmogestion.com>',
    to: correo,
    subject: '✉️ Verifica tu correo en InmoGestión',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 15px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #d97706; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏡 InmoGestión</h1>
            <p>Encuentra tu hogar ideal</p>
          </div>
          
          <div class="content">
            <h2>¡Bienvenido, ${nombre}! 👋</h2>
            
            <p>Gracias por registrarte en <strong>InmoGestión</strong>. Estás a un paso de encontrar la propiedad de tus sueños.</p>
            
            <p>Para completar tu registro y activar tu cuenta, verifica tu dirección de correo electrónico:</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">
                ✅ Verificar mi correo
              </a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border: 1px solid #e5e7eb; border-radius: 5px;">
              <code>${verificationLink}</code>
            </p>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>24 horas</strong>.
            </div>
            
            <p><strong>¿Qué puedes hacer después de verificar tu correo?</strong></p>
            <ul>
              <li>🔍 Buscar propiedades con filtros avanzados</li>
              <li>❤️ Guardar tus propiedades favoritas</li>
              <li>📅 Agendar visitas a propiedades</li>
              <li>💬 Contactar directamente con nuestros agentes</li>
            </ul>
            
            <p>Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
          </div>
          
          <div class="footer">
            <p><strong>InmoGestión</strong> - Grupo Inmobiliario Cortés</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>© 2025 InmoGestión. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Bienvenido ${nombre},
      
      Gracias por registrarte en InmoGestión.
      
      Para verificar tu correo, haz clic en el siguiente enlace:
      ${verificationLink}
      
      Este enlace expira en 24 horas.
      
      Si no creaste esta cuenta, ignora este correo.
      
      Equipo InmoGestión
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de verificación enviado a:', correo);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de verificación:', error);
    throw error;
  }
};

/**
 * Envía email de bienvenida después de verificar la cuenta
 * 
 * @param {Object} params - Parámetros del email
 * @param {string} params.nombre - Nombre del usuario
 * @param {string} params.correo - Email del usuario
 * @param {string} params.tipo - Tipo de usuario (usuario|cliente)
 * @returns {Promise<Object>} Resultado del envío
 */
export const enviarEmailBienvenida = async ({ nombre, correo, tipo }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const loginUrl = tipo === 'cliente' ? `${frontendUrl}/login-cliente` : `${frontendUrl}/login`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"InmoGestión" <no-reply@inmogestion.com>',
    to: correo,
    subject: '🎉 ¡Cuenta verificada exitosamente!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 15px 30px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ ¡Cuenta Verificada!</h1>
          </div>
          
          <div class="content">
            <h2>¡Felicidades, ${nombre}! 🎉</h2>
            
            <p>Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de <strong>InmoGestión</strong>.</p>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">
                🔐 Iniciar Sesión
              </a>
            </div>
            
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            
            <p>¡Bienvenido a InmoGestión!</p>
          </div>
          
          <div class="footer">
            <p><strong>InmoGestión</strong> - Grupo Inmobiliario Cortés</p>
            <p>© 2025 InmoGestión. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida enviado a:', correo);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
    throw error;
  }
};

export default {
  enviarEmailVerificacionUsuario,
  enviarEmailVerificacionCliente,
  enviarEmailBienvenida,
};
