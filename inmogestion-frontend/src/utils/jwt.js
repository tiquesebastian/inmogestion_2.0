/**
 * Utilidades para manejo de JWT (JSON Web Tokens)
 */

/**
 * Decodifica un token JWT sin validar la firma
 * Útil para extraer información del payload en el cliente
 * ADVERTENCIA: No usar para validación de seguridad, solo para lectura de datos
 * 
 * @param {string} token - Token JWT a decodificar
 * @returns {Object|null} Payload decodificado o null si hay error
 */
export function decodeJWT(token) {
  if (!token) return null;
  
  try {
    // JWT tiene 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.warn('Token JWT inválido: no tiene 3 partes');
      return null;
    }
    
    // El payload es la parte del medio (index 1)
    const payload = parts[1];
    
    // Decodificar de Base64URL a string
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parsear el JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
}

/**
 * Extrae el ID de cliente del token JWT
 * Busca en varios campos posibles: id_cliente, id, userId, sub
 * 
 * @param {string} token - Token JWT
 * @returns {number|string|null} ID del cliente o null si no se encuentra
 */
export function getClienteIdFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  // Buscar en varios campos comunes
  return payload.id_cliente || payload.id || payload.userId || payload.sub || null;
}

/**
 * Extrae información completa del usuario del token JWT
 * 
 * @param {string} token - Token JWT
 * @returns {Object|null} Datos del usuario o null si hay error
 */
export function getUserFromToken(token) {
  return decodeJWT(token);
}

/**
 * Verifica si un token ha expirado
 * 
 * @param {string} token - Token JWT
 * @returns {boolean} true si ha expirado, false si sigue válido
 */
export function isTokenExpired(token) {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  // exp viene en segundos, Date.now() en milisegundos
  const expirationDate = payload.exp * 1000;
  return Date.now() >= expirationDate;
}
