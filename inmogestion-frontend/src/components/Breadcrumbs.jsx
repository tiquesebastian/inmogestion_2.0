import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const labels = {
    propiedades: "Propiedades",
    agentes: "Agentes",
    contacto: "Contacto",
    registro: "Registro",
    "carga-masiva": "Carga Masiva",
    login: "Iniciar Sesión",
  };

  return (
    <nav className="text-sm mb-4 text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="hover:text-orange-500 font-medium">Inicio</Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {isLast ? (
                <span className="text-orange-500 font-semibold capitalize">
                  {labels[name] || name}
                </span>
              ) : (
                <Link to={routeTo} className="hover:text-orange-500 capitalize">
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
