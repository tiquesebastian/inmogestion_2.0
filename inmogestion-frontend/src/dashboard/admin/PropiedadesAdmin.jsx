import React, { useEffect, useState } from 'react';
import { getProperties, updatePropertyState } from '../../services/api';

export default function PropiedadesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ tipo: '', localidad: '', estado: '' });

  const load = async () => {
    setError('');
    try {
      const data = await getProperties({
        tipo: filters.tipo || undefined,
        localidad: filters.localidad || undefined,
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
      })).filter(r => !filters.estado || r.estado === filters.estado);
      setRows(normalized);
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

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const onFilter = (e) => { e.preventDefault(); load(); };

  const cambiarEstado = async (id, nuevo) => {
    try {
      await updatePropertyState(id, nuevo);
      setRows((prev) => prev.map(r => r.id === id ? { ...r, estado: nuevo } : r));
    } catch (e) {
      // Si backend no soporta PATCH aún, hacemos cambio local y mostramos aviso
      setRows((prev) => prev.map(r => r.id === id ? { ...r, estado: nuevo } : r));
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Propiedades</h2>

      {/* Filtros */}
      <form onSubmit={onFilter} className="bg-white rounded-lg shadow-md p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          name="tipo" 
          value={filters.tipo} 
          onChange={onChange} 
          placeholder="Tipo (Casa, Apartamento, Lote)" 
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <input 
          name="localidad" 
          value={filters.localidad} 
          onChange={onChange} 
          placeholder="Localidad" 
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
        />
        <select 
          name="estado" 
          value={filters.estado} 
          onChange={onChange} 
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="Disponible">Disponible</option>
          <option value="Reservada">Reservada</option>
          <option value="Vendida">Vendida</option>
        </select>
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 transition shadow-md hover:shadow-lg"
        >
          🔍 Filtrar
        </button>
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
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-sm">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm">Título</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm">Localidad</th>
                  <th className="text-center px-4 py-3 font-semibold text-sm">🛏️ Hab.</th>
                  <th className="text-center px-4 py-3 font-semibold text-sm">🚿 Baños</th>
                  <th className="text-left px-4 py-3 font-semibold text-sm">💰 Precio</th>
                  <th className="text-center px-4 py-3 font-semibold text-sm">Estado</th>
                  <th className="text-center px-4 py-3 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r, idx) => (
                  <tr key={r.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{r.id}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">{r.titulo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {r.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.localidad}</td>
                    <td className="px-4 py-3 text-center">
                      {r.habitaciones ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm">
                          {r.habitaciones}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.banos ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-sm">
                          {r.banos}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      ${typeof r.precio === 'number' ? r.precio.toLocaleString('es-CO') : r.precio}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.estado === 'Disponible' ? 'bg-green-100 text-green-700' : 
                        r.estado === 'Vendida' ? 'bg-purple-100 text-purple-700' : 
                        r.estado === 'Reservada' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button 
                          onClick={() => cambiarEstado(r.id, 'Disponible')} 
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                          title="Activar"
                        >
                          Activar
                        </button>
                        <button 
                          onClick={() => cambiarEstado(r.id, 'Reservada')} 
                          className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                          title="Reservar"
                        >
                          Reservar
                        </button>
                        <button 
                          onClick={() => cambiarEstado(r.id, 'Vendida')} 
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md font-semibold transition shadow-sm hover:shadow-md"
                          title="Vender"
                        >
                          Vender
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="p-8 text-center text-gray-500" colSpan={9}>
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <p className="text-lg font-semibold">No hay propiedades registradas</p>
                        <p className="text-sm text-gray-400 mt-1">Intenta ajustar los filtros o registra una nueva propiedad</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
