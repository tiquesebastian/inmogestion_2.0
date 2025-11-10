import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getImagenesRawByPropiedad, registrarInteres, addFavorito, removeFavorito, getFavoritos } from '../services/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getClienteIdFromToken } from '../utils/jwt';
import ClientRegistration from './ClientRegistration';

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
  const [imagenes, setImagenes] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const { user } = useContext(AuthContext) || {};
  const toast = useToast();
  
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
        // cargar imágenes raw
        try {
          const imgs = await getImagenesRawByPropiedad(id);
          // ordenar por prioridad desc y luego id
          imgs.sort((a,b) => (b.prioridad||0) - (a.prioridad||0));
          setImagenes(imgs);
          setActiveIndex(0);
        } catch(_) { setImagenes([]); }
      } catch (err) {
        setProperty(null);
      }
      setLoading(false);
    };
    fetchProperty();
    // Cargar estado de favorito
    (async () => {
      try {
        let fav = false;
        if (user && (user.rol === 'cliente' || user.rol === 'Cliente')) {
          let clienteId = user.id_cliente || user.id || user.id_usuario;
          
          // Si no está en user, obtener del token
          if (!clienteId && user.token) {
            clienteId = getClienteIdFromToken(user.token);
          }
          
          if (clienteId) {
            const favs = await getFavoritos(clienteId);
            fav = Array.isArray(favs) && favs.some(f => (f.id_propiedad || f) == id);
          }
        } else {
          const guest = JSON.parse(localStorage.getItem('fav_guest') || '[]');
          fav = guest.includes(Number(id)) || guest.includes(id);
        }
        setIsFav(fav);
      } catch (_) {}
    })();
  }, [id]); // Re-ejecutar si cambia el ID

  const toggleFavorito = async () => {
    try {
      if (!user || (user.rol !== 'cliente' && user.rol !== 'Cliente')) {
        // Guardar en localStorage para invitados
        const key = 'fav_guest';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const numericId = Number(id);
        const exists = list.includes(numericId);
        const next = exists ? list.filter(v => v !== numericId) : [...list, numericId];
        localStorage.setItem(key, JSON.stringify(next));
        setIsFav(!exists);
        toast.success(exists ? 'Quitado de favoritos' : 'Guardado en favoritos');
        return;
      }
      
      let clienteId = user.id_cliente || user.id || user.id_usuario;
      
      // Si no está en user, obtener del token
      if (!clienteId && user.token) {
        clienteId = getClienteIdFromToken(user.token);
      }
      
      if (!clienteId) return;
      
      if (isFav) {
        await removeFavorito({ id_propiedad: Number(id), id_cliente: clienteId });
        setIsFav(false);
        toast.success('Quitado de favoritos');
      } else {
        await addFavorito({ id_propiedad: Number(id), id_cliente: clienteId });
        setIsFav(true);
        toast.success('Guardado en favoritos');
      }
    } catch (e) {
      toast.error('No se pudo actualizar favoritos');
    }
  };

  const handleInteres = async () => {
    // Si no está logueado como cliente, abrir modal de registro
    if (!user || (user.rol !== 'cliente' && user.rol !== 'Cliente')) {
      setShowRegModal(true);
      return;
    }
    try {
      setBusy(true);
      let clienteId = user.id_cliente || user.id || user.id_usuario;
      
      // Si no está en user, obtener del token
      if (!clienteId && user.token) {
        clienteId = getClienteIdFromToken(user.token);
      }
      
      if (!clienteId) throw new Error('Cliente no identificado');
      await registrarInteres({ id_propiedad: Number(id), id_cliente: clienteId });
      toast.success('¡Interés registrado! Pronto un agente te contactará.');
    } catch (e) {
      toast.error('No se pudo registrar el interés');
    } finally {
      setBusy(false);
    }
  };

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
        {/* Imagen destacada / Carrusel simple */}
        <div className="relative h-96 bg-black flex items-center justify-center overflow-hidden">
          {imagenes.length > 0 ? (
            <>
              <img
                src={imagenes[activeIndex].url}
                alt={imagenes[activeIndex].descripcion || 'Imagen propiedad'}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {imagenes[activeIndex].prioridad > 0 && (
                <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">Principal</span>
              )}
              {activeIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex(i => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
                  aria-label="Anterior"
                >
                  ‹
                </button>
              )}
              {activeIndex < imagenes.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex(i => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
                  aria-label="Siguiente"
                >
                  ›
                </button>
              )}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {imagenes.map((img, idx) => (
                  <button
                    key={img.id_imagen || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`w-3 h-3 rounded-full transition ${idx === activeIndex ? 'bg-white shadow-lg scale-110' : 'bg-white/40 hover:bg-white/70'}`}
                    aria-label={`Ir a imagen ${idx+1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 flex items-center justify-center">
              <svg className="w-32 h-32 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          )}
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

          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Galería</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagenes.map((img, idx) => (
                  <button
                    key={img.id_imagen || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`group relative rounded-lg overflow-hidden border ${idx === activeIndex ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <img src={img.url} alt={img.descripcion || 'thumb'} className="w-full h-28 object-cover" />
                    {img.prioridad > 0 && (
                      <span className="absolute top-1 left-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">Principal</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{property.descripcion}</p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleInteres}
              disabled={busy}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg px-6 py-3 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Me interesa
            </button>
            
            <button
              onClick={toggleFavorito}
              className={`inline-flex items-center gap-2 border font-semibold rounded-lg px-6 py-3 text-base transition ${isFav ? 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700' : 'bg-white text-pink-600 border-pink-500 hover:bg-pink-50'}`}
            >
              <svg className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" fill={isFav ? 'currentColor' : 'none'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
              {isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de registro para interesados no logueados */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg relative shadow-2xl">
            <button
              aria-label="Cerrar"
              onClick={() => setShowRegModal(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-3">Regístrate para continuar</h3>
              <p className="text-sm text-gray-600 mb-4">Crea tu cuenta para registrar tu interés y recibir contacto de un agente.</p>
              <ClientRegistration onSuccess={() => {
                toast.success('¡Registro exitoso! Ahora inicia sesión para continuar.');
                setShowRegModal(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
