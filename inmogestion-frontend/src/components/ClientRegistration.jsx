import { useState } from 'react';

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
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  
  // Estado para controlar el indicador de carga
  const [loading, setLoading] = useState(false);
  
  // Estado para mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [erroresValidacion, setErroresValidacion] = useState({});

  // Validación de contraseña fuerte
  const validarContrasena = (password) => {
    const errores = [];
    if (password.length < 8) errores.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("Al menos una mayúscula");
    if (!/[a-z]/.test(password)) errores.push("Al menos una minúscula");
    if (!/[0-9]/.test(password)) errores.push("Al menos un número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errores.push("Al menos un carácter especial");
    return errores;
  };

  // Validación de email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validación de teléfono colombiano
  const validarTelefono = (telefono) => {
    const regex = /^[3][0-9]{9}$/;
    return regex.test(telefono);
  };

  // Validación de documento (cédula colombiana)
  const validarDocumento = (doc) => {
    const regex = /^[0-9]{6,10}$/;
    return regex.test(doc);
  };

  /**
   * Actualiza el estado del formulario cuando cambian los campos
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validar en tiempo real
    const nuevosErrores = { ...erroresValidacion };
    
    if (name === "correo_cliente" && value) {
      if (!validarEmail(value)) {
        nuevosErrores.correo_cliente = "Email inválido";
      } else {
        delete nuevosErrores.correo_cliente;
      }
    }

    if (name === "telefono_cliente" && value) {
      if (!validarTelefono(value)) {
        nuevosErrores.telefono_cliente = "Formato: 3XXXXXXXXX (10 dígitos)";
      } else {
        delete nuevosErrores.telefono_cliente;
      }
    }

    if (name === "documento_cliente" && value) {
      if (!validarDocumento(value)) {
        nuevosErrores.documento_cliente = "Documento inválido (6-10 dígitos)";
      } else {
        delete nuevosErrores.documento_cliente;
      }
    }

    if (name === "contrasena" && value) {
      const erroresPass = validarContrasena(value);
      if (erroresPass.length > 0) {
        nuevosErrores.contrasena = erroresPass;
      } else {
        delete nuevosErrores.contrasena;
      }
    }

    setErroresValidacion(nuevosErrores);
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
    
    // Validaciones finales
    if (!validarEmail(form.correo_cliente)) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    if (form.telefono_cliente && !validarTelefono(form.telefono_cliente)) {
      setError('El teléfono debe tener formato: 3XXXXXXXXX (10 dígitos)');
      setLoading(false);
      return;
    }

    if (!validarDocumento(form.documento_cliente)) {
      setError('El documento debe tener entre 6 y 10 dígitos');
      setLoading(false);
      return;
    }

    const erroresPass = validarContrasena(form.contrasena);
    if (erroresPass.length > 0) {
      setError('La contraseña no cumple los requisitos: ' + erroresPass.join(', '));
      setLoading(false);
      return;
    }
    
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
      const res = await fetch('/api/auth/registro-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
      }
      
      setSuccess('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
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
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Registro de Cliente</h3>
        <p className="text-sm text-gray-600 mt-2">Completa tus datos para crear tu cuenta</p>
      </div>
      
      {/* Grid de 2 columnas en pantallas medianas y grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input 
            name="nombre_cliente" 
            type="text"
            placeholder="Tu nombre" 
            value={form.nombre_cliente} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input 
            name="apellido_cliente" 
            type="text"
            placeholder="Tu apellido" 
            value={form.apellido_cliente} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <input 
          name="correo_cliente" 
          type="email" 
          placeholder="tu@email.com" 
          value={form.correo_cliente} 
          onChange={handleChange} 
          required 
          className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
            erroresValidacion.correo_cliente
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
          }`}
        />
        {erroresValidacion.correo_cliente && (
          <p className="text-red-600 text-xs mt-1">❌ {erroresValidacion.correo_cliente}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input 
            name="telefono_cliente" 
            type="tel"
            placeholder="3001234567" 
            value={form.telefono_cliente} 
            onChange={handleChange}
            maxLength="10"
            className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
              erroresValidacion.telefono_cliente
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
          {erroresValidacion.telefono_cliente && (
            <p className="text-red-600 text-xs mt-1">❌ {erroresValidacion.telefono_cliente}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Formato: 3XXXXXXXXX</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Documento *
          </label>
          <input 
            name="documento_cliente" 
            type="text"
            placeholder="1234567890" 
            value={form.documento_cliente} 
            onChange={handleChange} 
            required
            maxLength="10"
            className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
              erroresValidacion.documento_cliente
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
          {erroresValidacion.documento_cliente && (
            <p className="text-red-600 text-xs mt-1">❌ {erroresValidacion.documento_cliente}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Cédula de ciudadanía</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de usuario *
        </label>
        <input 
          name="nombre_usuario" 
          type="text"
          placeholder="usuario123" 
          value={form.nombre_usuario} 
          onChange={handleChange} 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <div className="relative">
          <input 
            name="contrasena" 
            type={mostrarContrasena ? "text" : "password"}
            placeholder="••••••••" 
            value={form.contrasena} 
            onChange={handleChange} 
            required 
            className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 transition ${
              erroresValidacion.contrasena
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {mostrarContrasena ? "🙈" : "👁️"}
          </button>
        </div>
        {erroresValidacion.contrasena && (
          <ul className="text-red-600 text-xs mt-1 space-y-0.5">
            {erroresValidacion.contrasena.map((err, i) => (
              <li key={i}>❌ {err}</li>
            ))}
          </ul>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña *
        </label>
        <div className="relative">
          <input 
            name="confirmar_contrasena" 
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="••••••••" 
            value={confirmarContrasena} 
            onChange={(e) => setConfirmarContrasena(e.target.value)} 
            required 
            className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 transition ${
              confirmarContrasena && form.contrasena !== confirmarContrasena
                ? 'border-red-500 focus:ring-red-500'
                : confirmarContrasena && form.contrasena === confirmarContrasena
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {mostrarConfirmar ? "🙈" : "👁️"}
          </button>
        </div>
        {confirmarContrasena && form.contrasena !== confirmarContrasena && (
          <p className="text-red-600 text-xs mt-1">❌ Las contraseñas no coinciden</p>
        )}
        {confirmarContrasena && form.contrasena === confirmarContrasena && (
          <p className="text-green-600 text-xs mt-1">✅ Las contraseñas coinciden</p>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <label className="flex items-start gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={aceptarTerminos} 
            onChange={(e) => setAceptarTerminos(e.target.checked)}
            required
            className="mt-1 w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            Acepto los{' '}
            <a 
              href="/terminos-condiciones" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Términos y Condiciones
            </a>
            {' '}y la{' '}
            <a 
              href="/politica-privacidad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Política de Privacidad
            </a>
          </span>
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm font-medium">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 text-sm font-medium">✅ {success}</p>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? '⏳ Registrando...' : '✨ Crear mi cuenta'}
      </button>
    </form>
  );
};

export default ClientRegistration;
