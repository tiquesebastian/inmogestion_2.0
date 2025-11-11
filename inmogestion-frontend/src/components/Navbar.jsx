import { NavLink } from "react-router-dom";

/**
 * Componente Navbar
 * Barra de navegación principal de la aplicación
 * Muestra los enlaces principales y destaca la ruta activa
 */
export default function Navbar() {
  // Lista de enlaces de navegación
  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/propiedades", label: "Propiedades" },
    { path: "/contacto", label: "Contacto" },
    { path: "/inmogestion", label: "InmoGestión" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b border-orange-400/30">
      <div className="w-full px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y nombre de la empresa */}
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <img 
              src="/logo.png" 
              alt="Grupo Inmobiliario Cortés" 
              className="h-12 md:h-14 w-auto"
            />
            <span className="text-white font-bold text-lg md:text-xl hidden sm:block">
              Grupo Inmobiliario Cortés
            </span>
          </NavLink>

          {/* Enlaces de navegación */}
          <ul className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl font-semibold tracking-wide transition-all text-xs sm:text-sm flex items-center gap-1 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-blue-900 shadow-lg shadow-orange-500/30"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
