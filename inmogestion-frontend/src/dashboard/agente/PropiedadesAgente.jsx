import React, { useContext, useEffect, useState } from 'react';
import { getAgentProperties, createVisit } from '../../services/api';
import AuthContext from '../../context/AuthContext';

export default function PropiedadesAgente() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [visit, setVisit] = useState({ id_propiedad: null, fecha_visita: '', notas: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const data = await getAgentProperties(user?.id);
        setRows(data);
      } catch (e) {
        setError(e.message || 'Error cargando propiedades');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const openVisit = (id_propiedad) => {
    setVisit({ id_propiedad, fecha_visita: '', notas: '' });
    setSuccess(''); setError('');
  };

  const submitVisit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id_propiedad: visit.id_propiedad,
        id_cliente: 1, // TODO: seleccionar cliente real
        id_agente: user?.id || 2,
        fecha_visita: visit.fecha_visita,
        notas: visit.notas,
      };
      await createVisit(payload);
      setSuccess('Visita creada');
      setVisit({ id_propiedad: null, fecha_visita: '', notas: '' });
    } catch (e) {
      setError(e.message || 'No se pudo crear la visita');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mis Propiedades</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-gray-600">Cargando...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {rows.map((p, i) => (
              <article key={p.id_propiedad || p.id || i} className="border rounded p-4">
                <h3 className="font-semibold text-blue-900">{p.titulo || p.tipo_propiedad || 'Propiedad'}</h3>
                <p className="text-sm text-gray-700">{p.direccion_formato || p.direccion || 'Dirección'}</p>
                <p className="text-sm text-gray-700">{p.nombre_localidad || p.localidad}</p>
                <p className="font-bold text-green-700 mt-2">${(p.precio_propiedad || 0).toLocaleString('es-CO')}</p>
                <button onClick={() => openVisit(p.id_propiedad || p.id || i)} className="mt-3 bg-blue-600 text-white rounded px-3 py-1">Agendar visita</button>
              </article>
            ))}
            {rows.length === 0 && <div className="text-gray-600">No tienes propiedades asignadas</div>}
          </div>
        )}

        {/* Modal simple de visita */}
        {visit.id_propiedad && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <form onSubmit={submitVisit} className="bg-white rounded-lg p-5 w-full max-w-md">
              <h4 className="text-lg font-semibold mb-3">Agendar visita</h4>
              {success && <div className="bg-green-50 text-green-700 p-2 rounded mb-2">{success}</div>}
              {error && <div className="bg-red-50 text-red-700 p-2 rounded mb-2">{error}</div>}

              <label className="text-sm mb-1 block">Fecha y hora</label>
              <input type="datetime-local" required value={visit.fecha_visita} onChange={(e)=>setVisit({...visit, fecha_visita:e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />

              <label className="text-sm mb-1 block">Notas (opcional)</label>
              <textarea value={visit.notas} onChange={(e)=>setVisit({...visit, notas:e.target.value})} className="w-full border rounded px-3 py-2 mb-4" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setVisit({ id_propiedad:null, fecha_visita:'', notas:''})} className="px-3 py-2 rounded border">Cancelar</button>
                <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">Guardar</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
