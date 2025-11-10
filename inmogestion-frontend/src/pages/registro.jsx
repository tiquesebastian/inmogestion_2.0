import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  
  const [error, setError] = useState("");
  const [erroresValidacion, setErroresValidacion] = useState({});

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Validación de contraseña fuerte
  const validarContrasena = (password) => {
    const errores = [];
    if (password.length < 8) errores.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("Al menos una mayúscula");
    if (!/[a-z]/.test(password)) errores.push("Al menos una minúscula");
    if (!/[0-9]/.test(password)) errores.push("Al menos un número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errores.push("Al menos un carácter especial (!@#$%^&*...)");
    return errores;
  };

  // Validación de email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validación de teléfono colombiano
  const validarTelefono = (telefono) => {
    const regex = /^[3][0-9]{9}$/; // Formato: 3XXXXXXXXX (10 dígitos empezando en 3)
    return regex.test(telefono);
  };

  // 👉 Paso 2: Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validar en tiempo real
    const nuevosErrores = { ...erroresValidacion };
    
    if (name === "correo" && value) {
      if (!validarEmail(value)) {
        nuevosErrores.correo = "Email inválido";
      } else {
        delete nuevosErrores.correo;
      }
    }

    if (name === "telefono" && value) {
      if (!validarTelefono(value)) {
        nuevosErrores.telefono = "Formato: 3XXXXXXXXX (10 dígitos)";
      } else {
        delete nuevosErrores.telefono;
      }
    }

    if (name === "contrasena" && value) {
      const erroresPass = validarContrasena(value);
      if (erroresPass.length > 0) {
        nuevosErrores.contrasena = erroresPass;
      } else {
        delete nuevosErrores.contrasena;
      }
    }

    setErroresValidacion(nuevosErrores);
  };

  // 👉 Paso 3: Aquí va handleSubmit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validaciones finales
  if (!validarEmail(formData.correo)) {
    setError("Por favor ingresa un email válido");
    return;
  }

  if (formData.telefono && !validarTelefono(formData.telefono)) {
    setError("El teléfono debe tener formato: 3XXXXXXXXX (10 dígitos)");
    return;
  }

  const erroresPass = validarContrasena(formData.contrasena);
  if (erroresPass.length > 0) {
    setError("La contraseña no cumple los requisitos: " + erroresPass.join(", "));
    return;
  }

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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">
            Registro de Usuario
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Solo para administradores autorizados
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-4"
        >
          {/* Grid de 2 columnas en pantallas medianas y grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                placeholder="Tu apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="correo"
              placeholder="tu@email.com"
              value={formData.correo}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                erroresValidacion.correo
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
              required
            />
            {erroresValidacion.correo && (
              <p className="text-red-600 text-xs mt-1">❌ {erroresValidacion.correo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              placeholder="3001234567"
              value={formData.telefono}
              onChange={handleChange}
              maxLength="10"
              className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                erroresValidacion.telefono
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }`}
            />
            {erroresValidacion.telefono && (
              <p className="text-red-600 text-xs mt-1">❌ {erroresValidacion.telefono}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Formato: 3XXXXXXXXX</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario *
            </label>
            <input
              type="text"
              name="nombre_usuario"
              placeholder="usuario123"
              value={formData.nombre_usuario}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={mostrarContrasena ? "text" : "password"}
                name="contrasena"
                placeholder="••••••••"
                value={formData.contrasena}
                onChange={handleChange}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 transition ${
                  erroresValidacion.contrasena
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarContrasena ? "🙈" : "👁️"}
              </button>
            </div>
            {erroresValidacion.contrasena && (
              <ul className="text-red-600 text-xs mt-1 space-y-0.5">
                {erroresValidacion.contrasena.map((err, i) => (
                  <li key={i}>❌ {err}</li>
                ))}
              </ul>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña *
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmar ? "text" : "password"}
                name="confirmar_contrasena"
                placeholder="••••••••"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 transition ${
                  confirmarContrasena && formData.contrasena !== confirmarContrasena
                    ? 'border-red-500 focus:ring-red-500'
                    : confirmarContrasena && formData.contrasena === confirmarContrasena
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarConfirmar ? "🙈" : "👁️"}
              </button>
            </div>
            {confirmarContrasena && formData.contrasena !== confirmarContrasena && (
              <p className="text-red-600 text-xs mt-1">❌ Las contraseñas no coinciden</p>
            )}
            {confirmarContrasena && formData.contrasena === confirmarContrasena && (
              <p className="text-green-600 text-xs mt-1">✅ Las contraseñas coinciden</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clave maestra (Solo administradores) *
            </label>
            <input
              type="password"
              name="clave_maestra"
              placeholder="Clave maestra secreta"
              value={formData.clave_maestra}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            <p className="text-yellow-600 text-xs mt-1">
              ⚠️ Requerida para registro de administrador
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={aceptarTerminos} 
                onChange={(e) => setAceptarTerminos(e.target.checked)}
                required
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm text-gray-700">
                Acepto los{' '}
                <Link 
                  to="/terminos-condiciones" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Términos y Condiciones
                </Link>
                {' '}y la{' '}
                <Link 
                  to="/politica-privacidad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Política de Privacidad
                </Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-800">
              ℹ️ Este formulario es solo para registro de administradores. 
              Los agentes deben ser registrados por un administrador desde el panel de control.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Registrarse como Administrador
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/inmogestion" className="text-blue-600 hover:underline font-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
