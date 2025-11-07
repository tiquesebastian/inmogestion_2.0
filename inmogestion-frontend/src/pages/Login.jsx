// src/pages/Login.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si ya hay sesión iniciada, redirigimos según rol
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      if (user.rol === "Administrador") navigate("/admin");
      else if (user.rol === "Agente") navigate("/agente");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Ingresa un correo");
      return;
    }

    // Simulación simple de autenticación local.
    // Asumo: correo que contiene 'admin' => Administrador, 'agente' => Agente, si no => Usuario.
    const lower = email.toLowerCase();
    let rol = "Usuario";
    if (lower.includes("admin")) rol = "Administrador";
    else if (lower.includes("agente")) rol = "Agente";

    const userData = {
      id: Date.now(),
      nombre: email.split("@")[0],
      email,
      rol,
    };

    // Guardamos sesión
    login(userData);

    // Redirigimos según rol después de un pequeño delay para que el contexto se actualice
    setTimeout(() => {
      if (rol === "Administrador") navigate("/admin/propiedades");
      else if (rol === "Agente") navigate("/agente/propiedades");
      else navigate("/");
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900">Iniciar Sesión</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Correo electrónico"
          className="w-full text-lg p-4 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          className="w-full text-lg p-4 border border-gray-300 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
    </div>
  );
}
