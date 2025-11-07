import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

// Páginas públicas
import Inicio from "../pages/inicio";
import Login from "../pages/login";
import Registro from "../pages/registro";
import Contacto from "../pages/contacto";
import Agentes from "../pages/agentes";
import CargaMasiva from "../pages/CargaMasiva";
import PoliticaPrivacidad from "../pages/PoliticaPrivacidad";
import FilteredProperties from "../components/FilteredProperties";
import PropertyDetail from "../components/PropertyDetail";

// Componentes del dashboard (áreas protegidas)
import AdminDashboard from "../dashboard/admin/AdminDashboard";
import AgenteDashboard from "../dashboard/agente/AgenteDashboard";

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
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/agente');

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {!isDashboard && <Navbar menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />}
      
      {!isDashboard && (
        <div className="flex-1 max-w-7xl mx-auto px-6 py-12">
          <Breadcrumbs />
          
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/propiedades" element={<FilteredProperties />} />
            <Route path="/propiedades/:id" element={<PropertyDetail />} />
            <Route path="/agentes" element={<Agentes />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carga-masiva" element={<CargaMasiva />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />

            {/* Ruta 404 */}
            <Route path="*" element={<h2 className="text-xl">Página no encontrada</h2>} />
          </Routes>
        </div>
      )}

      {isDashboard && (
        <Routes>
          {/* Rutas protegidas - Admin */}
          <Route
            path="/admin/*"
            element={
              user?.rol === "Administrador" ? (
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
              user?.rol === "Agente" ? (
                <AgenteDashboard />
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