import React, { useEffect, useState } from 'react';
import { getUsers } from '../../services/api';

export default function UsuariosAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [rol, setRol] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const u = await getUsers();
        setRows(u);
      } catch (e) {
        setError(e.message || 'Error cargando usuarios');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = rol ? rows.filter(r => r.rol === rol) : rows;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      <div className="bg-white rounded-lg shadow p-4 mb-4 flex items-center gap-3">
        <label className="text-sm">Filtrar por rol:</label>
        <select value={rol} onChange={(e) => setRol(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Todos</option>
          <option>Administrador</option>
          <option>Agente</option>
          <option>Cliente</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-auto">
        {loading ? (
          <div className="p-6 text-gray-600">Cargando...</div>
        ) : error ? (
          <div className="p-6 text-red-600">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id_usuario || u.id} className="border-t">
                  <td className="p-3">{u.id_usuario || u.id}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.rol}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.estado || 'Activo'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="p-6 text-center text-gray-600" colSpan={5}>Sin usuarios</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
