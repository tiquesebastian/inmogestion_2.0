// Importa el componente PropertyCard que representa cada tarjeta de propiedad
import PropertyCard from "../components/PropertyCard";

function Home() {
  // Lista de propiedades hardcodeadas para mostrar en la página principal
  const properties = [
    {
      id: 1,
      title: "Casa en Bogotá",
      city: "Bogotá",
      price: 350000000,
      image: "https://via.placeholder.com/400x200",
      description: "Hermosa casa de 3 habitaciones en el norte de Bogotá.",
    },
    {
      id: 2,
      title: "Apartamento en Medellín",
      city: "Medellín",
      price: 250000000,
      image: "https://via.placeholder.com/400x200",
      description: "Apartamento moderno con vista panorámica en El Poblado.",
    },
    {
      id: 3,
      title: "Lote en Cali",
      city: "Cali",
      price: 150000000,
      image: "https://via.placeholder.com/400x200",
      description: "Lote de 200 m² ubicado en zona de alta valorización.",
    },
  ];

  return (
    // Contenedor principal con padding, fondo gris claro y altura mínima para pantalla completa
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Título principal centrado, grande y en negrita */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Bienvenido a InmoGestión 🏡
      </h1>

      {/* Sección de filtros de búsqueda */}
      <div className="mb-6 flex justify-center space-x-4">
        {/* Input para filtrar por ciudad */}
        <input
          type="text"
          placeholder="Ciudad"
          className="border p-2 rounded"
        />
        {/* Input para filtrar por precio mínimo */}
        <input
          type="number"
          placeholder="Precio mínimo"
          className="border p-2 rounded"
        />
        {/* Input para filtrar por precio máximo */}
        <input
          type="number"
          placeholder="Precio máximo"
          className="border p-2 rounded"
        />
        {/* Botón para ejecutar la búsqueda (aún sin funcionalidad) */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
      </div>

      {/* Contenedor con grilla responsiva para mostrar las tarjetas de propiedades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recorre el arreglo de propiedades y renderiza un PropertyCard por cada una */}
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default Home;
