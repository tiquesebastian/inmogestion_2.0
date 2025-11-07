import React, { useState } from 'react';

/**
 * Componente ClientRegistration
 * Formulario de registro rápido para nuevos clientes
 * Permite crear una cuenta básica sin salir del flujo de navegación
 * 
 * @param {function} onSuccess - Callback opcional al registrarse exitosamente
 */
const ClientRegistration = ({ onSuccess }) => {
  // Estado para los campos del formulario de registro
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', telefono: '', contrasena: '' });
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mensajes de error
  const [error, setError] = useState('');

  /**
   * Actualiza el estado del formulario cuando cambian los campos
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Envía los datos de registro al backend
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/clientes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error('Error en el registro');
      
      onSuccess && onSuccess(); // Ejecutar callback si existe
    } catch (err) {
      setError('No se pudo registrar. Intenta de nuevo.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>Registro rápido</h3>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
      <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      <input name="contrasena" type="password" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default ClientRegistration;
