// Importamos hooks necesarios de React
import { createContext, useState, useEffect } from "react";

// Creamos el contexto para la autenticación
export const AuthContext = createContext();

// Componente proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar información del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para almacenar el token de autenticación
  const [token, setToken] = useState(null);

  // useEffect que se ejecuta una vez al montar el componente
  // Revisa si hay datos guardados en localStorage para mantener sesión persistente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // Si existen datos almacenados, los parsea y actualiza el estado
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Función para iniciar sesión: recibe un objeto con token y usuario
  const login = ({ token, user }) => {
    setUser(user);      // Actualiza el estado con la info del usuario
    setToken(token);    // Guarda el token en estado

    // Guarda también los datos en localStorage para persistencia
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);      // Limpia el estado del usuario
    setToken(null);     // Limpia el token

    // Elimina los datos del localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Proveemos los valores y funciones de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
