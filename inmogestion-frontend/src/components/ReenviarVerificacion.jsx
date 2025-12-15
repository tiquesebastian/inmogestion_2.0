import { useState } from 'react';
import axios from 'axios';

const ReenviarVerificacion = ({ tipo = 'cliente' }) => {
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | enviando | exito | error
  const [mensaje, setMensaje] = useState('');

  const handleReenviar = async (e) => {
    e.preventDefault();
    
    if (!correo.trim()) {
      setEstado('error');
      setMensaje('Por favor ingresa tu correo electrónico');
      return;
    }

    setEstado('enviando');
    setMensaje('');

    try {
      const endpoint = tipo === 'cliente'
        ? '/api/auth/reenviar-verificacion-cliente'
        : '/api/auth/reenviar-verificacion-usuario';

      const response = await axios.post(`/api${endpoint}`, { correo });
      
      setEstado('exito');
      setMensaje(response.data.message || 'Correo de verificación reenviado. Revisa tu bandeja.');
      setCorreo('');
    } catch (error) {
      setEstado('error');
      setMensaje(
        error.response?.data?.message || 
        'Error al reenviar la verificación. Verifica tu correo e intenta nuevamente.'
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        ¿No recibiste el correo de verificación?
      </h3>
      
      <form onSubmit={handleReenviar} className="space-y-4">
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@correo.com"
            disabled={estado === 'enviando'}
          />
        </div>

        {mensaje && (
          <div
            className={`p-4 rounded-lg ${
              estado === 'exito'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : estado === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : ''
            }`}
          >
            <p className="text-sm">{mensaje}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={estado === 'enviando'}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            estado === 'enviando'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {estado === 'enviando' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : (
            'Reenviar correo de verificación'
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Recibirás un nuevo correo con el enlace de verificación válido por 24 horas.
      </p>
    </div>
  );
};

export default ReenviarVerificacion;
