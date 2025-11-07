import React, { useContext } from 'react';
import { Link, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import PropiedadesAdmin from "./PropiedadesAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import ReportesAdmin from "./ReportesAdmin";
import RegistrarAgente from "./RegistrarAgente";
import RegistrarPropiedad from "./RegistrarPropiedad";
import AuthContext from "../../context/AuthContext";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
    };
    return labels[path] || 'Propiedades';
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="bg-blue-900 text-white p-6 h-full w-64 flex flex-col fixed left-0 top-0 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
          <h2 className="text-xl font-bold">Panel Admin</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          <Link to="/admin/propiedades" className={`block px-4 py-2 rounded transition ${location.pathname.includes('propiedades') && !location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}>
            Propiedades
          </Link>
          <Link to="/admin/registrar-propiedad" className={`block px-4 py-2 rounded transition ${location.pathname.includes('registrar-propiedad') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}>
            Registrar Propiedad
          </Link>
          <Link to="/admin/usuarios" className={`block px-4 py-2 rounded transition ${location.pathname.includes('usuarios') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}>
            Usuarios
          </Link>
          <Link to="/admin/reportes" className={`block px-4 py-2 rounded transition ${location.pathname.includes('reportes') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}>
            Reportes
          </Link>
          <Link to="/admin/registrar-agente" className={`block px-4 py-2 rounded transition ${location.pathname.includes('registrar-agente') ? 'bg-yellow-500 text-blue-900 font-semibold' : 'hover:bg-blue-800'}`}>
            Registrar Agente
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

      <main className="flex-1 ml-64 p-8 overflow-auto">
        {/* Breadcrumb interno */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-blue-600 font-semibold">Admin</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-semibold">{getBreadcrumb()}</span>
        </div>

        <Routes>
          <Route index element={<Navigate to="propiedades" replace />} />
          <Route path="propiedades" element={<PropiedadesAdmin key="propiedades" />} />
          <Route path="registrar-propiedad" element={<RegistrarPropiedad key="registrar-propiedad" />} />
          <Route path="usuarios" element={<UsuariosAdmin key="usuarios" />} />
          <Route path="reportes" element={<ReportesAdmin key="reportes" />} />
          <Route path="registrar-agente" element={<RegistrarAgente key="registrar-agente" />} />
        </Routes>
      </main>
    </div>
  );
}
