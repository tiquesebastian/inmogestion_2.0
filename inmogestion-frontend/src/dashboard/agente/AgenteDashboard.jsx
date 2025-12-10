import React, { useContext, useState } from 'react';
import { Link, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import PropiedadesAgente from "./PropiedadesAgente";
import PerfilAgente from "./PerfilAgente";
import RegistrarPropiedad from "./RegistrarPropiedad";
import GenerarContrato from "./GenerarContrato";
import AuthContext from "../../context/AuthContext";

export default function AgenteDashboard() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Breadcrumb interno para el dashboard
  const getBreadcrumb = () => {
    const path = location.pathname.replace('/agente/', '').replace('/agente', '');
    const labels = {
      'propiedades': 'Mis Propiedades',
      'perfil': 'Mi Perfil',
      'registrar-propiedad': 'Registrar Propiedad',
      'generar-contrato': 'Generar Contrato',
    };
    return labels[path] || 'Mis Propiedades';
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-blue-900 text-white p-6 h-full flex flex-col shadow-lg z-50
        fixed lg:sticky top-0 left-0
        w-64 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-blue-900">AG</div>
            <h2 className="text-xl font-bold">Panel Agente</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-yellow-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-md px-3 py-2 text-sm font-medium shadow-inner mb-6">
          Bienvenido, <span className="font-bold">{user?.nombre || user?.username || 'Agente'}</span>
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto">
          <Link 
            to="/agente/propiedades" 
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('propiedades') && !location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Mis Propiedades
          </Link>
          <Link 
            to="/agente/registrar-propiedad" 
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Registrar Propiedad
          </Link>
          <Link 
            to="/agente/generar-contrato" 
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('generar-contrato') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Generar Contrato
          </Link>
          <Link 
            to="/agente/perfil" 
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('perfil') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Mi Perfil
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 lg:ml-0 p-4 sm:p-6 lg:p-8 overflow-auto w-full">
        {/* Botón hamburguesa para móvil */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb interno */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-blue-600 font-semibold">Agente</span>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-gray-800 font-semibold">{getBreadcrumb()}</span>
        </div>

        <Routes>
          <Route index element={<Navigate to="propiedades" replace />} />
          <Route path="propiedades" element={<PropiedadesAgente key="propiedades" />} />
          <Route path="registrar-propiedad" element={<RegistrarPropiedad key="registrar-propiedad" />} />
          <Route path="generar-contrato" element={<GenerarContrato key="generar-contrato" />} />
          <Route path="perfil" element={<PerfilAgente key="perfil" />} />
        </Routes>
      </main>
    </div>
  );
}
