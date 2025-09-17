import { useState } from "react";
import { uploadFile } from "../services/api"; // 👈 aquí llamo a mi servicio

export default function CargaMasiva() {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [preview, setPreview] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMensaje("Selecciona un archivo primero");

    try {
      const result = await uploadFile(file);
      setMensaje(result.message);
      setPreview(result.preview);
    } catch (err) {
      setMensaje("❌ Error al subir archivo");
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Carga Masiva</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Subir
        </button>
      </form>

      {mensaje && <p className="mt-4 font-semibold">{mensaje}</p>}

      {preview.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Vista previa</h2>
          <table className="border-collapse border border-gray-400">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
