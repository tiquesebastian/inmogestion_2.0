import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('verificando'); // verificando | exito | error
  const [mensaje, setMensaje] = useState('');

  const token = searchParams.get('token');
  const tipo = searchParams.get('tipo'); // 'usuario' o 'cliente'

  useEffect(() => {
    if (!token || !tipo) {
      setEstado('error');
      setMensaje('Enlace de verificación inválido. Faltan parámetros.');
      return;
    }

    const verificarCorreo = async () => {
      try {
        const endpoint = tipo === 'cliente' 
          ? `/api/auth/verificar-email-cliente/${token}`
          : `/api/auth/verificar-email-usuario/${token}`;

        const response = await axios.get(`/api${endpoint}`);
        setEstado('exito');
        setMensaje(response.data.message || 'Correo verificado exitosamente');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate(tipo === 'cliente' ? '/login-cliente' : '/login');
        }, 3000);
      } catch (error) {
        setEstado('error');
        setMensaje(
          error.response?.data?.message || 
          'Error al verificar el correo. El token puede haber expirado.'
        );
      }
    };

    verificarCorreo();
  }, [token, tipo, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        {estado === 'verificando' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando correo...</h2>
            <p className="text-gray-600">Por favor espera un momento</p>
          </>
        )}

        {estado === 'exito' && (
          <>
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">¡Correo verificado!</h2>
            <p className="text-gray-600 mb-4">{mensaje}</p>
            <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
          </>
        )}

        {estado === 'error' && (
          <>
            <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Error de verificación</h2>
            <p className="text-gray-600 mb-6">{mensaje}</p>
            <button
              onClick={() => navigate(tipo === 'cliente' ? '/registro-cliente' : '/registro')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Volver al registro
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificarEmail;
