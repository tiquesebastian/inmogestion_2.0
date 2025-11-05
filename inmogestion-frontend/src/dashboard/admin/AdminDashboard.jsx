import React, { useContext } from 'react';
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import PropiedadesAdmin from "./PropiedadesAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import ReportesAdmin from "./ReportesAdmin";
import RegistrarAgente from "./RegistrarAgente";
import AuthContext from "../../context/AuthContext";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full">
      <aside className="bg-blue-900 text-white p-6 h-full w-64 flex flex-col fixed left-0">
        <h2 className="text-2xl font-bold mb-8">Panel Admin</h2>
        <nav className="space-y-4 flex-grow">
          <Link to="propiedades" className="block hover:text-yellow-300">Propiedades</Link>
          <Link to="usuarios" className="block hover:text-yellow-300">Usuarios</Link>
          <Link to="reportes" className="block hover:text-yellow-300">Reportes</Link>
          <Link to="registrar-agente" className="block hover:text-yellow-300">Registrar Agente</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
        >
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-8 ml-64">
        <Routes>
          <Route path="/" element={<Navigate to="propiedades" />} />
          <Route path="propiedades" element={<PropiedadesAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="reportes" element={<ReportesAdmin />} />
          <Route path="registrar-agente" element={<RegistrarAgente />} />
          <Route index element={
            <div className="text-center mt-10">
              <h1 className="text-3xl font-bold">Bienvenido al Panel de Administración</h1>
              <p className="mt-4 text-gray-600">Selecciona una opción del menú para comenzar</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}
