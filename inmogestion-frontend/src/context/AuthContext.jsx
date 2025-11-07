import { createContext, useState, useEffect } from "react";

/**
 * Contexto de Autenticación
 * Maneja el estado global de autenticación del usuario en toda la aplicación
 * Permite login, logout y persistencia de sesión con localStorage
 * 
 * @example
 * const { user, login, logout } = useContext(AuthContext);
 * if (user) { // Usuario autenticado }
 */
const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación
 * Envuelve la aplicación para proveer estado de usuario y funciones de auth
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export function AuthProvider({ children }) {
  // Estado del usuario actual (null si no está autenticado)
  const [user, setUser] = useState(null);

  /**
   * Función para iniciar sesión
   * Guarda el usuario en el estado y en localStorage para persistencia
   * 
   * @param {Object} userData - Datos del usuario (id, nombre, rol, token, etc.)
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Función para cerrar sesión
   * Limpia el estado del usuario y elimina datos de localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Valores y funciones disponibles para todos los componentes
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
