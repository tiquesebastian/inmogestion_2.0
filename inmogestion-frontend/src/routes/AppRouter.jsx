import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";

// Páginas
import Inicio from "../pages/inicio";
import Login from "../pages/login";
import Registro from "../pages/registro";
import Propiedades from "../pages/propiedades";
import Contacto from "../pages/contacto";
import Agentes from "../pages/agentes";
import CargaMasiva from "../pages/CargaMasiva";

// Componentes del dashboard
import AdminDashboard from "../dashboard/admin/AdminDashboard";
import AgenteDashboard from "../dashboard/agente/AgenteDashboard";

export default function AppRouter() {
  const { user } = useContext(AuthContext);
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <Navbar menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />
      
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12">
        <Breadcrumbs />
        
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/agentes" element={<Agentes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carga-masiva" element={<CargaMasiva />} />

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

          {/* Ruta 404 */}
          <Route path="*" element={<h2 className="text-xl">Página no encontrada</h2>} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
}