import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import InmoGestionLogin from "../pages/InmoGestionLogin";

// Páginas públicas
import Inicio from "../pages/inicio";
import Login from "../pages/login";
import Registro from "../pages/registro";
import RegistroCliente from "../pages/RegistroCliente";
import RecuperarContrasenaCliente from "../pages/RecuperarContrasenaCliente";
import RecuperarContrasenaUsuario from "../pages/RecuperarContrasenaUsuario";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordCliente from "../pages/ResetPasswordCliente";
import TerminosCondiciones from "../pages/TerminosCondiciones";
import Contacto from "../pages/contacto";
import Agentes from "../pages/agentes";
import CargaMasiva from "../pages/CargaMasiva";
import PoliticaPrivacidad from "../pages/PoliticaPrivacidad";
import FilteredProperties from "../components/FilteredProperties";
import PropertyDetail from "../components/PropertyDetail";

// Componentes del dashboard (áreas protegidas)
import AdminDashboard from "../dashboard/admin/AdminDashboard";
import AgenteDashboard from "../dashboard/agente/AgenteDashboard";
import ClienteDashboard from "../dashboard/cliente/ClienteDashboard";

/**
 * AppRouter - Componente principal de enrutamiento
 * Define todas las rutas de la aplicación (públicas y protegidas)
 * Gestiona la protección de rutas según el rol del usuario autenticado
 */
export default function AppRouter() {
  // Obtener el usuario autenticado del contexto
  const { user } = useContext(AuthContext);
  
  // Estado para controlar el menú móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Obtener location actual de forma reactiva
  const location = useLocation();

  // Rutas que usan layout completo sin navbar/footer/breadcrumbs
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/agente') || location.pathname.startsWith('/cliente');

  const isHome = location.pathname === "/";

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {!isDashboard && <Navbar menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />}

      {!isDashboard && (
        <>
          {/* Breadcrumbs siempre en contenedor */}
          <div className="max-w-7xl mx-auto px-6 py-6 w-full">
            <Breadcrumbs />
          </div>

          {/* Contenido de rutas */}
          <div className={isHome ? "flex-1 w-full" : "flex-1 max-w-7xl mx-auto px-6 py-6"}>
            <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro-cliente" element={<RegistroCliente />} />
            <Route path="/recuperar-contrasena-cliente" element={<RecuperarContrasenaCliente />} />
            <Route path="/recuperar-contrasena-usuario" element={<RecuperarContrasenaUsuario />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password-cliente" element={<RecuperarContrasenaCliente />} />
            <Route path="/reset-password-cliente" element={<ResetPasswordCliente />} />
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
            <Route path="/propiedades" element={<FilteredProperties />} />
            <Route path="/propiedades/:id" element={<PropertyDetail />} />
            <Route path="/agentes" element={<Agentes />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carga-masiva" element={<CargaMasiva />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/inmogestion" element={<InmoGestionLogin />} />

            {/* Ruta 404 */}
            <Route path="*" element={<h2 className="text-xl">Página no encontrada</h2>} />
            </Routes>
          </div>
        </>
      )}

      {isDashboard && (
        <Routes>
          {/* Rutas protegidas - Admin */}
          <Route
            path="/admin/*"
            element={
              user?.rol === 1 || user?.rol === "Administrador" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rutas protegidas - Agente */}
          <Route
            path="/agente/*"
            element={
              user?.rol === 2 || user?.rol === "Agente" ? (
                <AgenteDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rutas protegidas - Cliente */}
          <Route
            path="/cliente/*"
            element={
              user?.rol === "cliente" ? (
                <ClienteDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      )}

      {!isDashboard && <Footer />}
    </main>
  );
}