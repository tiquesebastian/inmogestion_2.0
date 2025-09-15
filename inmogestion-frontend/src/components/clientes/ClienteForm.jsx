import { useState } from "react";

function ClienteForm({ onAdd }) {
  const [form, setForm] = useState({
    nombre_cliente: "",
    apellido_cliente: "",
    documento_cliente: "",
    correo_cliente: "",
    telefono_cliente: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form); // 👈 se envía al padre (ClientesList)
    setForm({
      nombre_cliente: "",
      apellido_cliente: "",
      documento_cliente: "",
      correo_cliente: "",
      telefono_cliente: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
      <h2 className="text-lg font-bold mb-2">Agregar Cliente</h2>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          name="nombre_cliente"
          placeholder="Nombre"
          value={form.nombre_cliente}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="apellido_cliente"
          placeholder="Apellido"
          value={form.apellido_cliente}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="documento_cliente"
          placeholder="Documento"
          value={form.documento_cliente}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="correo_cliente"
          placeholder="Correo"
          value={form.correo_cliente}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="telefono_cliente"
          placeholder="Teléfono"
          value={form.telefono_cliente}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </form>
  );
}

export default ClienteForm;
