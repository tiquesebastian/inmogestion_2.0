import React, { useState } from 'react';

/**
 * Componente ContactForm
 * Formulario para que los clientes expresen interés en una propiedad
 * Envía los datos al backend para registrar el interés y asignar un agente
 * 
 * @param {number} propertyId - ID de la propiedad de interés
 * @param {function} onSuccess - Callback opcional al registrar exitosamente
 */
const ContactForm = ({ propertyId, onSuccess }) => {
  // Estado para los campos del formulario
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', mensaje: '' });
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mensajes de error
  const [error, setError] = useState('');
  
  // Estado para mensaje de éxito
  const [success, setSuccess] = useState(false);

  /**
   * Actualiza el estado del formulario cuando cambian los campos
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Envía el formulario al backend para registrar el interés
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Endpoint en backend: /api/propiedades/:id/interest
      const res = await fetch(`/api/propiedades/${propertyId}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error('Error al registrar interés');
      
      setSuccess(true);
      onSuccess && onSuccess(); // Ejecutar callback si existe
    } catch (err) {
      setError('No se pudo registrar el interés. Intenta de nuevo.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: 20 }}>
      <h3>¿Te interesa esta propiedad?</h3>
      <input name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
      <input name="correo" type="email" placeholder="Tu correo" value={form.correo} onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
      <textarea name="mensaje" placeholder="Mensaje o preferencia" value={form.mensaje} onChange={handleChange} />
      <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Contactar'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>¡Interés registrado! Un agente te contactará pronto.</p>}
    </form>
  );
};

export default ContactForm;
