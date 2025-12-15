import { useState, useEffect } from "react";
import { getClientes } from "../services/api"; // Para listar clientes

export default function CargaMasiva() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("cedula");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMensaje("⚠️ Selecciona un archivo");
      return;
    }
    if (!clienteSeleccionado) {
      setMensaje("⚠️ Selecciona un cliente");
      return;
    }

    setCargando(true);
    setMensaje("");

    try {
      const formData = new FormData();
      formData.append('documento', file);
      formData.append('cliente_id', clienteSeleccionado);
      formData.append('tipo_documento', tipoDocumento);
      formData.append('descripcion', descripcion);

      const response = await fetch('/api/documentos-clientes/subir', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      let result = { message: '' };
      try {
        result = await response.json();
      } catch (_) {
        result = { message: response.ok ? 'Documento subido correctamente' : 'Error al subir documento' };
      }

      if (response.ok) {
        setMensaje(`✅ ${result.message}`);
        // Limpiar formulario
        setFile(null);
        setDescripcion("");
        document.getElementById('fileInput').value = '';
      } else {
        setMensaje(`❌ ${result.error || 'Error al subir documento'}`);
      }
    } catch (err) {
      setMensaje("❌ Error al subir archivo");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">📂 Carga de Documentos</h1>
      <p className="text-gray-600 mb-6">
        Sube documentos de clientes (cédulas, comprobantes, escrituras, etc.)
      </p>
      {clienteSeleccionado && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            Este documento se registrará para el cliente seleccionado.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-5">
        
        {/* Seleccionar Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre_cliente} {cliente.apellido_cliente} - {cliente.correo_cliente}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Documento */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Documento *
          </label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="cedula">Cédula de Identidad</option>
            <option value="comprobante_ingresos">Comprobante de Ingresos</option>
            <option value="comprobante_domicilio">Comprobante de Domicilio</option>
            <option value="escrituras">Escrituras</option>
            <option value="carta_autorizacion">Carta de Autorización</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Cédula frontal y reverso"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            rows="2"
          />
        </div>

        {/* Archivo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Archivo * (PDF, JPG, PNG, DOC - Máx 10MB)
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="text-sm text-gray-600 mt-2">
              Archivo seleccionado: <span className="font-semibold">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={cargando}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            cargando 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {cargando ? '⏳ Subiendo...' : '📤 Subir Documento'}
        </button>
      </form>

      {/* Mensaje de resultado */}
      {mensaje && (
        <div className={`mt-6 p-4 rounded-lg ${
          mensaje.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="font-semibold text-center">{mensaje}</p>
        </div>
      )}
    </div>
  );
}
