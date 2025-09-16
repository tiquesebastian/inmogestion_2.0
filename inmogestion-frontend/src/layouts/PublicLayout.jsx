// Importamos Outlet para renderizar rutas hijas dentro de esta estructura de layout
import { Outlet } from "react-router-dom";
// Importamos el componente Navbar que se mostrará en todas las páginas públicas
import Navbar from "../components/Navbar";

function PublicLayout() {
  return (
    <div>
      {/* Navbar común para todas las rutas públicas */}
      <Navbar />
      
      {/* Contenedor principal con padding donde se renderizarán las rutas hijas */}
      <main className="p-4">
        {/* Outlet representa el lugar donde se renderizarán los componentes hijos (rutas anidadas) */}
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
