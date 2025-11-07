import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * Componente PropertyDetail
 * Muestra los detalles completos de una propiedad específica
 * Obtiene el ID de la propiedad desde la URL
 */
const PropertyDetail = () => {
  // Obtener el ID de la propiedad desde los parámetros de la URL
  const { id } = useParams();
  
  // Estado para almacenar los datos de la propiedad
  const [property, setProperty] = useState(null);
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(true);

  // Obtener datos de la propiedad al montar el componente
  useEffect(() => {
    /**
     * Función para obtener los detalles de la propiedad del backend
     */
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // Endpoint en backend: /api/propiedades/:id
        const res = await fetch(`/api/propiedades/${id}`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setProperty(null);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]); // Re-ejecutar si cambia el ID

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Cargando propiedad...</p>
      </div>
    </div>
  );
  
  // Mostrar mensaje si no se encuentra la propiedad
  if (!property) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-700 font-semibold text-lg mb-2">Propiedad no encontrada</p>
        <p className="text-gray-600 mb-4">La propiedad que buscas no existe o fue eliminada</p>
        <Link to="/propiedades" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header con título y volver */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <Link 
          to="/propiedades" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Imagen destacada */}
        <div className="h-96 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 flex items-center justify-center">
          <svg className="w-32 h-32 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{property.tipo_propiedad}</h2>
          <p className="text-gray-600 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {property.direccion_formato}
          </p>

          {/* Precio destacado */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-1">Precio</p>
            <p className="text-4xl font-bold text-green-700">
              ${property.precio_propiedad?.toLocaleString() || property.precio_propiedad}
            </p>
          </div>

          {/* Grid de características */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Área</p>
                <p className="text-gray-700">{property.area_m2} m²</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Estado</p>
                <p className="text-gray-700">{property.estado_propiedad}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Ubicación</p>
                <p className="text-gray-700">{property.nombre_localidad || property.localidad}</p>
                <p className="text-sm text-gray-600">{property.nombre_barrio || property.barrio}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Agente</p>
                <p className="text-gray-700">{property.agente || property.nombre_agente}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{property.descripcion}</p>
          </div>

          {/* Botón de contacto */}
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-8 py-3 text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Agente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
