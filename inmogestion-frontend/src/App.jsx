// src/App.jsx
import { useState } from "react";
import Footer from './components/Footer';
import { Routes, Route, Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";


// Páginas
import Inicio from "./pages/inicio";
import Propiedades from "./pages/propiedades";
import Agentes from "./pages/agentes";
import Contacto from "./pages/contacto";
import Registro from "./pages/registro";
import Login from "./pages/login";


// Componentes
import Breadcrumbs from "./components/Breadcrumbs";

export default function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // 🔎 Usamos la ruta actual para saber qué enlace está activo
  const location = useLocation();

  // Clase para enlaces del menú en escritorio
  const desktopLinkClass = (path) =>
    `transition ${
      location.pathname === path
        ? "text-yellow-400 font-bold"
        : "text-gray-200 hover:text-yellow-300"
    }`;

  // Clase para enlaces en el menú móvil
  const mobileLinkClass = (path) =>
    location.pathname === path
      ? "text-yellow-300 font-semibold"
      : "text-white hover:text-yellow-300";

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* ================= ENCABEZADO ================= */}
      <header className="bg-gradient-to-r from-orange-500 to-yellow-400 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="InmoGestión Logo" className="h-14 w-auto" />
            <span className="text-white text-2xl font-bold tracking-wide">
              InmoGestión
            </span>
          </div>

          {/* Menú escritorio */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex gap-10 text-lg font-semibold"
          >
            <Link to="/" className={desktopLinkClass("/")}>Inicio</Link>
            <Link to="/propiedades" className={desktopLinkClass("/propiedades")}>Propiedades</Link>
            <Link to="/agentes" className={desktopLinkClass("/agentes")}>Agentes</Link>
            <Link to="/contacto" className={desktopLinkClass("/contacto")}>Contacto</Link>
            <Link to="/registro" className={desktopLinkClass("/registro")}>Registro</Link>
            <Link to="/login" className={desktopLinkClass("/login")}>Iniciar Sesión</Link>
          </nav>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-white focus:outline-none"
            aria-label="Abrir menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {menuAbierto && (
          <nav className="md:hidden bg-blue-800 text-white flex flex-col px-6 py-4 space-y-4">
            <Link to="/" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/")}>Inicio</Link>
            <Link to="/propiedades" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/propiedades")}>Propiedades</Link>
            <Link to="/agentes" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/agentes")}>Agentes</Link>
            <Link to="/contacto" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/contacto")}>Contacto</Link>
            <Link to="/registro" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/registro")}>Registro</Link>
            <Link to="/login" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/login")}>Iniciar Sesión</Link>
            <Link to="/carga-masiva" onClick={() => setMenuAbierto(false)} className={mobileLinkClass("/carga-masiva")}>Carga Masiva</Link>
          </nav>
        )}
      </header>

      {/* ================= CONTENIDO (RUTAS) ================= */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs justo arriba del contenido */}
        <Breadcrumbs />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/agentes" element={<Agentes />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          {/* Opcional: 404 */}
          <Route path="*" element={<h2 className="text-xl">Página no encontrada</h2>} />
        </Routes>
      </div>

      {/* ================= PIE DE PÁGINA ================= */}
      <footer className="bg-blue-900 text-gray-200 text-center py-6 mt-auto">
        <p>&copy; 🙌</p>
      </footer>
    </main>
  );
}
