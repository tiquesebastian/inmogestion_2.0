import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RecuperarContrasenaUsuario(){
  const [paso,setPaso]=useState(1);
  const [correo,setCorreo]=useState('');
  const [token,setToken]=useState('');
  const [nueva,setNueva]=useState('');
  const [confirmar,setConfirmar]=useState('');
  const [msg,setMsg]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  const solicitar=async(e)=>{
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    try {
      const res=await fetch('http://localhost:4000/api/auth/recuperar-usuario',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({correo})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.message||'Error solicitando token');
      setToken(data.token);
      setMsg('Token generado. (Modo prueba) úsalo para restablecer la contraseña.');
      setPaso(2);
    }catch(err){ setError(err.message);} finally {setLoading(false);} }

  const resetear=async(e)=>{
    e.preventDefault();
    setError(''); setMsg('');
    if(nueva!==confirmar){setError('Las contraseñas no coinciden');return;}
    if(nueva.length<6){setError('La contraseña debe tener al menos 6 caracteres');return;}
    setLoading(true);
    try {
      const res=await fetch('http://localhost:4000/api/auth/resetear-usuario',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,nueva})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.message||'Error al resetear');
      setMsg('Contraseña actualizada correctamente.');
      setPaso(1); setCorreo(''); setToken(''); setNueva(''); setConfirmar('');
    }catch(err){setError(err.message);} finally {setLoading(false);} }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold text-blue-900 mb-6 text-center'>Recuperar Contraseña (Admin / Agente)</h1>
        {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}
        {msg && (
          <div className='mb-4 p-3 bg-green-100 text-green-700 rounded'>
            {msg} {token && paso===2 && (<span className='block text-xs break-all mt-2'>Token: {token}</span>)}
            {paso===1 && (
              <div className='mt-3 text-center'>
                <Link to='/inmogestion' className='inline-block bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700'>
                  Volver al login interno
                </Link>
              </div>
            )}
          </div>
        )}
        {paso===1 ? (
          <form onSubmit={solicitar} className='space-y-4'>
            <input type='email' placeholder='Correo corporativo' value={correo} onChange={e=>setCorreo(e.target.value)} required className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'/>
            <button disabled={loading} className='w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400'>{loading?'Enviando...':'Solicitar Token'}</button>
          </form>
        ):(
          <form onSubmit={resetear} className='space-y-4'>
            <input type='text' placeholder='Token' value={token} onChange={e=>setToken(e.target.value)} required className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'/>
            <input type='password' placeholder='Nueva contraseña' value={nueva} onChange={e=>setNueva(e.target.value)} required className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'/>
            <input type='password' placeholder='Confirmar contraseña' value={confirmar} onChange={e=>setConfirmar(e.target.value)} required className='w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'/>
            <button disabled={loading} className='w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400'>{loading?'Actualizando...':'Cambiar Contraseña'}</button>
            <button type='button' onClick={()=>{setPaso(1); setMsg(''); setError('');}} className='w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400'>Volver</button>
          </form>
        )}
      </div>
    </div>
  );
}