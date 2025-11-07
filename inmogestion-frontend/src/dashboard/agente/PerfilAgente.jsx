import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

export default function PerfilAgente() {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ nombre: user?.nombre || '', telefono: user?.telefono || '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    // Simulación: actualiza datos en contexto
    setTimeout(() => {
      login({ ...user, nombre: form.nombre, telefono: form.telefono });
      setSaving(false);
      setMsg('Perfil actualizado');
    }, 600);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg && <div className="bg-green-50 text-green-700 p-2 rounded">{msg}</div>}
          <div>
            <label className="text-sm font-medium block mb-1">Nombre visible</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} className="border rounded w-full px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Teléfono</label>
            <input name="telefono" value={form.telefono} onChange={handleChange} className="border rounded w-full px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Correo</label>
            <input disabled value={user?.email || ''} className="border rounded w-full px-3 py-2 bg-gray-50" />
          </div>
          <button disabled={saving} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
