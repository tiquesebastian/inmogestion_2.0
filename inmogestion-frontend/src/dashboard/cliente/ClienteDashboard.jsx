import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getFavoritos, getImagenesByPropiedad, removeFavorito, getVisitas, getInteracciones, cancelVisit, getPropertyById, updateVisit, getContratosByCliente, getUrlDescargarContrato } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { getClienteIdFromToken, getUserFromToken } from "../../utils/jwt";

/**
 * Dashboard del Cliente
 * Panel donde el cliente puede ver sus visitas agendadas,
 * propiedades de interés e interacciones y sus favoritos
 */
export default function ClienteDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [visitas, setVisitas] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  // Información de qué módulos están en modo fallback (favoritos removido para evitar banner constante)
  const [fallbackInfo, setFallbackInfo] = useState({ visitas: false, intereses: false });
  const [propInfo, setPropInfo] = useState({}); // id_propiedad -> { titulo, direccion }
  const [showReprogModal, setShowReprogModal] = useState(false);
  const [reprogData, setReprogData] = useState({ id_visita: null, fecha: '', hora: '', notas: '' });

  useEffect(() => {
    if (!user || user.rol !== "cliente") {
      navigate("/login");
      return;
    }

    // Decodificar token para obtener datos completos del usuario
    if (user.token) {
      const decoded = getUserFromToken(user.token);
      setUserData(decoded);
    }

    cargarDatos();
  }, [user, navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const token = user.token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      // Decodificar token para obtener datos del usuario
      const tokenData = getUserFromToken(token);

      // Determinar id_cliente: primero del objeto user, luego del token
      let clienteId = user.id_cliente || user.id || user.id_usuario;
      
      if (!clienteId && token) {
        clienteId = getClienteIdFromToken(token);
      }

      if (!clienteId) {
        setError("No se pudo identificar al cliente en la sesión. Por favor, cierra sesión e inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      // Cargar visitas (servicio con fallback)
      const visitasRes = await getVisitas(clienteId);
      setVisitas(visitasRes.data);
      // Enriquecer con info de propiedad (cargar una sola vez por id)
      const idsProps = Array.from(new Set((visitasRes.data || []).map(v => v.id_propiedad).filter(Boolean)));
      const nuevos = {};
      await Promise.all(idsProps.map(async (pid) => {
        try {
          const p = await getPropertyById(pid);
          nuevos[pid] = {
            titulo: p?.tipo_propiedad || p?.tipo || `Propiedad #${pid}`,
            direccion: p?.direccion_formato || p?.direccion || ''
          };
        } catch (_) {
          nuevos[pid] = { titulo: `Propiedad #${pid}`, direccion: '' };
        }
      }));
      setPropInfo(prev => ({ ...prev, ...nuevos }));

      // Cargar interacciones/intereses (servicio con fallback)
      const interesesRes = await getInteracciones(clienteId);
      setIntereses(interesesRes.data);

      // Favoritos (API o fallback local)
      const favs = await getFavoritos(clienteId);
      // En caso de que solo vengan ids, normalizar y traer mini imágenes
      const favDetails = [];
      for (const fav of favs) {
        const idProp = fav.id_propiedad || fav;
        let img = null;
        try {
          const imgs = await getImagenesByPropiedad(idProp);
          img = imgs[0] || null;
        } catch (_) {}
        favDetails.push({ id_propiedad: idProp, imagen: img });
      }
      setFavoritos(favDetails);

      // Cargar contratos del cliente
      const contratosData = await getContratosByCliente(clienteId);
      setContratos(contratosData || []);

      // Marcar fallbacks usados
      setFallbackInfo(prev => ({
        visitas: prev.visitas || visitasRes._fallback,
        intereses: prev.intereses || interesesRes._fallback
      }));

    } catch (err) {
      setError("Error al cargar los datos");
      console.error(err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quitarFavorito = async (idProp) => {
    try {
      let clienteId = user.id_cliente || user.id || user.id_usuario;
      
      // Si no está en user, obtener del token
      if (!clienteId && user.token) {
        clienteId = getClienteIdFromToken(user.token);
      }
      
      if (!clienteId) return;
      
      await removeFavorito({ id_propiedad: idProp, id_cliente: clienteId });
      setFavoritos(prev => prev.filter(f => f.id_propiedad !== idProp));
      toast.success('Propiedad eliminada de favoritos');
    } catch (e) {
      toast.error('No se pudo eliminar de favoritos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Panel de Cliente</h1>
            <p className="text-blue-200 mt-1 text-sm sm:text-base">
              Bienvenido, {userData?.nombre_cliente || userData?.nombre || 'Usuario'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/propiedades"
              className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition shadow-sm text-center text-sm sm:text-base"
            >
              Explorar propiedades
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 rounded font-semibold transition text-sm sm:text-base"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

  {(fallbackInfo.visitas || fallbackInfo.intereses) && !error && (
          <div className="mb-6 p-4 rounded border bg-amber-50 border-amber-300 text-amber-800 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
            </svg>
            <div>
              <p className="font-semibold mb-1">Información parcial</p>
              <p className="leading-snug">Algunos módulos todavía no están implementados en el backend:
                {fallbackInfo.visitas && ' Visitas'}
                {fallbackInfo.intereses && ' Intereses'}.
                Los datos aparecerán automáticamente cuando los endpoints estén disponibles.
              </p>
            </div>
          </div>
        )}

        {/* Información del Cliente */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Mi Información</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold">Nombre:</span> {userData?.nombre_cliente || userData?.nombre || 'N/D'}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold">Correo:</span> {userData?.correo_cliente || userData?.correo || 'N/D'}
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold">ID Cliente:</span> {userData?.id_cliente || userData?.id || 'N/D'}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <span className="font-semibold">Usuario:</span> {userData?.nombre_usuario || userData?.usuario || 'N/D'}
              </p>
            </div>
          </div>
        </div>

        {/* Visitas Agendadas */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Mis Visitas Agendadas</h2>
          {visitas.length === 0 ? (
            <div className="text-gray-600">
              <p>No tienes visitas agendadas.</p>
              <Link to="/propiedades" className="inline-block mt-3 text-blue-600 hover:underline font-medium">Explorar propiedades</Link>
            </div>
          ) : (
            <>
              {/* Tabla para desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">Hora</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">Propiedad</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">Estado</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitas.map((visita) => (
                      <tr key={visita.id_visita} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {new Date(visita.fecha_visita).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">{visita.hora_visita}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <Link to={`/propiedades/${visita.id_propiedad}`} className="text-blue-700 hover:underline font-medium">
                              {propInfo[visita.id_propiedad]?.titulo || `Propiedad #${visita.id_propiedad}`}
                            </Link>
                            {propInfo[visita.id_propiedad]?.direccion && (
                              <span className="text-xs text-gray-500">{propInfo[visita.id_propiedad].direccion}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              visita.estado_visita === "Programada"
                                ? "bg-blue-100 text-blue-800"
                                : visita.estado_visita === "Completada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {visita.estado_visita}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {visita.estado_visita === 'Programada' && (
                            <div className="flex gap-3">
                              <button
                                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                onClick={() => {
                                  setReprogData({ id_visita: visita.id_visita, fecha: visita.fecha_visita?.slice(0,10), hora: visita.hora_visita || '', notas: visita.notas || '' });
                                  setShowReprogModal(true);
                                }}
                              >
                                Reprogramar
                              </button>
                              <button
                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                                onClick={async () => {
                                  try {
                                    let clienteId = user.id_cliente || user.id || user.id_usuario;
                                  if (!clienteId && user.token) clienteId = getClienteIdFromToken(user.token);
                                  await cancelVisit(visita.id_visita, clienteId);
                                  setVisitas(prev => prev.map(v => v.id_visita === visita.id_visita ? { ...v, estado_visita: 'Cancelada' } : v));
                                  toast.success('Visita cancelada');
                                } catch (_) {
                                  toast.error('No se pudo cancelar la visita');
                                }
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Tarjetas para móvil */}
            <div className="md:hidden space-y-4">
              {visitas.map((visita) => (
                <div key={visita.id_visita} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/propiedades/${visita.id_propiedad}`} className="text-blue-700 hover:underline font-medium flex-1">
                      {propInfo[visita.id_propiedad]?.titulo || `Propiedad #${visita.id_propiedad}`}
                    </Link>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ml-2 ${
                        visita.estado_visita === "Programada"
                          ? "bg-blue-100 text-blue-800"
                          : visita.estado_visita === "Completada"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {visita.estado_visita}
                    </span>
                  </div>
                  {propInfo[visita.id_propiedad]?.direccion && (
                    <p className="text-xs text-gray-500 mb-2">{propInfo[visita.id_propiedad].direccion}</p>
                  )}
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <p><span className="font-semibold">Fecha:</span> {new Date(visita.fecha_visita).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Hora:</span> {visita.hora_visita}</p>
                  </div>
                  {visita.estado_visita === 'Programada' && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm font-medium"
                        onClick={() => {
                          setReprogData({ id_visita: visita.id_visita, fecha: visita.fecha_visita?.slice(0,10), hora: visita.hora_visita || '', notas: visita.notas || '' });
                          setShowReprogModal(true);
                        }}
                      >
                        Reprogramar
                      </button>
                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium"
                        onClick={async () => {
                          try {
                            let clienteId = user.id_cliente || user.id || user.id_usuario;
                            if (!clienteId && user.token) clienteId = getClienteIdFromToken(user.token);
                            await cancelVisit(visita.id_visita, clienteId);
                            setVisitas(prev => prev.map(v => v.id_visita === visita.id_visita ? { ...v, estado_visita: 'Cancelada' } : v));
                            toast.success('Visita cancelada');
                          } catch (_) {
                            toast.error('No se pudo cancelar la visita');
                          }
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </>
          )}
        </div>

        {/* Propiedades de Interés */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Propiedades de Interés</h2>
          {intereses.length === 0 ? (
            <div className="text-gray-600 text-sm sm:text-base">
              <p>No has registrado interés en ninguna propiedad.</p>
              <Link to="/propiedades" className="inline-block mt-3 text-blue-600 hover:underline font-medium">Ir a ver propiedades</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {intereses.map((interes) => (
                <div key={interes.id_interaccion} className="border rounded-lg p-4 hover:shadow-md transition">
                  <p className="font-semibold text-gray-800">
                    Propiedad #{interes.id_propiedad}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Tipo: {interes.tipo_interaccion}
                  </p>
                  <p className="text-sm text-gray-600">
                    Fecha: {new Date(interes.fecha_interaccion).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favoritos */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Mis Favoritos</h2>
          {favoritos.length === 0 ? (
            <div className="text-gray-600 text-sm sm:text-base">
              <p>Aún no has guardado propiedades como favoritas.</p>
              <Link to="/propiedades" className="inline-block mt-3 text-blue-600 hover:underline font-medium">Buscar propiedades</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {favoritos.map(f => (
                <div key={f.id_propiedad} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  {f.imagen ? (
                    <img src={f.imagen} alt={"Propiedad " + f.id_propiedad} className="h-32 w-full object-cover" />
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 mb-2">Propiedad #{f.id_propiedad}</p>
                    <div className="flex gap-2">
                      <a href={`/propiedades/${f.id_propiedad}`} className="text-blue-600 text-sm hover:underline flex-1">Ver detalles</a>
                      <button
                        onClick={() => quitarFavorito(f.id_propiedad)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        aria-label="Eliminar favorito"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis Contratos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Mis Contratos</h2>
          {contratos.length === 0 ? (
            <div className="text-gray-600">
              <p>No tienes contratos generados aún.</p>
              <p className="text-sm mt-2">Cuando un contrato sea generado a tu nombre, aparecerá aquí para que puedas descargarlo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contratos.map((contrato) => (
                <div
                  key={contrato.id_contrato_documento}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {contrato.tipo_inmueble === 'Casa' ? '🏠' :
                           contrato.tipo_inmueble === 'Apartamento' ? '🏢' : '📍'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800">
                          Contrato de {contrato.tipo_inmueble}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <p><strong>Propiedad:</strong> {contrato.inmueble_direccion}</p>
                          <p><strong>Precio:</strong> ${new Intl.NumberFormat('es-CO').format(contrato.precio_venta)}</p>
                        </div>
                        <div>
                          <p><strong>Fecha de firma:</strong> {new Date(contrato.fecha_firma).toLocaleDateString('es-CO')}</p>
                          <p><strong>Generado:</strong> {new Date(contrato.fecha_generacion).toLocaleDateString('es-CO')}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          contrato.estado_documento === 'Generado' ? 'bg-blue-100 text-blue-800' :
                          contrato.estado_documento === 'Firmado' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contrato.estado_documento}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {contrato.archivo_pdf ? (
                        <a
                          href={getUrlDescargarContrato(contrato.id_contrato_documento)}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Descargar
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 italic">PDF no disponible</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {showReprogModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowReprogModal(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Cerrar"
            >✕</button>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">Reprogramar visita</h3>
              <p className="text-sm text-gray-600 mb-4">Ajusta la fecha y hora de tu visita programada.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!reprogData.fecha || !reprogData.hora) { toast.error('Completa fecha y hora'); return; }
                try {
                  let clienteId = user.id_cliente || user.id || user.id_usuario;
                  if (!clienteId && user.token) clienteId = getClienteIdFromToken(user.token);
                  await updateVisit({ id_visita: reprogData.id_visita, id_cliente: clienteId, fecha_visita: reprogData.fecha, hora_visita: reprogData.hora, notas: reprogData.notas });
                  setVisitas(prev => prev.map(v => v.id_visita === reprogData.id_visita ? { ...v, fecha_visita: reprogData.fecha, hora_visita: reprogData.hora } : v));
                  toast.success('Visita reprogramada');
                  setShowReprogModal(false);
                } catch (_) {
                  toast.error('No se pudo reprogramar');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                  <input type="date" value={reprogData.fecha} onChange={(e)=>setReprogData(d=>({...d,fecha:e.target.value}))} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                  <input type="time" value={reprogData.hora} onChange={(e)=>setReprogData(d=>({...d,hora:e.target.value}))} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notas (opcional)</label>
                  <textarea value={reprogData.notas} onChange={(e)=>setReprogData(d=>({...d,notas:e.target.value}))} rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={()=>setShowReprogModal(false)} className="flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50 font-medium">Cancelar</button>
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
