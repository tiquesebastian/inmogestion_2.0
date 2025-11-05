import { useState, useEffect } from "react";
import emailjs from "emailjs-com";

export default function RegistrarAgente() {
  useEffect(() => {
    try {
      emailjs.init("Fd4EJ47WZOjVtiHy5");
      console.log("EmailJS inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar EmailJS:", error);
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log('Enviando datos:', formData);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      console.log('Respuesta del servidor:', res.status);

      let data;
      const contentType = res.headers.get('content-type') || '';
      const textResponse = await res.text();
      console.log('Respuesta texto:', textResponse);

      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(textResponse);
        } catch (e) {
          console.error('Error al parsear JSON:', e);
          throw new Error('Respuesta del servidor no es JSON válido');
        }
      } else {
        // Si el backend responde HTML o texto, mostramos el contenido en el error
        throw new Error('Respuesta del servidor no es JSON válido: ' + textResponse);
      }

      if (res.ok) {
        setSuccess("✅ Agente registrado exitosamente");

        // Enviar notificación por correo al nuevo agente — usamos await para capturar errores
        try {
          console.log("Intentando enviar correo con EmailJS...");
          await emailjs.send(
            "service_lb1hrlq",
            "template_pblasyg",
            {
              nombre: formData.nombre,
              correo: formData.correo,
              usuario: formData.nombre_usuario,
            },
            "Fd4EJ47WZOjVtiHy5"
          );
          console.log("📧 Correo enviado al nuevo agente");
        } catch (err) {
          console.error("❌ Error enviando correo:", err);
          // Mostrar un mensaje no bloqueante al usuario pero no revertir el registro
          setError("Agente creado, pero no se pudo enviar el correo de notificación.");
        }

        // Limpiar formulario
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
      } else {
        setError(data.message || "No se pudo registrar al agente");
      }
    } catch (err) {
      // Mostrar mensaje directo del error para que el usuario vea la causa real
      const message = err && err.message ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Registrar Nuevo Agente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Registrar Agente
        </button>
      </form>
    </div>
    </div>
  );
}