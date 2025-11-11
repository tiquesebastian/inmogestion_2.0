import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Propiedades() {
  const [tipo, setTipo] = useState("Todos");
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    localidad: "",
    precioMin: "",
    precioMax: "",
    habitaciones: "",
    banos: ""
  });

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/propiedades');
      const data = await response.json();
      setPropiedades(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar propiedades
  const propiedadesFiltradas = propiedades.filter((propiedad) => {
    // Filtro por tipo
    if (tipo !== "Todos" && propiedad.tipo_propiedad !== tipo) return false;
    
    // Filtro por localidad
    if (filtros.localidad && !propiedad.nombre_localidad?.toLowerCase().includes(filtros.localidad.toLowerCase())) return false;
    
    // Filtro por precio
    const precio = parseFloat(propiedad.precio_propiedad);
    if (filtros.precioMin && precio < parseFloat(filtros.precioMin)) return false;
    if (filtros.precioMax && precio > parseFloat(filtros.precioMax)) return false;
    
    // Filtro por habitaciones
    if (filtros.habitaciones && propiedad.habitaciones_propiedad < parseInt(filtros.habitaciones)) return false;
    
    // Filtro por baños
    if (filtros.banos && propiedad.banos_propiedad < parseInt(filtros.banos)) return false;
    
    return true;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-[var(--color-background)] to-[var(--color-secondary-soft)] py-8">
      <div className="w-full px-4 sm:px-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Encuentra tu Propiedad Ideal
          </h1>
          <p className="text-gray-600 text-lg">
            Explora {propiedades.length} propiedades disponibles
          </p>
        </div>

        {/* Filtros por Tipo */}
        <div className="glass-panel p-6 mb-8 shadow-xl">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {["Todos", "Casa", "Apartamento", "Lote"].map((t) => (
              <button
                key={t}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                  tipo === t
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-400/40"
                    : "bg-white/60 text-gray-700 hover:bg-white border border-orange-300/40"
                }`}
                onClick={() => setTipo(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Filtros Avanzados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Localidad..."
              value={filtros.localidad}
              onChange={(e) => setFiltros({ ...filtros, localidad: e.target.value })}
              className="filter-input rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Precio mínimo"
              value={filtros.precioMin}
              onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
              className="filter-input rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Precio máximo"
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
              className="filter-input rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Habitaciones"
              value={filtros.habitaciones}
              onChange={(e) => setFiltros({ ...filtros, habitaciones: e.target.value })}
              className="filter-input rounded-lg px-4 py-2"
            />
            <input
              type="number"
              placeholder="Baños"
              value={filtros.banos}
              onChange={(e) => setFiltros({ ...filtros, banos: e.target.value })}
              className="filter-input rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg font-semibold">
            {propiedadesFiltradas.length} {propiedadesFiltradas.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando propiedades...</p>
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No se encontraron propiedades</h3>
            <p className="mt-2 text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          /* Grid de Tarjetas */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {propiedadesFiltradas.map((propiedad) => (
              <Link
                key={propiedad.id_propiedad}
                to={`/propiedad/${propiedad.id_propiedad}`}
                className="property-card flex flex-col group"
              >
                {/* Imagen */}
                <div className="relative h-56 overflow-hidden">
                  {propiedad.imagen_principal ? (
                    <img
                      src={`http://localhost:4000${propiedad.imagen_principal}`}
                      alt={propiedad.titulo_propiedad || propiedad.tipo_propiedad}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="badge-type">
                      {propiedad.tipo_propiedad}
                    </span>
                  </div>

                  {propiedad.estado_propiedad === 'Disponible' && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        Disponible
                      </span>
                    </div>
                  )}

                  {propiedad.estado_propiedad === 'Vendida' && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        Vendida
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Precio */}
                  <div className="mb-3">
                    <p className="text-2xl font-extrabold text-orange-600">
                      ${parseInt(propiedad.precio_propiedad).toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Título */}
                  <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
                    {propiedad.titulo_propiedad || propiedad.direccion_formato}
                  </h3>

                  {/* Ubicación */}
                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{propiedad.nombre_localidad || 'Ubicación'}</span>
                  </p>

                  {/* Descripción */}
                  {propiedad.descripcion && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                      {propiedad.descripcion}
                    </p>
                  )}

                  {/* Características */}
                  <div className="flex items-center gap-4 text-sm text-gray-700 border-t pt-3 mt-auto">
                    {propiedad.habitaciones_propiedad > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-medium">{propiedad.habitaciones_propiedad}</span>
                      </div>
                    )}
                    {propiedad.banos_propiedad > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span className="font-medium">{propiedad.banos_propiedad}</span>
                      </div>
                    )}
                    {propiedad.area_construida_propiedad > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-medium">{propiedad.area_construida_propiedad}m²</span>
                      </div>
                    )}
                  </div>

                  {/* Botón */}
                  <button className="mt-4 w-full btn-secondary-gradient">
                    Ver Detalles
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
