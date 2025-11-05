import React, { useContext } from 'react';
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import PropiedadesAgente from "./PropiedadesAgente";
import PerfilAgente from "./PerfilAgente";
import AuthContext from "../../context/AuthContext";

export default function AgenteDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard flex">
      <aside className="bg-blue-900 text-white p-6 min-h-screen w-64 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Panel Agente</h2>
        <nav className="space-y-4 flex-grow">
          <Link to="propiedades" className="block hover:text-yellow-300">Mis Propiedades</Link>
          <Link to="perfil" className="block hover:text-yellow-300">Mi Perfil</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
        >
          Cerrar Sesión
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Routes>
          <Route path="propiedades" element={<PropiedadesAgente />} />
          <Route path="perfil" element={<PerfilAgente />} />
          <Route index element={
            <div className="text-center mt-10">
              <h1 className="text-3xl font-bold">Bienvenido a tu Panel de Agente</h1>
              <p className="mt-4 text-gray-600">Selecciona una opción del menú para comenzar</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}
