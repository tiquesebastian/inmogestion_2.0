import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import AuthContext from "../context/AuthContext";


export default function Registro() {
  // Estados para el formulario y validación
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    nombre_usuario: "",
    contrasena: "",
    id_rol: "1",   // 1 = Administrador
    clave_maestra: "",
    estado: "Activo"
  });
  
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  
  const [error, setError] = useState("");

  // 👉 Paso 2: Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 👉 Paso 3: Aquí va handleSubmit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validar que las contraseñas coincidan
  if (formData.contrasena !== confirmarContrasena) {
    setError("Las contraseñas no coinciden");
    return;
  }

  // Validar que aceptó los términos
  if (!aceptarTerminos) {
    setError("Debes aceptar los términos y condiciones");
    return;
  }

  // Validar clave maestra (esto deberías cambiarlo por tu clave real)
  const CLAVE_MAESTRA = "Admin2023!"; // Ejemplo - cámbiala por tu clave segura
  if (formData.clave_maestra !== CLAVE_MAESTRA) {
    setError("Clave maestra incorrecta. Este registro es solo para administradores.");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        // No enviamos la clave maestra al backend
        clave_maestra: undefined
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registro exitoso");

      // Si el backend retorna el usuario creado (user, usuario o similar), lo usamos
      const returnedUser = data.user || data.usuario || data;

      // Si tenemos suficiente info, iniciamos sesión automáticamente
      if (returnedUser && (returnedUser.rol || returnedUser.id_rol || returnedUser.role)) {
        // Mapear rol por si viene numérico
        let rolName = returnedUser.rol || returnedUser.role || null;
        if (!rolName && returnedUser.id_rol) {
          // Convenciones: 1->Administrador, 2->Agente, 3->Cliente
          rolName = returnedUser.id_rol === 1 || returnedUser.id_rol === "1" ? "Administrador" : returnedUser.id_rol === 2 || returnedUser.id_rol === "2" ? "Agente" : "Usuario";
        }

        const userData = {
          id: returnedUser.id || returnedUser._id || Date.now(),
          nombre: returnedUser.nombre || formData.nombre || formData.nombre_usuario,
          email: returnedUser.correo || formData.correo,
          rol: rolName || (formData.id_rol === "1" ? "Administrador" : formData.id_rol === "2" ? "Agente" : "Usuario"),
        };

        // Guardar en contexto/localStorage
        login(userData);

        // Redirigir según rol
        if (userData.rol === "Administrador") navigate("/admin");
        else if (userData.rol === "Agente") navigate("/agente");
        else navigate("/");
      }

      // 👉 Enviar notificación por correo con EmailJS
      emailjs
        .send(
          "service_xxx",   // tu Service ID de EmailJS
          "template_xxx",  // tu Template ID de EmailJS
          {
            nombre: formData.nombre,
            correo: formData.correo,
            usuario: formData.nombre_usuario,
          },
          "publicKey_xxx"  // tu Public Key de EmailJS
        )
        .then(() => {
          console.log("📧 Correo enviado correctamente");
        })
        .catch((err) => {
          console.error("❌ Error enviando correo:", err);
        });

      // limpiar campos
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        nombre_usuario: "",
        contrasena: "",
        id_rol: "3",
        clave_maestra: "",
        estado: "Activo"
      });
      setConfirmarContrasena("");
      setAceptarTerminos(false);

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

        <input
          type="password"
          name="confirmar_contrasena"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          className={`w-full p-2 border rounded-lg ${
            confirmarContrasena && formData.contrasena !== confirmarContrasena
              ? 'border-red-500'
              : ''
          }`}
          required
        />
        {confirmarContrasena && formData.contrasena !== confirmarContrasena && (
          <p className="text-red-600 text-sm">Las contraseñas no coinciden</p>
        )}
        {confirmarContrasena && formData.contrasena === confirmarContrasena && (
          <p className="text-green-600 text-sm">✓ Las contraseñas coinciden</p>
        )}

        <input
          type="password"
          name="clave_maestra"
          placeholder="Clave maestra (requerida para registro de administrador)"
          value={formData.clave_maestra}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <div className="mb-4">
          <label className="flex items-start gap-2">
            <input 
              type="checkbox" 
              checked={aceptarTerminos} 
              onChange={(e) => setAceptarTerminos(e.target.checked)}
              required
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              Acepto los{' '}
              <a 
                href="/terminos-condiciones" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Términos y Condiciones
              </a>
            </span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          * Este formulario es solo para registro de administradores. 
          Los agentes deben ser registrados por un administrador desde el panel de control.
        </p>

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
