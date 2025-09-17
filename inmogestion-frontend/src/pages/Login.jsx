// src/pages/Login.jsx
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-12 rounded-lg shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900">
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full text-lg p-4 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full text-lg p-4 border border-gray-300 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
