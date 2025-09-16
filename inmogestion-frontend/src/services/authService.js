// Importamos axios para hacer peticiones HTTP
import axios from "axios";

// URL base del servicio de autenticación en el backend
const API_URL = "http://localhost:4000/api/auth"; 

// Función para hacer login enviando correo y contraseña
export const login = async (correo, contrasena) => {
  // Hacemos una petición POST al endpoint /login con los datos del usuario
  const response = await axios.post(`${API_URL}/login`, {
    correo,
    contrasena,
  });

  // Adaptamos la respuesta para devolver solo el token y la información del usuario
  return {
    token: response.data.token,      // Token JWT para autenticación
    user: response.data.usuario,     // Datos del usuario autenticado
  };
};
