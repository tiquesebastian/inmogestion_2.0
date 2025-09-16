// Importa el componente Link de React Router para la navegación sin recargar la página
import { Link } from "react-router-dom";

// Define el componente Sidebar, que es el menú lateral para la navegación de la parte administrativa
function Sidebar() {
  return (
    // Contenedor lateral con un ancho fijo, fondo azul oscuro, texto blanco y padding
    <aside className="w-64 bg-blue-900 text-white p-4">

      {/* Título del sidebar */}
      <h2 className="text-xl font-bold mb-6">InmoGestión</h2>

      {/* Navegación con enlaces espaciados verticalmente */}
      <nav className="space-y-4">
        {/* Cada Link navega a una sección del panel de administración */}
        <Link to="/admin/dashboard" className="block hover:text-blue-300">
          Dashboard
        </Link>

        <Link to="/admin/clientes" className="block hover:text-blue-300">
          Clientes
        </Link>

        <Link to="/admin/propiedades" className="block hover:text-blue-300">
          Propiedades
        </Link>

        <Link to="/admin/contratos" className="block hover:text-blue-300">
          Contratos
        </Link>

        <Link to="/admin/reportes" className="block hover:text-blue-300">
          Reportes
        </Link>
      </nav>
    </aside>
  );
}

// Exporta el componente para que pueda ser utilizado en otras partes de la app (por ejemplo, en AdminLayout)
export default Sidebar;
