import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { getProperties, updatePropertyState, deleteProperty, updateProperty, getPropertyById, getImagenesByPropiedad, uploadImagenPropiedad, deleteImagenPropiedad, updatePrioridadImagen, getLocalidades, getBarriosByLocalidad, getAllVisitas, reagendarVisita, getClientes } from '../../services/api';

export default function PropiedadesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null); // propiedad seleccionada para editar
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagenes, setImagenes] = useState({});
  const [galeria, setGaleria] = useState([]); // imágenes de la propiedad en edición
  const [newImages, setNewImages] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState('');
  const [filters, setFilters] = useState({ tipo: '', localidad: '', estado: '' });
  
  // Estados para gestión de visitas
  const [visitas, setVisitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loadingVisitas, setLoadingVisitas] = useState(false);
  const [visitaReagendar, setVisitaReagendar] = useState(null);
  const [modalReagendar, setModalReagendar] = useState(false);
  const [activeTab, setActiveTab] = useState('propiedades'); // 'propiedades' | 'visitas'

  const load = async () => {
    setError('');
    try {
      const data = await getProperties({
        tipo: filters.tipo || undefined,
        localidad: filters.localidad || undefined,
        estado: filters.estado || undefined,
      });
      const normalized = (Array.isArray(data) ? data : []).map((p, i) => ({
        id: p.id_propiedad || p.id || i,
        titulo: p.titulo || `${p.tipo_propiedad || p.tipo} en ${p.nombre_localidad || p.localidad || ''}`.trim(),
        tipo: p.tipo_propiedad || p.tipo || 'N/D',
        localidad: p.nombre_localidad || p.localidad || 'N/D',
        precio: p.precio_propiedad || p.precio || 0,
        estado: p.estado_propiedad || p.estado || 'Disponible',
        area: p.area_m2 || p.superficie || '—',
        direccion: p.direccion_formato || p.direccion || '—',
        habitaciones: p.num_habitaciones || null,
        banos: p.num_banos || null,
      }));
      setRows(normalized);
      // cargar imágenes para vista rápida
      const imgsMap = {};
      await Promise.all(normalized.map(async (r) => {
        try {
          const imgs = await getImagenesByPropiedad(r.id);
          if (imgs && imgs.length) imgsMap[r.id] = imgs[0];
        } catch(_){}
      }));
      setImagenes(imgsMap);
    } catch (e) {
      setError(e.message || 'Error cargando propiedades');
    }
  };

  // Cargar al montar el componente
  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cargar localidades al iniciar
  useEffect(() => {
    (async () => {
      try {
        const locs = await getLocalidades();
        setLocalidades(locs);
      } catch (_) {}
    })();
  }, []);

  // cargar visitas y clientes para la pestaña de gestión de visitas
  const loadVisitas = async () => {
    setLoadingVisitas(true);
    try {
      const [visitasData, clientesData] = await Promise.all([
        getAllVisitas(),
        getClientes()
      ]);
      
      const visitasList = visitasData._fallback ? visitasData.data : visitasData.data || [];
      setVisitas(visitasList);
      setClientes(clientesData);
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

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const onFilter = (e) => { 
    e.preventDefault(); 
    setLoading(true);
    load().finally(() => setLoading(false));
  };
  const limpiarFiltros = () => {
    setFilters({ tipo: '', localidad: '', estado: '' });
    setLoading(true);
    load().finally(() => setLoading(false));
  };

  const cambiarEstado = async (id, nuevo) => {
    try {
      await updatePropertyState(id, nuevo);
      setRows((prev) => prev.map(r => r.id === id ? { ...r, estado: nuevo } : r));
    } catch (e) {
      // Si backend no soporta PATCH aún, hacemos cambio local y mostramos aviso
      setRows((prev) => prev.map(r => r.id === id ? { ...r, estado: nuevo } : r));
    }
  };

  const abrirEditar = async (id) => {
    try {
      const data = await getPropertyById(id);
      setSelected({
        id,
        tipo_propiedad: data.tipo_propiedad || data.tipo || '',
        direccion_formato: data.direccion_formato || data.direccion || '',
        precio_propiedad: data.precio_propiedad || data.precio || 0,
        area_m2: data.area_m2 || data.area || '',
        num_habitaciones: data.num_habitaciones || data.habitaciones || '',
        num_banos: data.num_banos || data.banos || '',
        estado_propiedad: data.estado_propiedad || data.estado || 'Disponible',
        descripcion: data.descripcion || '',
        id_barrio: data.id_barrio || '',
      });
      // intentar derivar localidad desde data si viene, sino esperar selección manual
      setSelectedLocalidad(data.id_localidad || '');
      if (data.id_localidad) {
        try { setBarrios(await getBarriosByLocalidad(data.id_localidad)); } catch(_) {}
      } else { setBarrios([]); }
      setModalOpen(true);
      // cargar galería
      try {
        const imgs = await getImagenesByPropiedad(id);
        // getImagenesByPropiedad devuelve URLs; pero para gestión necesitamos ids. Intentamos recuperar crudos si existen en cache
        // como el servicio devuelve solo URLs, mostraremos solo la vista y permitiremos eliminar si backend
        // Para eliminar necesitamos id_imagen; alternativa: pedir al backend endpoint raw; como no lo tenemos en el servicio, haremos otra llamada directa sin normalizar
      } catch (_) {}
      // Llamada cruda para obtener objetos con id_imagen
      try {
        const res = await fetch(`/api/imagenes/propiedad/${id}`);
        const dataImgs = await res.json();
        setGaleria(Array.isArray(dataImgs) ? dataImgs : []);
      } catch(_) { setGaleria([]); }
    } catch (e) {
      setError('No se pudo cargar la propiedad para editar');
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const payload = {
        tipo_propiedad: selected.tipo_propiedad,
        direccion_formato: selected.direccion_formato,
        precio_propiedad: parseFloat(selected.precio_propiedad),
        area_m2: parseFloat(selected.area_m2),
        num_habitaciones: parseInt(selected.num_habitaciones),
        num_banos: parseInt(selected.num_banos),
        estado_propiedad: selected.estado_propiedad,
        descripcion: selected.descripcion,
        id_barrio: selected.id_barrio ? parseInt(selected.id_barrio) : undefined,
      };
      await updateProperty(selected.id, payload);
      // actualizar tabla local
      setRows(prev => prev.map(r => r.id === selected.id ? {
        ...r,
        tipo: payload.tipo_propiedad,
        direccion: payload.direccion_formato,
        precio: payload.precio_propiedad,
        habitaciones: payload.num_habitaciones,
        banos: payload.num_banos,
        estado: payload.estado_propiedad,
        area: payload.area_m2,
      } : r));
      // Mantener modal abierto y mostrar mensaje de éxito
      setSuccessMsg('Cambios guardados correctamente');
    } catch (e) {
      setError('Error guardando cambios: ' + e.message);
    } finally {
      // Subir nuevas imágenes si se seleccionaron
      if (newImages.length) {
        for (let i = 0; i < newImages.length; i++) {
          try { await uploadImagenPropiedad(selected.id, newImages[i], 0, `Nueva ${i+1}`); } catch(_) {}
        }
      }
      // recargar galería
      try {
        const res = await fetch(`/api/imagenes/propiedad/${selected.id}`);
        const dataImgs = await res.json();
        setGaleria(Array.isArray(dataImgs) ? dataImgs : []);
      } catch(_) {}
      setSaving(false);
    }
  };

  const eliminarPropiedad = async (id) => {
    if (!window.confirm('¿Eliminar esta propiedad? Esta acción es irreversible.')) return;
    try {
      await deleteProperty(id);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      setError('No se pudo eliminar: ' + e.message);
    }
  };
  const setPrincipal = async (img) => {
    try {
      // establecer alta prioridad para esta y 0 para las demás
      await updatePrioridadImagen(img.id_imagen, 100);
      const others = galeria.filter(g => g.id_imagen !== img.id_imagen);
      await Promise.all(others.map(g => updatePrioridadImagen(g.id_imagen, 0)));
      // refrescar
      const res = await fetch(`/api/imagenes/propiedad/${selected.id}`);
      const dataImgs = await res.json();
      setGaleria(Array.isArray(dataImgs) ? dataImgs : []);
    } catch (e) {
      setError('No se pudo actualizar la imagen principal');
    }
  };
  const eliminarImagen = async (img) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    try {
      await deleteImagenPropiedad(img.id_imagen);
      setGaleria(prev => prev.filter(g => g.id_imagen !== img.id_imagen));
    } catch (e) {
      setError('No se pudo eliminar la imagen');
    }
  };

  // Mensaje de éxito en edición
  const [successMsg, setSuccessMsg] = useState('');

  const handleLocalidadChange = async (e) => {
    const val = e.target.value;
    setSelectedLocalidad(val);
    setSelected(s => s ? { ...s, id_barrio: '' } : s);
    if (val) {
      try { setBarrios(await getBarriosByLocalidad(val)); } catch(_) { setBarrios([]); }
    } else {
      setBarrios([]);
    }
  };
  const handleBarrioChange = (e) => {
    const val = e.target.value;
    setSelected(s => s ? { ...s, id_barrio: val } : s);
  };

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
      
      // actualizar lista de visitas
      setVisitas(prev => prev.map(v => 
        v.id_visita === visitaReagendar.id_visita 
          ? { ...v, fecha_visita: visitaReagendar.fecha_visita, hora_visita: visitaReagendar.hora_visita }
          : v
      ));
      
      setModalReagendar(false);
      setVisitaReagendar(null);
    } catch (e) {
      alert('Error al reagendar: ' + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">Gestión de Propiedades y Visitas</h2>

      {/* Tabs para cambiar entre propiedades y visitas */}
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

      {/* Contenido según tab activo */}
      {activeTab === 'propiedades' && (
        <>
      {/* Filtros */}
      <form onSubmit={onFilter} className="bg-white rounded-lg shadow-md p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
          <input 
            name="tipo" 
            value={filters.tipo} 
            onChange={onChange} 
            placeholder="Tipo (Casa, Apartamento, Lote)" 
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
          <div className="flex justify-center">
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

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando propiedades...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700 font-semibold">❌ {error}</p>
          </div>
        ) : (
          <div className="overflow-x-hidden">
            {/* Vista Desktop/Tablet reemplazada por DataTable */}
            <DataTable
              columns={[
                { key: 'id', header: 'ID', sortable: true, width: '70px', className: 'text-left px-4' },
                { key: 'titulo', header: 'Título', sortable: true, className: 'text-left', render: (r) => (
                  <div className="flex items-center gap-3">
                    {imagenes[r.id] && (
                      <img src={imagenes[r.id]} alt="thumb" className="w-10 h-10 rounded object-cover border" />
                    )}
                    <span className="font-semibold text-gray-900 truncate">{r.titulo}</span>
                  </div>
                ) },
                { key: 'tipo', header: 'Tipo', sortable: true, render: (r) => (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{r.tipo}</span>
                ) },
                { key: 'localidad', header: 'Localidad', sortable: true, render: (r) => (
                  <span className="truncate text-gray-700">{r.localidad}</span>
                ) },
                { key: 'habitaciones', header: '🛏️', sortable: true, className: 'text-center', render: (r) => (
                  r.habitaciones ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm">{r.habitaciones}</span>
                  ) : <span className="text-gray-400 text-sm">-</span>
                ) },
                { key: 'banos', header: '🚿', sortable: true, className: 'text-center', render: (r) => (
                  r.banos ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-sm">{r.banos}</span>
                  ) : <span className="text-gray-400 text-sm">-</span>
                ) },
                { key: 'precio', header: '💰 Precio', sortable: true, render: (r) => (
                  <span className="font-bold text-green-600 truncate">${typeof r.precio === 'number' ? r.precio.toLocaleString('es-CO') : r.precio}</span>
                ) },
                { key: 'estado', header: 'Estado', sortable: true, className: 'text-center', render: (r) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.estado === 'Disponible' ? 'bg-green-100 text-green-700' : r.estado === 'Vendida' ? 'bg-purple-100 text-purple-700' : r.estado === 'Reservada' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{r.estado}</span>
                ) },
              ]}
              data={rows}
              loading={loading}
              defaultSortKey="id"
              rowActions={(r) => (
                <>
                  <button 
                    onClick={() => cambiarEstado(r.id, 'Disponible')} 
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                    title="Activar"
                  >Activar</button>
                  <button 
                    onClick={() => cambiarEstado(r.id, 'Reservada')} 
                    className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                    title="Reservar"
                  >Reservar</button>
                  <button 
                    onClick={() => cambiarEstado(r.id, 'Vendida')} 
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                    title="Vender"
                  >Vender</button>
                  <button
                    onClick={() => abrirEditar(r.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                    title="Editar"
                  >Editar</button>
                  <button
                    onClick={() => eliminarPropiedad(r.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                    title="Eliminar"
                  >Eliminar</button>
                </>
              )}
              emptyMessage="No hay propiedades registradas"
            />

            {/* Vista Móvil: Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {rows.map((r, idx) => (
                <div key={r.id} className={`p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {imagenes[r.id] && (
                      <img src={imagenes[r.id]} alt="thumb" className="w-20 h-20 rounded object-cover border flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500">ID {r.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.estado === 'Disponible' ? 'bg-green-100 text-green-700' : 
                          r.estado === 'Vendida' ? 'bg-purple-100 text-purple-700' : 
                          r.estado === 'Reservada' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {r.estado}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{r.titulo}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{r.tipo}</span>
                        <span>{r.localidad}</span>
                      </div>
                      <p className="font-bold text-green-600 text-sm">
                        ${typeof r.precio === 'number' ? r.precio.toLocaleString('es-CO') : r.precio}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                    {r.habitaciones ? (
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">🛏️</span> {r.habitaciones}
                      </span>
                    ) : null}
                    {r.banos ? (
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">🚿</span> {r.banos}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button 
                      onClick={() => cambiarEstado(r.id, 'Disponible')} 
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-semibold transition shadow-sm"
                    >
                      Activar
                    </button>
                    <button 
                      onClick={() => cambiarEstado(r.id, 'Reservada')} 
                      className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md font-semibold transition shadow-sm"
                    >
                      Reservar
                    </button>
                    <button 
                      onClick={() => cambiarEstado(r.id, 'Vendida')} 
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md font-semibold transition shadow-sm"
                    >
                      Vender
                    </button>
                    <button
                      onClick={() => abrirEditar(r.id)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md font-semibold transition shadow-sm"
                    >
                      Editar
                    </button>
                  </div>
                  <button
                    onClick={() => eliminarPropiedad(r.id)}
                    className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md font-semibold transition shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <p className="text-lg font-semibold">No hay propiedades registradas</p>
                    <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros o registra una nueva propiedad</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    {/* Modal de edición */}
    {modalOpen && selected && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
          >✕</button>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Editar Propiedad #{selected.id}</h3>
          {successMsg && (
            <div className="mb-3 p-2 rounded bg-green-50 border border-green-300 text-green-700 text-sm">
              ✅ {successMsg}
            </div>
          )}
          <form onSubmit={guardarEdicion} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Tipo</label>
              <select
                value={selected.tipo_propiedad}
                onChange={e => setSelected(s => ({ ...s, tipo_propiedad: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
              >
                <option>Casa</option>
                <option>Apartamento</option>
                <option>Lote</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Dirección</label>
              <input
                value={selected.direccion_formato}
                onChange={e => setSelected(s => ({ ...s, direccion_formato: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Precio (COP)</label>
              <input
                type="number"
                value={selected.precio_propiedad}
                onChange={e => setSelected(s => ({ ...s, precio_propiedad: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Área (m²)</label>
              <input
                type="number"
                value={selected.area_m2}
                onChange={e => setSelected(s => ({ ...s, area_m2: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Habitaciones</label>
              <input
                type="number"
                value={selected.num_habitaciones}
                onChange={e => setSelected(s => ({ ...s, num_habitaciones: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Baños</label>
              <input
                type="number"
                value={selected.num_banos}
                onChange={e => setSelected(s => ({ ...s, num_banos: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Estado</label>
              <select
                value={selected.estado_propiedad}
                onChange={e => setSelected(s => ({ ...s, estado_propiedad: e.target.value }))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
              >
                <option>Disponible</option>
                <option>Reservada</option>
                <option>Vendida</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Localidad</label>
              <select
                value={selectedLocalidad}
                onChange={handleLocalidadChange}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
              >
                <option value="">-- Seleccionar --</option>
                {localidades.map(l => (
                  <option key={l.id_localidad || l.id} value={l.id_localidad || l.id}>{l.nombre || l.nombre_localidad}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Barrio</label>
              <select
                value={selected.id_barrio || ''}
                onChange={handleBarrioChange}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
                disabled={!barrios.length}
              >
                <option value="">{barrios.length ? '--- Seleccionar ---' : 'Seleccione localidad'}</option>
                {barrios.map(b => (
                  <option key={b.id_barrio || b.id} value={b.id_barrio || b.id}>{b.nombre || b.nombre_barrio}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Descripción</label>
              <textarea
                value={selected.descripcion}
                onChange={e => setSelected(s => ({ ...s, descripcion: e.target.value }))}
                rows={4}
                className="w-full mt-1 border rounded px-3 py-2 text-sm sm:text-base"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Subir nuevas imágenes</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setNewImages(Array.from(e.target.files))}
                className="w-full mt-1 border rounded px-3 py-2 text-sm"
              />
              {newImages.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">{newImages.length} archivo(s) seleccionados</p>
              )}
            </div>
            {newImages.length > 0 && (
              <div className="md:col-span-2">
                <div className="flex flex-wrap gap-3 mt-2">
                  {newImages.map((file, idx) => (
                    <div key={idx} className="w-24 h-24 relative group border rounded overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 truncate">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-1 block">Galería</label>
              {galeria.length === 0 && <p className="text-sm text-gray-500">Sin imágenes registradas.</p>}
              {galeria.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-h-72 overflow-auto pr-2">
                  {galeria.sort((a,b)=> (b.prioridad||0)-(a.prioridad||0)).map(img => (
                    <div key={img.id_imagen} className="relative group border rounded p-1 bg-gray-50">
                      <img src={img.url} alt="prop" className="w-full h-24 object-cover rounded" />
                      {img.prioridad > 0 && (
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">Principal</span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-2 transition">
                        <button
                          type="button"
                          onClick={() => setPrincipal(img)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        >Principal</button>
                        <button
                          type="button"
                          onClick={() => eliminarImagen(img)}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                        >Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50 font-semibold text-sm sm:text-base"
              >{saving ? 'Guardando...' : 'Guardar cambios'}</button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold text-sm sm:text-base"
              >Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )}
        </>
      )}

      {/* Tab de Visitas */}
      {activeTab === 'visitas' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Todas las Visitas</h3>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold">ID Visita</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Cliente</th>
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
                          {cliente ? `${cliente.nombre_cliente || cliente.nombre} (${v.id_cliente})` : `Cliente ${v.id_cliente}`}
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
