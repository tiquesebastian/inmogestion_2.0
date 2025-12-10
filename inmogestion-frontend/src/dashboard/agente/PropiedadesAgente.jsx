import React, { useContext, useEffect, useState } from 'react';
import { getAgentProperties, createVisit, getClientes, getAllVisitas, reagendarVisita } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function PropiedadesAgente() {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [visit, setVisit] = useState({ id_propiedad: null, id_cliente: '', fecha: '', hora: '', notas: '' });
  const [filters, setFilters] = useState({ tipo: '', localidad: '', estado: '' });
  
  // Estados para gestión de visitas
  const [visitas, setVisitas] = useState([]);
  const [loadingVisitas, setLoadingVisitas] = useState(false);
  const [visitaReagendar, setVisitaReagendar] = useState(null);
  const [modalReagendar, setModalReagendar] = useState(false);
  const [activeTab, setActiveTab] = useState('propiedades'); // 'propiedades' | 'visitas'

  const loadPropiedades = async () => {
    setLoading(true); 
    setError('');
    try {
      const propiedades = await getAgentProperties(user?.id);
      console.log('📊 Propiedades cargadas:', propiedades);
      if (propiedades.length > 0) console.log('🖼️ Primera propiedad:', propiedades[0]);
      // Aplicar filtros locales
      let filtradas = propiedades;
      if (filters.tipo) {
        filtradas = filtradas.filter(p => (p.tipo_propiedad || p.tipo || '').toLowerCase().includes(filters.tipo.toLowerCase()));
      }
      if (filters.localidad) {
        filtradas = filtradas.filter(p => (p.nombre_localidad || p.localidad || '').toLowerCase().includes(filters.localidad.toLowerCase()));
      }
      if (filters.estado) {
        filtradas = filtradas.filter(p => (p.estado_propiedad || p.estado) === filters.estado);
      }
      setRows(filtradas);
    } catch (e) {
      setError(e.message || 'Error cargando propiedades');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes solo una vez al montar
  useEffect(() => {
    (async () => {
      try {
        const clientesData = await getClientes();
        setClientes(clientesData);
      } catch (e) {
        console.error('Error cargando clientes:', e);
      }
    })();
  }, []);

  // Cargar propiedades solo una vez al montar o cuando cambia el user.id
  useEffect(() => {
    if (user?.id) {
      loadPropiedades();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const openVisit = (id_propiedad) => {
    setVisit({ id_propiedad, id_cliente: '', fecha: '', hora: '', notas: '' });
    setError('');
  };

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  
  const onFilter = (e) => { 
    e.preventDefault(); 
    loadPropiedades();
  };
  
  const limpiarFiltros = () => {
    setFilters({ tipo: '', localidad: '', estado: '' });
    loadPropiedades();
  };

  const submitVisit = async (e) => {
    e.preventDefault();
    if (!visit.id_cliente || !visit.fecha || !visit.hora) {
      toast.error('Completa ID cliente, fecha y hora');
      return;
    }
    try {
      const id_agente = user?.id_usuario || user?.id || null;
      await createVisit({
        id_propiedad: visit.id_propiedad,
        id_cliente: Number(visit.id_cliente),
        id_agente,
        fecha_visita: visit.fecha,
        hora_visita: visit.hora,
        notas: visit.notas,
      });
      toast.success('Visita agendada para el cliente');
      setVisit({ id_propiedad: null, id_cliente: '', fecha: '', hora: '', notas: '' });
    } catch (e) {
      toast.error('No se pudo agendar la visita');
    }
  };

  // Cargar visitas
  const loadVisitas = async () => {
    setLoadingVisitas(true);
    try {
      const visitasData = await getAllVisitas();
      const visitasList = visitasData._fallback ? visitasData.data : visitasData.data || [];
      setVisitas(visitasList);
    } catch (e) {
      console.error('Error cargando visitas:', e);
    } finally {
      setLoadingVisitas(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'visitas') {
      loadVisitas();
    }
  }, [activeTab]);

  const abrirReagendar = (visita) => {
    setVisitaReagendar({
      ...visita,
      fecha_visita: visita.fecha_visita || '',
      hora_visita: visita.hora_visita || ''
    });
    setModalReagendar(true);
  };

  const submitReagendar = async (e) => {
    e.preventDefault();
    if (!visitaReagendar) return;
    
    try {
      await reagendarVisita({
        id_visita: visitaReagendar.id_visita,
        id_cliente: visitaReagendar.id_cliente,
        fecha_visita: visitaReagendar.fecha_visita,
        hora_visita: visitaReagendar.hora_visita,
        notas: visitaReagendar.notas || ''
      });
      
      setVisitas(prev => prev.map(v => 
        v.id_visita === visitaReagendar.id_visita 
          ? { ...v, fecha_visita: visitaReagendar.fecha_visita, hora_visita: visitaReagendar.hora_visita }
          : v
      ));
      
      toast.success('Visita reagendada correctamente');
      setModalReagendar(false);
      setVisitaReagendar(null);
    } catch (e) {
      toast.error('Error al reagendar: ' + e.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mis Propiedades y Visitas</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('propiedades')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'propiedades'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          🏠 Propiedades
        </button>
        <button
          onClick={() => setActiveTab('visitas')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'visitas'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          📅 Visitas
        </button>
      </div>

      {activeTab === 'propiedades' && (
      <>
      {/* Formulario de filtros */}
      <form onSubmit={onFilter} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input 
            name="tipo" 
            value={filters.tipo} 
            onChange={onChange} 
            placeholder="Tipo (Casa, Apartamento...)" 
            className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base" 
          />
          <input 
            name="localidad" 
            value={filters.localidad} 
            onChange={onChange} 
            placeholder="Localidad" 
            className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base" 
          />
          <select 
            name="estado" 
            value={filters.estado} 
            onChange={onChange} 
            className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
          >
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Reservada">Reservada</option>
            <option value="Vendida">Vendida</option>
          </select>
          <div className="flex gap-2">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 sm:px-6 py-2.5 transition shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              🔍 Filtrar
            </button>
          </div>
        </div>
        {(filters.tipo || filters.localidad || filters.estado) && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={limpiarFiltros}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg px-4 sm:px-6 py-2 transition shadow-md text-sm sm:text-base"
            >
              ↻ Ver todas las propiedades
            </button>
          </div>
        )}
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-gray-600">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {rows.map((p, i) => {
              // Construir URL de imagen
              let imagenUrl = '/images/default-property.svg';
              if (p.imagenes && p.imagenes.length > 0 && p.imagenes[0].url_imagen) {
                imagenUrl = p.imagenes[0].url_imagen;
              } else if (p.imagen_principal) {
                imagenUrl = p.imagen_principal;
              
                            console.log(`Propiedad ${p.id_propiedad}: imagen = ${imagenUrl}`);
              }
              
              return (
                <article key={p.id_propiedad || p.id || i} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition bg-white">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={imagenUrl} 
                      alt={p.titulo || p.tipo_propiedad || 'Propiedad'}
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.onerror = null;
                        e.target.src = '/images/default-property.svg'; 
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-blue-900 text-lg">{p.titulo || p.tipo_propiedad || 'Propiedad'}</h3>
                    <p className="text-sm text-gray-700 mt-1">{p.direccion_formato || p.direccion || 'Dirección'}</p>
                    <p className="text-sm text-gray-600">{p.nombre_localidad || p.localidad}</p>
                    <p className="font-bold text-green-700 mt-2 text-xl">${(p.precio_propiedad || 0).toLocaleString('es-CO')}</p>
                    <div className="mt-3 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.estado_propiedad === 'Disponible' ? 'bg-green-100 text-green-700' :
                        p.estado_propiedad === 'Reservada' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {p.estado_propiedad || 'Disponible'}
                      </span>
                    </div>
                    <button 
                      onClick={() => openVisit(p.id_propiedad || p.id || i)} 
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 font-semibold transition"
                    >
                      📅 Agendar visita
                    </button>
                  </div>
                </article>
              );
            })}
            {rows.length === 0 && <div className="text-gray-600 col-span-2 text-center py-8">No tienes propiedades asignadas</div>}
          </div>
        )}

        {/* Modal visita */}
        {visit.id_propiedad && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <form onSubmit={submitVisit} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
              <button type="button" onClick={()=>setVisit({ id_propiedad:null, id_cliente:'', fecha:'', hora:'', notas:''})} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
              
              <h4 className="text-xl font-bold mb-1">Agendar visita</h4>
              <p className="text-sm text-gray-600 mb-4">Programa una visita para un cliente en esta propiedad</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                  <select 
                    required 
                    value={visit.id_cliente} 
                    onChange={(e)=>setVisit({...visit, id_cliente:e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Selecciona un cliente --</option>
                    {clientes.map(c => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre_cliente || c.nombre} ({c.correo_cliente || c.correo || `ID: ${c.id_cliente}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required 
                    value={visit.fecha} 
                    onChange={(e)=>setVisit({...visit, fecha:e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                  <input 
                    type="time" 
                    required 
                    value={visit.hora} 
                    onChange={(e)=>setVisit({...visit, hora:e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notas (opcional)</label>
                  <textarea 
                    value={visit.notas} 
                    onChange={(e)=>setVisit({...visit, notas:e.target.value})} 
                    rows={3}
                    placeholder="Detalles adicionales de la visita..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={()=>setVisit({ id_propiedad:null, id_cliente:'', fecha:'', hora:'', notas:''})} 
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-md hover:shadow-lg"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      </>
      )}

      {/* Tab de Visitas */}
      {activeTab === 'visitas' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Visitas Programadas</h3>
            <button
              onClick={loadVisitas}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              🔄 Recargar
            </button>
          </div>

          {loadingVisitas ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Cargando visitas...</p>
            </div>
          ) : visitas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No hay visitas programadas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Cliente (ID)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Propiedad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Hora</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visitas.map((v, idx) => {
                    const cliente = clientes.find(c => c.id_cliente === v.id_cliente);
                    return (
                      <tr key={v.id_visita} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-700">{v.id_visita}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {cliente ? `${cliente.nombre_cliente || cliente.nombre}` : `Cliente`} ({v.id_cliente})
                        </td>
                        <td className="px-4 py-3 text-gray-700">Propiedad #{v.id_propiedad}</td>
                        <td className="px-4 py-3 text-gray-700">{v.fecha_visita || 'Sin fecha'}</td>
                        <td className="px-4 py-3 text-gray-700">{v.hora_visita || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            v.estado_visita === 'Programada' ? 'bg-blue-100 text-blue-700' :
                            v.estado_visita === 'Confirmada' ? 'bg-green-100 text-green-700' :
                            v.estado_visita === 'Cancelada' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {v.estado_visita || 'Programada'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => abrirReagendar(v)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
                          >
                            Reagendar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Reagendar Visita */}
      {modalReagendar && visitaReagendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Reagendar Visita #{visitaReagendar.id_visita}</h3>
            <form onSubmit={submitReagendar} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={visitaReagendar.fecha_visita}
                  onChange={e => setVisitaReagendar({...visitaReagendar, fecha_visita: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Hora</label>
                <input
                  type="time"
                  required
                  value={visitaReagendar.hora_visita}
                  onChange={e => setVisitaReagendar({...visitaReagendar, hora_visita: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Notas (opcional)</label>
                <textarea
                  value={visitaReagendar.notas || ''}
                  onChange={e => setVisitaReagendar({...visitaReagendar, notas: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalReagendar(false);
                    setVisitaReagendar(null);
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
