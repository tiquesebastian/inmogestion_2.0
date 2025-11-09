import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getImagenesByPropiedad, getFavoritos, addFavorito, removeFavorito } from '../services/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getClienteIdFromToken } from '../utils/jwt';

/**
 * Componente FilteredProperties
 * Muestra un listado de propiedades disponibles con filtros de búsqueda.
 * Permite filtrar por tipo, localidad y rango de precios.
 */
const FilteredProperties = () => {
  // Obtener parámetros de la URL
  const [searchParams] = useSearchParams();
  
  // Navegación programática para hacer la tarjeta completa clickeable
  const navigate = useNavigate();

  // Contexto de autenticación y toasts
  const { user } = useContext(AuthContext);
  const toast = useToast();
  
  // Estado para almacenar la lista de propiedades obtenidas del backend
  const [properties, setProperties] = useState([]);
  
  // Estado para las imágenes de las propiedades
  const [imagenes, setImagenes] = useState({});
  
  // Estado para favoritos del cliente actual
  const [favoritos, setFavoritos] = useState(new Set());
  
  // Estado para los filtros de búsqueda - inicializar con params de URL
  const [filters, setFilters] = useState({ 
    tipo: searchParams.get('tipo') || '', 
    localidad: searchParams.get('localidad') || '', 
    precioMin: searchParams.get('precioMin') || '', 
    precioMax: searchParams.get('precioMax') || '',
    habitaciones: searchParams.get('habitaciones') || '',
    banos: searchParams.get('banos') || ''
  });
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mensajes de error
  // Estado para mensajes de error
  const [error, setError] = useState('');

  /**
   * Función para obtener propiedades del backend
   * Construye la URL con los filtros activos y hace la petición API
   */
  const fetchProperties = async () => {
    setLoading(true);
    
    // Construir query string con los filtros activos
    let query = [];
    if (filters.tipo) query.push(`tipo=${filters.tipo}`);
    if (filters.localidad) query.push(`localidad=${filters.localidad}`);
    if (filters.precioMin) query.push(`precioMin=${filters.precioMin}`);
    if (filters.precioMax) query.push(`precioMax=${filters.precioMax}`);
    if (filters.habitaciones) query.push(`habitaciones=${filters.habitaciones}`);
    if (filters.banos) query.push(`banos=${filters.banos}`);
    
    const url = `/api/propiedades/filter${query.length ? '?' + query.join('&') : ''}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Error al obtener propiedades');
        setProperties([]);
      } else {
        setError('');
        const props = Array.isArray(data) ? data : [];
        setProperties(props);
        
        // Cargar imágenes para cada propiedad
        await loadImagenesForProperties(props);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las imágenes de todas las propiedades
   */
  const loadImagenesForProperties = async (props) => {
    const imagenesMap = {};
    
    await Promise.all(
      props.map(async (prop) => {
        try {
          const imgs = await getImagenesByPropiedad(prop.id_propiedad);
          // La API ahora retorna una lista de URLs normalizadas; toma la primera disponible
          if (imgs && imgs.length > 0) {
            imagenesMap[prop.id_propiedad] = imgs[0];
          }
        } catch (error) {
          console.warn(`Error al cargar imagen para propiedad ${prop.id_propiedad}:`, error);
        }
      })
    );
    
    setImagenes(imagenesMap);
  };

  // Ejecutar fetchProperties al montar el componente
  useEffect(() => {
    fetchProperties();
    loadFavoritos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Cargar favoritos del cliente actual
   */
  const loadFavoritos = async () => {
    if (!user || user.rol !== 'cliente') return;
    
    try {
      let clienteId = user.id_cliente || user.id || user.id_usuario;
      if (!clienteId && user.token) {
        clienteId = getClienteIdFromToken(user.token);
      }
      if (!clienteId) return;
      
      const favs = await getFavoritos(clienteId);
      const favIds = new Set(favs.map(f => f.id_propiedad || f));
      setFavoritos(favIds);
    } catch (e) {
      console.warn('Error cargando favoritos:', e);
    }
  };

  /**
   * Toggle favorito
   */
  const toggleFavorito = async (e, idPropiedad) => {
    e.stopPropagation(); // Evitar navegación de la tarjeta
    
    if (!user || user.rol !== 'cliente') {
      toast.info('Inicia sesión como cliente para guardar favoritos');
      return;
    }
    
    let clienteId = user.id_cliente || user.id || user.id_usuario;
    if (!clienteId && user.token) {
      clienteId = getClienteIdFromToken(user.token);
    }
    if (!clienteId) {
      toast.error('No se pudo identificar al cliente');
      return;
    }
    
    try {
      if (favoritos.has(idPropiedad)) {
        await removeFavorito({ id_propiedad: idPropiedad, id_cliente: clienteId });
        setFavoritos(prev => {
          const next = new Set(prev);
          next.delete(idPropiedad);
          return next;
        });
        toast.success('Eliminado de favoritos');
      } else {
        await addFavorito({ id_propiedad: idPropiedad, id_cliente: clienteId });
        setFavoritos(prev => new Set(prev).add(idPropiedad));
        toast.success('Agregado a favoritos');
      }
    } catch (e) {
      toast.error('Error al actualizar favoritos');
    }
  };

  /**
   * Maneja cambios en los campos del formulario de filtros
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /**
   * Maneja el envío del formulario de filtros
   * @param {Event} e - Evento del formulario
   */
  const handleFilter = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="flex items-center justify-between gap-3 mb-5 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Propiedades disponibles</h2>
      </div>

      {/* Filtros responsivos */}
      <form
        onSubmit={handleFilter}
        className="bg-white/70 backdrop-blur rounded-xl border shadow-sm p-4 md:p-6 mb-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Tipo</label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Lote">Lote</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Localidad</label>
            <input
              name="localidad"
              placeholder="Ej. Suba"
              value={filters.localidad}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Habitaciones</label>
            <input
              name="habitaciones"
              type="number"
              min="0"
              placeholder="Ej. 3"
              value={filters.habitaciones}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Baños</label>
            <input
              name="banos"
              type="number"
              min="0"
              placeholder="Ej. 2"
              value={filters.banos}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Precio mínimo</label>
            <input
              name="precioMin"
              type="number"
              min="0"
              placeholder="0"
              value={filters.precioMin}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Precio máximo</label>
            <input
              name="precioMax"
              type="number"
              min="0"
              placeholder=""
              value={filters.precioMax}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 bg-gray-100 focus:bg-white focus:ring-blue-600 focus:border-blue-600 text-sm md:text-base px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg py-2.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-3">{error}</p>
        )}
      </form>

      {/* Grid de tarjetas responsivo */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(properties) && properties.length === 0 && (
            <div className="col-span-full text-center text-gray-600 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-dashed border-blue-200 py-12 px-6">
              <svg className="w-20 h-20 mx-auto mb-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-lg font-medium">No hay propiedades que coincidan con tu búsqueda</p>
              <p className="text-sm mt-2">Intenta ajustar los filtros para obtener más resultados</p>
            </div>
          )}

          {Array.isArray(properties) && properties.map((prop) => {
            const precio = typeof prop.precio_propiedad === 'number'
              ? prop.precio_propiedad.toLocaleString('es-CO')
              : prop.precio_propiedad;
            const esFavorito = favoritos.has(prop.id_propiedad);
            
            return (
              <article
                key={prop.id_propiedad}
                className="relative bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => navigate(`/propiedades/${prop.id_propiedad}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/propiedades/${prop.id_propiedad}`);
                  }
                }}
                tabIndex={0}
                role="link"
              >
                {/* Botón de favorito (esquina superior derecha) */}
                {user && user.rol === 'cliente' && (
                  <button
                    onClick={(e) => toggleFavorito(e, prop.id_propiedad)}
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <svg className={`w-6 h-6 ${esFavorito ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={esFavorito ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
                
                {/* Imagen de la propiedad o placeholder */}
                {imagenes[prop.id_propiedad] ? (
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={imagenes[prop.id_propiedad]} 
                      alt={`${prop.tipo_propiedad} en ${prop.direccion_formato}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Si la imagen falla al cargar, mostrar placeholder
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 items-center justify-center">
                      <svg className="w-16 h-16 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    {/* Overlay CTA */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-end">
                      <div className="w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="inline-flex items-center gap-1 text-white text-sm font-semibold bg-blue-600/90 hover:bg-blue-700/90 rounded-md px-3 py-1 shadow">
                          Ver detalles
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-100 transition-all duration-300 relative">
                    <svg className="w-16 h-16 text-blue-300 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="inline-flex items-center gap-1 text-white text-sm font-semibold bg-blue-600/90 hover:bg-blue-700/90 rounded-md px-3 py-1 shadow">
                          Ver detalles
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {prop.tipo_propiedad}
                  </h3>

                  <ul className="text-sm text-gray-700 space-y-2 flex-1 mb-4">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">Dirección:</span> {prop.direccion_formato}</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">Precio:</span> ${precio}</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span><span className="font-semibold">Área:</span> {prop.area_m2} m²</span>
                    </li>
                    {prop.num_habitaciones && (
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span><span className="font-semibold">Habitaciones:</span> {prop.num_habitaciones}</span>
                      </li>
                    )}
                    {prop.num_banos && (
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        <span><span className="font-semibold">Baños:</span> {prop.num_banos}</span>
                      </li>
                    )}
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">Localidad:</span> {prop.nombre_localidad || prop.localidad}</span>
                    </li>
                  </ul>

                  <div className="mt-auto">
                    <Link
                      to={`/propiedades/${prop.id_propiedad}`}
                      className="inline-flex w-full justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver detalles
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FilteredProperties;
