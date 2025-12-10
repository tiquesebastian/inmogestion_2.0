import { useState } from "react";
import { useToast } from '../../context/ToastContext.jsx';

export default function RegistrarAgente() {
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    nombre_usuario: "",
    contrasena: "",
    id_rol: "2",  // 2 = Agente
    estado: "Activo"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      nombre_usuario: "",
      contrasena: "",
      id_rol: "2",
      estado: "Activo"
    });
    setError('');
    setSuccess('');
    toastInfo('Formulario reiniciado', 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      let data;
      const contentType = res.headers.get('content-type') || '';
      const textResponse = await res.text();

      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(textResponse);
        } catch (e) {
          throw new Error('Respuesta del servidor no es JSON válido');
        }
      } else {
        throw new Error('Respuesta del servidor no es JSON válido: ' + textResponse);
      }

      if (res.ok) {
        const msg = "✅ Agente registrado. Email de verificación enviado a " + formData.correo;
        setSuccess(msg);
        toastSuccess(msg, 6000);
        limpiarFormulario();
      } else {
        const msgErr = data.message || "No se pudo registrar al agente";
        setError(msgErr);
        toastError(msgErr, 6000);
      }
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      setError(message);
      toastError(message, 6000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        {(error || success) && (
          <div className="sticky top-0 mb-4 z-30">
            <div className={`p-3 rounded-lg shadow ${success ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-red-50 border border-red-300 text-red-700'}`}>{success || error}</div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Registrar Nuevo Agente</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre *</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Nombre real como aparece en documentos.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Apellido *</label>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Apellidos completos para identificación.</p>
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mt-2">Correo electrónico *</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Se usará para verificación y recuperación.</p>

          <label className="block text-sm font-semibold text-gray-700 mt-2">Teléfono *</label>
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Formato nacional sin espacios (Ej: 3001234567).</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nombre de usuario *</label>
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre de usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Visible para clientes y en panel interno.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Contraseña *</label>
              <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres: mayúscula, número y símbolo.</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Registrar Agente
          </button>
          <button
            type="button"
            onClick={limpiarFormulario}
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Limpiar
          </button>
        </form>
      </div>
    </div>
  );
}