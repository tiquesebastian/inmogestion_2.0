import React, { useEffect, useState } from 'react';
import { getUsers, updateUserEstado } from '../../services/api';
import DataTable from '../../components/DataTable';

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

  async function onChangeEstado(id_usuario, nextEstado) {
    try {
      await updateUserEstado(id_usuario, nextEstado);
      setRows(prev => prev.map(u => (u.id_usuario === id_usuario ? { ...u, estado: nextEstado } : u)));
    } catch (e) {
      setError(e.message || 'Error actualizando estado');
    }
  }

  // Normalización ligera para asegurar claves esperadas
  const normalized = filtered.map((u, i) => ({
    id: u.id_usuario || u.id || i,
    nombre: u.nombre || u.nombre_usuario || '—',
    email: u.email || u.correo || '—',
    rol: u.rol || u.tipo_rol || '—',
    estado: u.estado || 'Activo'
  }));

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

      <div className="bg-white rounded-lg shadow p-2">
        <DataTable
          data={normalized}
          loading={loading}
          emptyMessage={error ? error : 'Sin usuarios'}
          defaultSortKey="id"
          columns={[
            { key: 'id', header: 'ID', sortable: true, width: '70px', className: 'text-left px-3' },
            { key: 'nombre', header: 'Nombre', sortable: true, render: (r) => <span className="font-medium text-gray-800 truncate">{r.nombre}</span> },
            { key: 'email', header: 'Correo', sortable: true, render: (r) => <span className="text-gray-600 truncate">{r.email}</span> },
            { key: 'rol', header: 'Rol', sortable: true, render: (r) => (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{r.rol}</span>
            ) },
            { key: 'estado', header: 'Estado', sortable: true, className: 'text-center', render: (r) => (
              <div className="flex items-center justify-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.estado === 'Activo' ? 'bg-green-100 text-green-700' : r.estado === 'Bloqueado' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.estado}</span>
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={r.estado}
                  onChange={(e) => onChangeEstado(r.id, e.target.value)}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                  <option>Bloqueado</option>
                </select>
              </div>
            ) },
          ]}
        />
      </div>
    </div>
  );
}
