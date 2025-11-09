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
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
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
          <ul className="flex space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg font-medium transition text-sm sm:text-base ${
                      isActive 
                        ? "bg-yellow-400 text-blue-900 shadow-md" 
                        : "text-white hover:bg-blue-700 hover:text-yellow-300"
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
