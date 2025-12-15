import { useState } from 'react';
import { Link } from 'react-router-dom';

// Página SOLO para solicitar el email de recuperación.
// El correo con el enlace (token) será enviado usando /api/password-recovery/forgot-password-usuario
// El reseteo final ocurre en la página ResetPassword.jsx leyendo ?token=...
export default function RecuperarContrasenaUsuario() {
  const [correo, setCorreo] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState('');

  const solicitar = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
         const res = await fetch('/api/password-recovery/forgot-password-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: correo })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error solicitando recuperación');
      setMsg(data.message || 'Si el correo existe, recibirás un email con instrucciones.');
      if (data.token) setDevToken(data.token); // Solo en modo desarrollo
      setCorreo('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-blue-900 mb-6 text-center'>Recuperar Contraseña (Admin / Agente)</h1>
        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
        {msg && (
          <div className='mb-4 p-3 bg-green-100 text-green-700 rounded'>
            {msg}
            {devToken && (
              <span className='block text-xs break-all mt-2'>Token dev: {devToken}</span>
            )}
            <div className='mt-3 text-center'>
              <Link to='/inmogestion' className='inline-block bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700'>
                Volver al login interno
              </Link>
              <Link to='/reset-password' className='ml-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500'>
                Ir a restablecer (si ya tienes enlace)
              </Link>
            </div>
          </div>
        )}
        <form onSubmit={solicitar} className='space-y-4'>
          <input
            type='email'
            placeholder='Correo corporativo'
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            required
            className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            disabled={loading}
            className='w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400'
          >
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
        <p className='text-xs text-gray-500 mt-4'>Por seguridad no confirmamos si el email existe.</p>
      </div>
    </div>
  );
}