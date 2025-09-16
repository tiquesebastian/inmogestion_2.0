// Importamos hooks de React y funciones para navegación y contexto de autenticación
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// Importamos la función login desde el servicio de autenticación
import { login as loginService } from "../services/authService";

function Login() {
  // Estado para almacenar el correo ingresado por el usuario
  const [correo, setCorreo] = useState("");
  // Estado para almacenar la contraseña ingresada por el usuario
  const [contrasena, setContrasena] = useState("");
  // Estado para mostrar mensajes de error en el formulario
  const [error, setError] = useState("");
  // Obtenemos la función login del contexto de autenticación
  const { login } = useContext(AuthContext);
  // Hook para redirigir al usuario a otra ruta
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError(""); // Resetea cualquier error previo

    try {
      // Llama al servicio de login enviando correo y contraseña
      const data = await loginService(correo, contrasena);

      // Valida que la respuesta tenga un token válido
      if (!data || !data.token) {
        throw new Error("Respuesta inválida del servidor");
      }

      // Si es correcto, se guarda el token y demás datos en el contexto
      login(data);

      // Redirige al usuario a la página principal o dashboard
      navigate("/");
    } catch (err) {
      // Si hay error, se muestra en consola y se actualiza el estado para mostrar mensaje al usuario
      console.error("Error en login:", err);
      setError(
        err.response?.data?.message || // Mensaje del backend, si existe
        err.message ||                 // Mensaje del error capturado
        "Error al iniciar sesión"     // Mensaje genérico por defecto
      );
    }
  };

  return (
    // Contenedor centrado vertical y horizontalmente con fondo gris claro
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Formulario con fondo blanco, sombra y bordes redondeados */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center">InmoGestión</h2>

        {/* Si hay un error, se muestra un mensaje rojo */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</p>
        )}

        {/* Campo para ingresar correo */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)} // Actualiza estado correo al cambiar input
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Campo para ingresar contraseña */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)} // Actualiza estado contraseña al cambiar input
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="********"
            required
          />
        </div>

        {/* Botón para enviar formulario */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
