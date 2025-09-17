import { useState } from "react";

export default function Registro() {
  // 👉 Paso 1: Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    nombre_usuario: "",
    contrasena: "",
    id_rol: "3",   // Cliente por defecto
    estado: "Activo"
  });

  // 👉 Paso 2: Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 👉 Paso 3: Aquí va tu handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recargar la página

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registro exitoso");
        // limpiar campos
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          nombre_usuario: "",
          contrasena: "",
          id_rol: "3",
          estado: "Activo"
        });
      } else {
        alert("❌ Error: " + (data.message || "No se pudo registrar"));
      }
    } catch (err) {
  alert("❌ Error de conexión con el servidor: " + err.message);
}
  };

  // 👉 Paso 4: Formulario que usa handleChange y handleSubmit
  return (
    <section className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 text-center">
        Registro de Usuario
      </h2>

      <form
        onSubmit={handleSubmit}  // 🔥 aquí conectamos handleSubmit
        className="mt-6 bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="nombre_usuario"
          placeholder="Nombre de usuario"
          value={formData.nombre_usuario}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <select
          name="id_rol"
          value={formData.id_rol}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="1">Administrador</option>
          <option value="2">Agente</option>
          <option value="3">Cliente</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
        >
          Registrarse
        </button>
      </form>
    </section>
  );
}
