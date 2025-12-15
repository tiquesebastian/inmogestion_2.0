// src/pages/Login.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ReenviarVerificacion from "../components/ReenviarVerificacion";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipoLogin, setTipoLogin] = useState("cliente"); // "cliente" o "usuario"
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si ya hay sesión iniciada, redirigimos según rol
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      if (user.rol === 1 || user.rol === "Administrador") navigate("/admin/propiedades");
      else if (user.rol === 2 || user.rol === "Agente") navigate("/agente/propiedades");
      else if (user.rol === "cliente") navigate("/cliente/dashboard");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!usuario || !password) {
      setError("Completa todos los campos");
      setLoading(false);
      return;
    }

    try {
      const endpoint = tipoLogin === "cliente" 
        ? "/api/auth/login-cliente"
        : "/api/auth/login";
      
      const body = tipoLogin === "cliente"
        ? { usuario, contrasena: password }
        : { correo: usuario, contrasena: password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Si error 403 (correo no verificado), mostrar componente de reenvío
        if (res.status === 403) {
          setError(data.message || "Correo no verificado");
          setMostrarReenvio(true);
          setLoading(false);
          return;
        }
        throw new Error(data.message || "Error en el login");
      }

      // Guardar token y datos de usuario
      const userData = {
        ...data.usuario,
        token: data.token,
        rol: tipoLogin === "cliente" ? "cliente" : data.usuario.rol,
      };

      login(userData);

      // Redirigir según rol
      setTimeout(() => {
        if (tipoLogin === "cliente") {
          navigate("/cliente/dashboard");
        } else if (data.usuario.rol === 1) {
          navigate("/admin/propiedades");
        } else if (data.usuario.rol === 2) {
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
      <div className="w-full max-w-xl space-y-6">
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-xl">
          <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900">Iniciar Sesión</h1>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          {/* Solo login de cliente, sin selector */}

          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            type="text"
            placeholder={tipoLogin === "cliente" ? "Usuario o correo electrónico" : "Correo electrónico"}
            className="w-full text-lg p-4 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
            className="w-full text-lg p-4 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mb-6 text-right">
            <Link 
              to={tipoLogin === "cliente" ? "/forgot-password-cliente" : "/forgot-password"} 
              className="text-blue-600 hover:underline text-sm"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta? <Link to="/registro-cliente" className="text-blue-600 hover:underline font-semibold">Regístrate aquí</Link>
            </p>
          </div>
        </form>

        {/* Mostrar componente de reenvío si correo no verificado */}
        {mostrarReenvio && (
          <ReenviarVerificacion tipo={tipoLogin} />
        )}
      </div>
    </div>
  );
}
