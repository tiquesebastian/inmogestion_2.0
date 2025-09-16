// Importación de componentes de React Router
import { Routes, Route, Navigate } from "react-router-dom";

// Hook para usar el contexto de autenticación
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Layouts que definen la estructura general de las vistas públicas y privadas
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";

// Componentes para la sección administrativa (rutas privadas)
import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Propiedades from "./pages/admin/Propiedades";
import Contratos from "./pages/admin/Contratos";
import Reportes from "./pages/admin/Reportes";

function App() {
  // Extraemos el token del contexto de autenticación para saber si el usuario está logueado
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Definimos las rutas usando React Router */}
      <Routes>

        {/* Rutas públicas, visibles para todos los usuarios (clientes) */}
        <Route element={<PublicLayout />}>
          {/* Página principal */}
          <Route path="/" element={<Home />} />
          {/* Página de login */}
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rutas privadas, accesibles solo si hay un token (usuario autenticado) */}
        {token ? (
          // Si el usuario está autenticado, usamos el layout administrativo
          <Route element={<AdminLayout />}>
            {/* Panel principal del admin */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* Página de clientes */}
            <Route path="/admin/clientes" element={<Clientes />} />
            {/* Página de propiedades */}
            <Route path="/admin/propiedades" element={<Propiedades />} />
            {/* Página de contratos */}
            <Route path="/admin/contratos" element={<Contratos />} />
            {/* Página de reportes */}
            <Route path="/admin/reportes" element={<Reportes />} />
          </Route>
        ) : (
          // Si no hay token, redirige cualquier intento de entrar a /admin/* al login
          <Route path="/admin/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
