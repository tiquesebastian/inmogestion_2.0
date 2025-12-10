/**
 * Middleware de Auditoría
 * Registra acciones críticas del sistema para trazabilidad y seguridad
 */

import db from '../config/db.js';

/**
 * Registra una acción en la tabla de auditoría
 * @param {Object} params - Parámetros de auditoría
 * @param {string} params.tabla - Tabla afectada (usuario, cliente, propiedad, etc.)
 * @param {string} params.accion - Acción realizada (CREATE, UPDATE, DELETE, LOGIN, VERIFY_EMAIL, etc.)
 * @param {string} params.descripcion - Descripción detallada de la acción
 * @param {string} params.usuarioAccion - Email o identificador del usuario que realizó la acción
 * @param {Object} params.detalles - Objeto JSON con detalles adicionales (opcional)
 * @param {Object} params.req - Request object de Express (para obtener IP, user-agent)
 */
export const registrarAuditoria = async ({
  tabla,
  accion,
  descripcion,
  usuarioAccion,
  detalles = {},
  req = null
}) => {
  try {
    // Enriquecer detalles con información de la request si está disponible
    const detallesCompletos = {
      ...detalles,
      ip: req?.ip || req?.connection?.remoteAddress || 'desconocida',
      userAgent: req?.get('user-agent') || 'desconocido',
      timestamp: new Date().toISOString()
    };

    await db.query(
      `INSERT INTO auditoria (tabla_afectada, accion, descripcion, usuario_accion, fecha_accion, detalle_json)
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [
        tabla,
        accion,
        descripcion,
        usuarioAccion || 'sistema',
        JSON.stringify(detallesCompletos)
      ]
    );
  } catch (error) {
    // No fallar la operación principal si falla la auditoría
    console.error('⚠️ Error registrando auditoría:', error);
  }
};

/**
 * Middleware Express para auditar automáticamente después de respuestas exitosas
 * Uso: router.post('/endpoint', auditMiddleware('usuario', 'CREATE'), handler)
 */
export const auditMiddleware = (tabla, accion) => {
  return (req, res, next) => {
    // Interceptar el método res.json para auditar después de respuesta exitosa
    const originalJson = res.json.bind(res);
    
    res.json = function (data) {
      // Solo auditar respuestas exitosas (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const usuarioAccion = req.user?.correo || req.user?.email || req.body?.correo || 'anónimo';
        const descripcion = generarDescripcion(accion, tabla, req, data);
        
        registrarAuditoria({
          tabla,
          accion,
          descripcion,
          usuarioAccion,
          detalles: {
            endpoint: req.path,
            metodo: req.method,
            payload: sanitizarPayload(req.body),
            resultado: sanitizarRespuesta(data)
          },
          req
        }).catch(err => console.error('Error en auditoría middleware:', err));
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

/**
 * Genera una descripción legible de la acción
 */
const generarDescripcion = (accion, tabla, req, data) => {
  const acciones = {
    'CREATE': `Creó registro en ${tabla}`,
    'UPDATE': `Actualizó registro en ${tabla}`,
    'DELETE': `Eliminó registro en ${tabla}`,
    'LOGIN': `Inicio de sesión en ${tabla}`,
    'LOGOUT': `Cierre de sesión en ${tabla}`,
    'VERIFY_EMAIL': `Verificó correo en ${tabla}`,
    'RESEND_VERIFICATION': `Reenvió verificación para ${tabla}`,
    'PASSWORD_RESET_REQUEST': `Solicitó recuperación de contraseña en ${tabla}`,
    'PASSWORD_RESET': `Restableció contraseña en ${tabla}`,
    'REGISTER': `Registró nuevo ${tabla}`,
    'UPLOAD_DOCUMENT': `Subió documento en ${tabla}`,
    'DOWNLOAD_DOCUMENT': `Descargó documento de ${tabla}`,
    'VIEW': `Consultó ${tabla}`
  };
  
  return acciones[accion] || `${accion} en ${tabla}`;
};

/**
 * Sanitiza el payload removiendo información sensible
 */
const sanitizarPayload = (body) => {
  if (!body || typeof body !== 'object') return {};
  
  const sanitizado = { ...body };
  
  // Remover campos sensibles
  const camposSensibles = [
    'contrasena', 'password', 'newPassword', 'oldPassword',
    'token', 'reset_token', 'email_token',
    'clave_maestra', 'masterKey'
  ];
  
  camposSensibles.forEach(campo => {
    if (sanitizado[campo]) {
      sanitizado[campo] = '[REDACTADO]';
    }
  });
  
  return sanitizado;
};

/**
 * Sanitiza la respuesta removiendo información sensible
 */
const sanitizarRespuesta = (data) => {
  if (!data || typeof data !== 'object') return {};
  
  const sanitizado = { ...data };
  
  // Remover tokens y contraseñas de la respuesta
  if (sanitizado.token) sanitizado.token = '[REDACTADO]';
  if (sanitizado.resetToken) sanitizado.resetToken = '[REDACTADO]';
  
  return {
    message: sanitizado.message,
    success: sanitizado.success !== false,
    // Incluir IDs pero no datos sensibles completos
    ...(sanitizado.usuarioId && { usuarioId: sanitizado.usuarioId }),
    ...(sanitizado.id_cliente && { id_cliente: sanitizado.id_cliente })
  };
};

/**
 * Helper para auditar acciones específicas directamente desde controladores
 */
export const audit = {
  login: (usuarioAccion, req, exitoso = true) => 
    registrarAuditoria({
      tabla: 'usuario',
      accion: exitoso ? 'LOGIN' : 'LOGIN_FAILED',
      descripcion: exitoso ? 'Inicio de sesión exitoso' : 'Intento de inicio de sesión fallido',
      usuarioAccion,
      detalles: { exitoso },
      req
    }),
  
  register: (usuarioAccion, tabla, req) => 
    registrarAuditoria({
      tabla,
      accion: 'REGISTER',
      descripcion: `Registro de nuevo ${tabla}`,
      usuarioAccion,
      req
    }),
  
  verifyEmail: (usuarioAccion, tabla, req) => 
    registrarAuditoria({
      tabla,
      accion: 'VERIFY_EMAIL',
      descripcion: `Verificación de correo electrónico`,
      usuarioAccion,
      req
    }),
  
  passwordReset: (usuarioAccion, tabla, req, tipo = 'request') => 
    registrarAuditoria({
      tabla,
      accion: tipo === 'request' ? 'PASSWORD_RESET_REQUEST' : 'PASSWORD_RESET',
      descripcion: tipo === 'request' 
        ? 'Solicitud de recuperación de contraseña' 
        : 'Contraseña restablecida exitosamente',
      usuarioAccion,
      req
    }),
  
  create: (usuarioAccion, tabla, req, descripcion = '') => 
    registrarAuditoria({
      tabla,
      accion: 'CREATE',
      descripcion: descripcion || `Creación de registro en ${tabla}`,
      usuarioAccion,
      req
    }),
  
  update: (usuarioAccion, tabla, req, id, descripcion = '') => 
    registrarAuditoria({
      tabla,
      accion: 'UPDATE',
      descripcion: descripcion || `Actualización de registro ${id} en ${tabla}`,
      usuarioAccion,
      detalles: { id },
      req
    }),
  
  delete: (usuarioAccion, tabla, req, id, descripcion = '') => 
    registrarAuditoria({
      tabla,
      accion: 'DELETE',
      descripcion: descripcion || `Eliminación de registro ${id} en ${tabla}`,
      usuarioAccion,
      detalles: { id },
      req
    })
};

export default { registrarAuditoria, auditMiddleware, audit };
