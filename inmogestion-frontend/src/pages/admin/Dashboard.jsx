// Componente funcional que representa la página principal del panel administrativo
function Dashboard() {
  return (
    <div>
      {/* Título principal con tamaño de texto grande y negrita */}
      <h1 className="text-2xl font-bold">Panel de Control</h1>
      
      {/* Párrafo de bienvenida */}
      <p>Bienvenido al panel administrativo de InmoGestión.</p>
    </div>
  );
}

// Exporta el componente para usarlo en otras partes de la aplicación
export default Dashboard;
