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
  const [form, setForm] = useState({ 
    nombre_cliente: '', 
    apellido_cliente: '', 
    correo_cliente: '', 
    telefono_cliente: '', 
    documento_cliente: '',
    nombre_usuario: '',
    contrasena: '' 
  });
  
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    
    // Validar que las contraseñas coincidan
    if (form.contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    // Validar que aceptó los términos
    if (!aceptarTerminos) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:4000/api/auth/registro-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
      }
      
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setForm({ 
        nombre_cliente: '', 
        apellido_cliente: '', 
        correo_cliente: '', 
        telefono_cliente: '', 
        documento_cliente: '',
        nombre_usuario: '',
        contrasena: '' 
      });
      setConfirmarContrasena('');
      setAceptarTerminos(false);
      
      onSuccess && onSuccess(data); // Ejecutar callback si existe
    } catch (err) {
      setError(err.message || 'No se pudo registrar. Intenta de nuevo.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Registro de Cliente</h3>
      
      <div className="mb-4">
        <input 
          name="nombre_cliente" 
          placeholder="Nombre" 
          value={form.nombre_cliente} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="apellido_cliente" 
          placeholder="Apellido" 
          value={form.apellido_cliente} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="correo_cliente" 
          type="email" 
          placeholder="Correo electrónico" 
          value={form.correo_cliente} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="telefono_cliente" 
          placeholder="Teléfono" 
          value={form.telefono_cliente} 
          onChange={handleChange} 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="documento_cliente" 
          placeholder="Documento de identidad" 
          value={form.documento_cliente} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="nombre_usuario" 
          placeholder="Nombre de usuario" 
          value={form.nombre_usuario} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="contrasena" 
          type="password" 
          placeholder="Contraseña" 
          value={form.contrasena} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <input 
          name="confirmar_contrasena" 
          type="password" 
          placeholder="Confirmar contraseña" 
          value={confirmarContrasena} 
          onChange={(e) => setConfirmarContrasena(e.target.value)} 
          required 
          className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
            confirmarContrasena && form.contrasena !== confirmarContrasena
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {confirmarContrasena && form.contrasena !== confirmarContrasena && (
          <p className="text-red-600 text-sm mt-1">Las contraseñas no coinciden</p>
        )}
        {confirmarContrasena && form.contrasena === confirmarContrasena && (
          <p className="text-green-600 text-sm mt-1">✓ Las contraseñas coinciden</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="flex items-start gap-2">
          <input 
            type="checkbox" 
            checked={aceptarTerminos} 
            onChange={(e) => setAceptarTerminos(e.target.checked)}
            required
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Acepto los{' '}
            <a 
              href="/terminos-condiciones" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Términos y Condiciones
            </a>
          </span>
        </label>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
    </form>
  );
};

export default ClientRegistration;
