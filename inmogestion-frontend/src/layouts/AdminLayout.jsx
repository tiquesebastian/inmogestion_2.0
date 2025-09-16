// Importamos Outlet para renderizar las rutas hijas dentro de este layout
import { Outlet } from "react-router-dom";
// Importamos el Sidebar específico para la sección de administración
import Sidebar from "../components/admin/Sidebar";

function AdminLayout() {
  return (
    // Contenedor principal que usa flexbox para alinear el Sidebar y el contenido principal
    <div className="flex min-h-screen">
      
      {/* Barra lateral con enlaces del panel administrativo */}
      <Sidebar />
      
      {/* Área principal donde se mostrarán las páginas hijas */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Outlet es donde se renderizan las rutas hijas dentro de este layout */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
