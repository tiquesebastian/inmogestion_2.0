import axios from "axios";

// Creamos una instancia de Axios con una URL base para todas las peticiones
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ajusta la URL base y puerto según tu backend
});

// Interceptor que se ejecuta antes de cada petición
// Se utiliza para agregar el token de autenticación en el header Authorization
api.interceptors.request.use((config) => {
  // Obtenemos el token almacenado en localStorage
  const token = localStorage.getItem("token");
  
  // Si existe un token, lo añadimos al header Authorization como Bearer token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Retornamos la configuración modificada para que la petición continúe
  return config;
});

export default api;
