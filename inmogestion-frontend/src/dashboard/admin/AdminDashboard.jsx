import React, { useContext, useState } from 'react';
import { Link, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import PropiedadesAdmin from "./PropiedadesAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import ReportesAdmin from "./ReportesAdmin";
import RegistrarAgente from "./RegistrarAgente";
import RegistrarPropiedad from "./RegistrarPropiedad";
import GenerarContrato from "./GenerarContrato";
import ContratosAdmin from "./ContratosAdmin";
import CargaMasiva from "../../pages/CargaMasiva";
import DocumentosCliente from "./DocumentosCliente";
import AuthContext from "../../context/AuthContext";

export default function AdminDashboard() {
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
    const path = location.pathname.replace('/admin/', '').replace('/admin', '');
    const labels = {
      'propiedades': 'Propiedades',
      'usuarios': 'Usuarios',
      'reportes': 'Reportes',
      'registrar-agente': 'Registrar Agente',
      'registrar-propiedad': 'Registrar Propiedad',
      'generar-contrato': 'Generar Contrato',
      'contratos': 'Reporte de Contratos',
      'carga-masiva': 'Carga Masiva',
      'documentos-cliente': 'Documentos de Clientes',
    };
    return labels[path] || 'Propiedades';
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
            <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-blue-900">IG</div>
            <h2 className="text-xl font-bold">Panel Admin</h2>
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
        <nav className="space-y-2 flex-grow overflow-y-auto">
          {/* Reportes primero en el menú */}
          <Link 
            to="/admin/reportes"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('reportes') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Reportes
          </Link>
          <Link 
            to="/admin/propiedades" 
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('propiedades') && !location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Propiedades
          </Link>
          <Link 
            to="/admin/registrar-propiedad"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Registrar Propiedad
          </Link>
          <Link 
            to="/admin/usuarios"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('usuarios') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Usuarios
          </Link>
          
          <Link 
            to="/admin/registrar-agente"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('registrar-agente') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Registrar Agente
          </Link>
          <Link 
            to="/admin/generar-contrato"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('generar-contrato') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Generar Contrato
          </Link>
          <Link 
            to="/admin/contratos"
            onClick={() => setSidebarOpen(false)}
            className={`block px-4 py-2 rounded transition ${location.pathname.includes('/admin/contratos') && !location.pathname.includes('generar-contrato') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}
          >
            Reporte Contratos
          </Link>
          {/* Oculto: módulos de documentos temporalmente deshabilitados */}
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

      <main className="flex-1 w-full lg:w-auto overflow-auto">
        {/* Header móvil con botón menú */}
        <div className="lg:hidden sticky top-0 bg-blue-900 text-white p-4 shadow-md z-30 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-yellow-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Panel Admin - {getBreadcrumb()}</h1>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb interno - solo desktop */}
          <div className="hidden lg:block mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-semibold">Admin</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-semibold">{getBreadcrumb()}</span>
          </div>

          {/* Bienvenida */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg px-4 py-3 shadow-sm">
            Bienvenido, <span className="font-semibold">{user?.nombre || user?.username || 'Administrador'}</span>
          </div>

          <Routes>
            {/* Al iniciar, ir directo a reportes */}
            <Route index element={<Navigate to="reportes" replace />} />
            <Route path="propiedades" element={<PropiedadesAdmin key="propiedades" />} />
            <Route path="registrar-propiedad" element={<RegistrarPropiedad key="registrar-propiedad" />} />
            <Route path="usuarios" element={<UsuariosAdmin key="usuarios" />} />
            <Route path="reportes" element={<ReportesAdmin key="reportes" />} />
            <Route path="registrar-agente" element={<RegistrarAgente key="registrar-agente" />} />
            <Route path="generar-contrato" element={<GenerarContrato key="generar-contrato" />} />
            <Route path="contratos" element={<ContratosAdmin key="contratos" />} />
            {/* Oculto: rutas documentos */}
          </Routes>
        </div>
      </main>
    </div>
  );
}
