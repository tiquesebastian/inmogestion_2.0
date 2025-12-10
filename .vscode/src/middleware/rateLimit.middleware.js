import rateLimit from 'express-rate-limit';

// Limita intentos de login para mitigar fuerza bruta.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de login. Intenta más tarde.' }
});

// Limita endpoints sensibles (registro, recuperación)
export const authGenericLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // 50 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Límite de solicitudes alcanzado. Intenta más tarde.' }
});

// Limita reenvío de verificación de email (evita spam)
export const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 reenvíos por IP por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados reenvíos de verificación. Espera una hora antes de reintentar.' }
});
