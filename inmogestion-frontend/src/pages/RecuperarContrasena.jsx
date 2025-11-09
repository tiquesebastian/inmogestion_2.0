import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Componente RecuperarContrasena
 * Permite a usuarios y clientes solicitar un token de recuperación
 * y resetear su contraseña con ese token
 */
export default function RecuperarContrasena() {
  const [paso, setPaso] = useState(1); // 1: solicitar, 2: resetear
  const [tipoUsuario, setTipoUsuario] = useState("cliente"); // "cliente" o "usuario"
  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = tipoUsuario === "cliente"
        ? "http://localhost:4000/api/auth/recuperar"
        : "http://localhost:4000/api/auth/recuperar-usuario";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al solicitar recuperación");
      }

      setSuccess(`Token generado: ${data.token}. Cópialo para el siguiente paso.`);
      setToken(data.token);
      setPaso(2);
    } catch (err) {
      setError(err.message || "No se pudo solicitar la recuperación");
    }

    setLoading(false);
  };

  const handleResetear = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const endpoint = tipoUsuario === "cliente"
        ? "http://localhost:4000/api/auth/resetear"
        : "http://localhost:4000/api/auth/resetear-usuario";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al resetear contraseña");
      }

      setSuccess("¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.");
      setToken("");
      setNueva("");
      setConfirmar("");
      setPaso(1);
    } catch (err) {
      setError(err.message || "No se pudo resetear la contraseña");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Recuperar Contraseña
        </h1>

        {/* Selector de tipo de usuario */}
        <div className="mb-6 flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setTipoUsuario("cliente")}
            className={`px-4 py-2 rounded font-semibold transition ${
              tipoUsuario === "cliente"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setTipoUsuario("usuario")}
            className={`px-4 py-2 rounded font-semibold transition ${
              tipoUsuario === "usuario"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Agente/Admin
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {paso === 1 ? (
          <form onSubmit={handleSolicitar}>
            <p className="mb-4 text-gray-600">
              Ingresa tu correo electrónico para recibir un token de recuperación.
            </p>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
              required
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Enviando..." : "Solicitar Token"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetear}>
            <p className="mb-4 text-gray-600">
              Ingresa el token que recibiste y tu nueva contraseña.
            </p>

            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token de recuperación"
              required
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              placeholder="Nueva contraseña"
              required
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 mb-2"
            >
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>

            <button
              type="button"
              onClick={() => setPaso(1)}
              className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-400 transition"
            >
              Volver
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
