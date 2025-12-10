import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroConSlider from "../components/HeroConSlider";

export default function Inicio() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    localidad: '',
    tipo: '',
    precioMax: '',
    habitaciones: '',
    banos: ''
  });

  const [propiedadesDestacadas, setPropiedadesDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar propiedades destacadas al montar el componente
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/propiedades?limit=8');
        const data = await response.json();
        // Filtrar solo propiedades disponibles
        const disponibles = data.filter(p => p.estado_propiedad === 'Disponible');
        setPropiedadesDestacadas(disponibles.slice(0, 8)); // Mostrar máximo 8 propiedades
        setLoading(false);
      } catch (error) {
        console.error('Error cargando propiedades:', error);
        setLoading(false);
      }
    };

    fetchPropiedades();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construir query string con los filtros
    const params = new URLSearchParams();
    if (searchFilters.localidad) params.append('localidad', searchFilters.localidad);
    if (searchFilters.tipo) params.append('tipo', searchFilters.tipo);
    if (searchFilters.precioMax) params.append('precioMax', searchFilters.precioMax);
    if (searchFilters.habitaciones) params.append('habitaciones', searchFilters.habitaciones);
    if (searchFilters.banos) params.append('banos', searchFilters.banos);
    
    // Redirigir a propiedades con los filtros
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <HeroConSlider />

      {/* Búsqueda rápida centrada (contenedor más estrecho y fijo) */}
      <div className="w-full px-4 sm:px-8 -mt-20 relative z-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="glass-panel p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">🔍 Encuentra tu Propiedad Ideal</h3>
            <p className="text-gray-600 text-sm sm:text-lg">Busca entre nuestras propiedades disponibles</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Fila 1: Localidad, Tipo, Habitaciones, Baños */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Localidad */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  📍 Zona o Localidad
                </label>
                <input
                  type="text"
                  name="localidad"
                  value={searchFilters.localidad}
                  onChange={handleInputChange}
                  placeholder="Ej: Suba, Chapinero..."
                  className="w-full filter-input rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  🏠 Tipo de Propiedad
                </label>
                <select 
                  name="tipo"
                  value={searchFilters.tipo}
                  onChange={handleInputChange}
                  className="w-full filter-input rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Lote">Lote</option>
                </select>
              </div>

              {/* Habitaciones */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  🛏️ Habitaciones
                </label>
                <input
                  type="number"
                  name="habitaciones"
                  value={searchFilters.habitaciones}
                  onChange={handleInputChange}
                  placeholder="Ej: 3"
                  min="0"
                  className="w-full filter-input rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                />
              </div>

              {/* Baños */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  🚿 Baños
                </label>
                <input
                  type="number"
                  name="banos"
                  value={searchFilters.banos}
                  onChange={handleInputChange}
                  placeholder="Ej: 2"
                  min="0"
                  className="w-full filter-input rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Fila 2: Precio y Botón de búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Precio máximo */}
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  💰 Precio Máximo (COP)
                </label>
                <input
                  type="number"
                  name="precioMax"
                  value={searchFilters.precioMax}
                  onChange={handleInputChange}
                  placeholder="Ej: 500000000"
                  min="0"
                  className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              {/* Botón de búsqueda */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base sm:text-lg font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Propiedades Destacadas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Propiedades Destacadas
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Explora nuestras mejores opciones para ti
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando propiedades...</p>
          </div>
        ) : propiedadesDestacadas.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-lg">No hay propiedades disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4 sm:px-8">
            {propiedadesDestacadas.map((propiedad) => (
              <Link
                key={propiedad.id_propiedad}
                to={`/propiedades/${propiedad.id_propiedad}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Imagen */}
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  {propiedad.imagen_principal ? (
                    <img
                      src={`http://localhost:4000${propiedad.imagen_principal}`}
                      alt={propiedad.titulo_propiedad || propiedad.tipo_propiedad}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <svg className="w-24 h-24 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Título tipo de propiedad */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {propiedad.tipo_propiedad}
                  </h3>

                  {/* Lista de detalles */}
                  <div className="space-y-2 text-sm">
                    {/* Dirección */}
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="font-semibold text-gray-700">Dirección:</span>
                        <span className="text-gray-600 ml-1">{propiedad.direccion_formato}</span>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="font-semibold text-gray-700">Precio:</span>
                        <span className="text-orange-600 font-extrabold ml-1">${parseInt(propiedad.precio_propiedad).toLocaleString('es-CO')}</span>
                      </div>
                    </div>

                    {/* Área */}
                    {propiedad.area_construida_propiedad > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-700">Área:</span>
                          <span className="text-gray-600 ml-1">{propiedad.area_construida_propiedad} m²</span>
                        </div>
                      </div>
                    )}

                    {/* Habitaciones */}
                    {propiedad.habitaciones_propiedad > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-700">Habitaciones:</span>
                          <span className="text-gray-600 ml-1">{propiedad.habitaciones_propiedad}</span>
                        </div>
                      </div>
                    )}

                    {/* Baños */}
                    {propiedad.banos_propiedad > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-700">Baños:</span>
                          <span className="text-gray-600 ml-1">{propiedad.banos_propiedad}</span>
                        </div>
                      </div>
                    )}

                    {/* Localidad */}
                    {propiedad.nombre_localidad && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <span className="font-semibold text-gray-700">Localidad:</span>
                          <span className="text-gray-600 ml-1">{propiedad.nombre_localidad}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Ver más propiedades */}
        {propiedadesDestacadas.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/propiedades"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Ver Todas las Propiedades
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Sección de Beneficios ancho completo */}
      <div className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-20 mt-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
              Somos tu mejor opción en el mercado inmobiliario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="bg-white/15 group-hover:bg-white/25 transition w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/20 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wide">Propiedades Verificadas</h3>
              <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                Todas nuestras propiedades pasan por un riguroso proceso de verificación
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/15 group-hover:bg-white/25 transition w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/20 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wide">Atención 24/7</h3>
              <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                Nuestro equipo está disponible para ayudarte en todo momento
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-white/15 group-hover:bg-white/25 transition w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-900/20 backdrop-blur-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-wide">Proceso Rápido</h3>
              <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                Simplificamos el proceso para que encuentres tu hogar ideal rápidamente
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
