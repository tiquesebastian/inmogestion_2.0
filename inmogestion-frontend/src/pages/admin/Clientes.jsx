// Componente funcional que representa la sección para administrar clientes
function Clientes() {
  return (
    <div>
      {/* Título principal con tamaño de texto grande y negrita */}
      <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
      
      {/* Párrafo que indica la funcionalidad de esta sección */}
      <p>Aquí podrás crear, editar o eliminar clientes.</p>
    </div>
  );
}

// Exporta el componente para usarlo en otras partes de la aplicación
export default Clientes;
