import { Link, useLocation } from "react-router-dom";

/**
 * Componente Breadcrumbs
 * Muestra la ruta de navegación actual para ayudar al usuario a ubicarse
 * Construye automáticamente el breadcrumb a partir de la URL actual
 * 
 * @example
 * URL: /propiedades/123 → Inicio / Propiedades / 123
 */
export default function Breadcrumbs() {
  // Obtiene la ubicación actual del router
  const location = useLocation();
  
  // Divide el path en segmentos (elimina cadenas vacías)
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Mapeo de rutas a etiquetas legibles
  const labels = {
    propiedades: "Propiedades",
    agentes: "Agentes",
    contacto: "Contacto",
    registro: "Registro",
    "carga-masiva": "Carga Masiva",
    "politica-privacidad": "Política de Privacidad",
    login: "Iniciar Sesión",
  };

  return (
    <nav className="text-sm mb-4 text-gray-700" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Enlace a inicio siempre presente */}
        <li>
          <Link to="/" className="hover:text-blue-600 font-medium transition">
            Inicio
          </Link>
        </li>

        {/* Genera breadcrumbs para cada segmento del path */}
        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          
          return (
            <li key={routeTo} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {isLast ? (
                // Último elemento - no es clickeable
                <span className="text-blue-600 font-semibold capitalize">
                  {labels[name] || name}
                </span>
              ) : (
                // Elementos intermedios - son clickeables
                <Link to={routeTo} className="hover:text-blue-600 capitalize transition">
                  {labels[name] || name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
