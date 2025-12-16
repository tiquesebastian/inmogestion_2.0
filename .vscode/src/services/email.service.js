import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';

// Cargar .env solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// ============================================
// OPCIÓN 1: SMTP (Gmail, Resend, etc)
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ============================================
// OPCIÓN 2: API REST de Resend (sin SMTP)
// ============================================
const useResendAPI = process.env.EMAIL_PROVIDER === 'resend-api';

const resendAPIKey = process.env.EMAIL_PASS; // Reutilizamos EMAIL_PASS para la API key
const resendEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// Helper para enviar con Resend API
const enviarConResendAPI = async (to, subject, html) => {
  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: resendEmail,
      to: to,
      subject: subject,
      html: html
    }, {
      headers: {
        'Authorization': `Bearer ${resendAPIKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return { success: true, messageId: response.data.id };
  } catch (error) {
    console.error('❌ Error con API Resend:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper unificado para enviar emails
const enviarEmail = async (mailOptions) => {
  if (useResendAPI) {
    console.log('📧 Usando API de Resend...');
    return enviarConResendAPI(mailOptions.to, mailOptions.subject, mailOptions.html);
  } else {
    console.log('📧 Usando SMTP...');
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error SMTP:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Verificar conexión al iniciar (solo en desarrollo con SMTP)
if (process.env.NODE_ENV === 'production' || process.env.EMAIL_PROVIDER === 'resend-api') {
  console.log('✅ Email configurado (API/SMTP ready)');
} else if (process.env.NODE_ENV !== 'production') {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('❌ Error de conexión SMTP:', error.message);
      console.log('📧 Verifica EMAIL_USER, EMAIL_PASS, EMAIL_HOST y EMAIL_PORT');
    } else {
      console.log('✅ Servidor SMTP listo para enviar emails');
    }
  });
}
/*
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo para enviar mensajes');
  }
});
*/

/**
 * Email cuando se genera un contrato
 */
export const enviarEmailContratoGenerado = async (contratoData) => {
  const { 
    comprador_nombre, 
    comprador_apellido, 
    comprador_email,
    inmueble_direccion,
    precio_venta,
    tipo_inmueble,
    fecha_firma
  } = contratoData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: comprador_email,
    subject: '📄 Tu Contrato de Compraventa ha sido Generado - InmoGestion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 InmoGestion</h1>
            <p>Tu Contrato está Listo</p>
          </div>
          
          <div class="content">
            <h2>¡Hola ${comprador_nombre} ${comprador_apellido}!</h2>
            
            <p>Nos complace informarte que tu <strong>Contrato de Compraventa</strong> ha sido generado exitosamente.</p>
            
            <div class="info-box">
              <h3>📋 Detalles del Contrato:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Tipo de Inmueble:</strong> ${tipo_inmueble}</li>
                <li><strong>Dirección:</strong> ${inmueble_direccion}</li>
                <li><strong>Valor:</strong> $${parseInt(precio_venta).toLocaleString('es-CO')}</li>
                <li><strong>Fecha de Firma:</strong> ${new Date(fecha_firma).toLocaleDateString('es-CO')}</li>
              </ul>
            </div>
            
            <p>Puedes descargar tu contrato iniciando sesión en tu panel de cliente:</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login-cliente" class="btn">🔐 Acceder a Mi Panel</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              <strong>Próximos pasos:</strong><br>
              1. Revisa tu contrato cuidadosamente<br>
              2. Si tienes dudas, contáctanos<br>
              3. Firma el documento y entrégalo a tu agente
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 InmoGestion. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const resultado = await enviarEmail(mailOptions);
    if (resultado.success) {
      console.log('✅ Email de contrato enviado:', resultado.messageId);
    } else {
      console.error('❌ Error al enviar email de contrato:', resultado.error);
    }
    return resultado;
  } catch (error) {
    console.error('❌ Error al enviar email de contrato:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email cuando hay un nuevo interés en propiedad
 */
export const enviarEmailNuevoInteres = async (interesData) => {
  const {
    agente_nombre,
    agente_email,
    cliente_nombre,
    cliente_email,
    cliente_telefono,
    propiedad_direccion,
    propiedad_tipo,
    propiedad_precio,
    comentarios
  } = interesData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: agente_email,
    subject: '🔔 Nuevo Interés en Propiedad - InmoGestion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .highlight { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
          .client-info { background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 InmoGestion</h1>
            <p>Nuevo Cliente Interesado</p>
          </div>
          
          <div class="content">
            <h2>¡Hola ${agente_nombre}!</h2>
            
            <p>Tienes un <strong>nuevo interés</strong> en una de tus propiedades.</p>
            
            <div class="highlight">
              <h3>🏡 Propiedad:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Tipo:</strong> ${propiedad_tipo}</li>
                <li><strong>Dirección:</strong> ${propiedad_direccion}</li>
                <li><strong>Precio:</strong> $${parseInt(propiedad_precio).toLocaleString('es-CO')}</li>
              </ul>
            </div>
            
            <div class="client-info">
              <h3>👤 Información del Cliente:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Nombre:</strong> ${cliente_nombre}</li>
                <li><strong>Email:</strong> <a href="mailto:${cliente_email}">${cliente_email}</a></li>
                <li><strong>Teléfono:</strong> <a href="tel:${cliente_telefono}">${cliente_telefono}</a></li>
              </ul>
              ${comentarios ? `<p><strong>Comentarios:</strong><br>${comentarios}</p>` : ''}
            </div>
            
            <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <strong>⏰ Acción recomendada:</strong><br>
              Contacta al cliente lo antes posible para agendar una visita y brindar más información.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 InmoGestion. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const resultado = await enviarEmail(mailOptions);
    if (resultado.success) {
      console.log('✅ Email de interés enviado al agente:', resultado.messageId);
    } else {
      console.error('❌ Error al enviar email de interés:', resultado.error);
    }
    return resultado;
  } catch (error) {
    console.error('❌ Error al enviar email de interés:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email recordatorio de visita (24h antes)
 */
export const enviarEmailRecordatorioVisita = async (visitaData) => {
  const {
    cliente_nombre,
    cliente_email,
    propiedad_direccion,
    propiedad_tipo,
    fecha_visita,
    hora_visita,
    agente_nombre,
    agente_telefono
  } = visitaData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: cliente_email,
    subject: '⏰ Recordatorio: Visita a Propiedad Mañana - InmoGestion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .reminder { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
          .details { background: #f5f3ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 InmoGestion</h1>
            <p>Recordatorio de Visita</p>
          </div>
          
          <div class="content">
            <h2>¡Hola ${cliente_nombre}!</h2>
            
            <div class="reminder">
              <h3 style="margin: 0; color: #f59e0b;">⏰ Tienes una visita programada mañana</h3>
            </div>
            
            <div class="details">
              <h3>📍 Detalles de la Visita:</h3>
              <ul style="list-style: none; padding: 0; font-size: 16px;">
                <li><strong>📅 Fecha:</strong> ${new Date(fecha_visita).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li><strong>🕐 Hora:</strong> ${hora_visita || 'Por confirmar'}</li>
                <li><strong>🏡 Tipo:</strong> ${propiedad_tipo}</li>
                <li><strong>📍 Dirección:</strong> ${propiedad_direccion}</li>
              </ul>
            </div>
            
            <div style="background: #e0e7ff; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3>👨‍💼 Tu Agente:</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${agente_nombre}</p>
              <p style="margin: 5px 0;"><strong>Teléfono:</strong> <a href="tel:${agente_telefono}">${agente_telefono}</a></p>
            </div>
            
            <p style="background: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
              <strong>💡 Consejos:</strong><br>
              • Llega 5-10 minutos antes<br>
              • Prepara tus preguntas<br>
              • Si necesitas cancelar, avísanos con tiempo
            </p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="font-size: 14px; color: #6b7280;">
                ¿Necesitas reagendar? Contáctanos lo antes posible.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2025 InmoGestion. Todos los derechos reservados.</p>
            <p>Nos vemos pronto! 😊</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const resultado = await enviarEmail(mailOptions);
    if (resultado.success) {
      console.log('✅ Email de recordatorio enviado:', resultado.messageId);
    } else {
      console.error('❌ Error al enviar email de recordatorio:', resultado.error);
    }
    return resultado;
  } catch (error) {
    console.error('❌ Error al enviar email de recordatorio:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email para recuperación de contraseña
 */
export const enviarEmailRecuperacionPassword = async (emailData) => {
  const { email, nombre, resetToken, tipoUsuario } = emailData;

  // URL del frontend según el tipo de usuario
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = tipoUsuario === 'cliente' 
    ? `${frontendUrl}/reset-password-cliente?token=${resetToken}`
    : `${frontendUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🔐 Recuperación de Contraseña - InmoGestion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 15px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 InmoGestion</h1>
            <p>Recuperación de Contraseña</p>
          </div>
          
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en InmoGestion.</p>
            
            <p>Si no realizaste esta solicitud, puedes ignorar este correo. Tu contraseña no cambiará.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="btn">🔐 Restablecer Contraseña</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
            
            <div class="warning">
              <strong>⏰ Importante:</strong><br>
              Este enlace expirará en <strong>1 hora</strong> por seguridad.
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              <strong>Consejos de seguridad:</strong><br>
              • Nunca compartas tu contraseña<br>
              • Usa una contraseña única y segura<br>
              • Si no solicitaste este cambio, contacta soporte
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 InmoGestion. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const resultado = await enviarEmail(mailOptions);
    if (resultado.success) {
      console.log('✅ Email de recuperación enviado:', resultado.messageId);
    } else {
      console.error('❌ Error al enviar email de recuperación:', resultado.error);
    }
    return resultado;
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;
/**
 * Email de verificación de correo (usuario o cliente)
 */
export const enviarEmailVerificacion = async (data) => {
  const { email, nombre, token, tipoUsuario } = data;
  // Construir enlace backend directo
  const baseBackend = process.env.BACKEND_URL || 'http://localhost:4000';
  const path = tipoUsuario === 'cliente' ? 'verificar-email-cliente' : 'verificar-email-usuario';
  const verifyUrl = `${baseBackend}/api/auth/${path}/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✔ Verifica tu correo - InmoGestión',
    html: `<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;color:#333;} .container{max-width:600px;margin:0 auto;padding:20px;} .header{background:#2563eb;color:#fff;padding:25px;text-align:center;border-radius:8px 8px 0 0;} .content{background:#fff;padding:30px;border:1px solid #e5e7eb;} .btn{display:inline-block;padding:14px 26px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin:25px 0;} .footer{font-size:12px;color:#6b7280;text-align:center;margin-top:30px;} .warning{background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin-top:20px;border-radius:4px;}</style></head><body><div class="container"><div class="header"><h1>InmoGestión</h1><p>Verificación de correo</p></div><div class="content"><h2>Hola ${nombre},</h2><p>Gracias por registrarte. Para activar tu cuenta verifica tu correo:</p><div style="text-align:center"><a class="btn" href="${verifyUrl}">Verificar correo</a></div><p>Si el botón no funciona, copia y pega este enlace:</p><p style="word-break:break-all;font-size:14px"><a href="${verifyUrl}">${verifyUrl}</a></p><div class="warning"><strong>Importante:</strong> El enlace expira en 24 horas.</div><p style="margin-top:25px;font-size:14px;color:#555">Si no creaste esta cuenta puedes ignorar este mensaje.</p></div><div class="footer">© 2025 InmoGestión. Mensaje automático.</div></div></body></html>`
  };
  try {
    const resultado = await enviarEmail(mailOptions);
    if (resultado.success) {
      console.log('✅ Email verificación enviado:', resultado.messageId);
    } else {
      console.error('❌ Error email verificación:', resultado.error);
    }
    return resultado;
  } catch (error) {
    console.error('❌ Error email verificación:', error);
    return { success: false, error: error.message };
  }
};
