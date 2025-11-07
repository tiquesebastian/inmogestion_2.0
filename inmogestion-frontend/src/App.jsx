import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import './App.css';

/**
 * Componente principal de la aplicación
 * Envuelve toda la app con el AuthProvider para gestionar la autenticación global
 * y renderiza el AppRouter que maneja todas las rutas
 */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
