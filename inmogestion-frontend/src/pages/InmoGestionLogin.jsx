import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

/**
 * Login exclusivo para administradores y agentes
 * Ruta: /inmogestion
 */
export default function InmoGestionLogin() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!correo || !password) {
      setError("Completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en el login");

      // Guardar token y datos de usuario
      const userData = {
        ...data.usuario,
        token: data.token,
        rol: data.usuario.rol,
      };
      login(userData);

      // Redirigir según rol
      setTimeout(() => {
        if (userData.rol === 1 || userData.rol === "Administrador") {
          navigate("/admin/propiedades");
        } else if (userData.rol === 2 || userData.rol === "Agente") {
          navigate("/agente/propiedades");
        } else {
          navigate("/");
        }
      }, 100);
    } catch (err) {
      setError(err.message || "Credenciales inválidas");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-extrabold mb-8 text-center text-blue-900">InmoGestión - Acceso Interno</h1>
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        <div className="mb-2">
          <input
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          type="email"
          placeholder="Correo de administrador o agente"
          className="w-full text-lg p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div className="mb-4">
          <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          className="w-full text-lg p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          <div className="text-right mt-2">
            <a href="/recuperar-contrasena-usuario" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white text-lg font-semibold py-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta de admin/agente? <a href="/registro" className="text-blue-600 hover:underline font-semibold">Regístrate aquí</a>
          </p>
        </div>
      </form>
    </div>
  );
}
