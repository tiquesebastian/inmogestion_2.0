// Componente principal de la aplicación  
export default function App() {
  return (
    // Contenedor principal con estilos generales de la página
    <main className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* ================= ENCABEZADO ================= */}
      {/* Header con logo, navegación y menú móvil */}  
      <header className="bg-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo de la aplicación */}
          <h1 className="text-white text-2xl font-bold tracking-wide">InmoGestión</h1>

          {/* Menú de navegación para escritorio */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex gap-8 text-lg"
          >
            <a
              href="#"
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Propiedades
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Agentes
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-yellow-400 transition"
            >
              Contacto
            </a>
          </nav>

          {/* Botón menú móvil (solo visible en pantallas pequeñas) */}
          <button
            className="md:hidden text-white focus:outline-none"
            aria-label="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ================= SECCIÓN PRINCIPAL ================= */}
      {/* Presentación y llamado a la acción principal */}
      <section className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold text-blue-900">
          Bienvenido a InmoGestión
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          Gestiona, publica y vende tus propiedades de forma rápida, sencilla y
          organizada.
        </p>

        {/* Botón principal para explorar propiedades */}
        <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-md transition">
          Explorar Propiedades
        </button>
      </section>

      {/* ================= TARJETAS DE EJEMPLO ================= */}
      {/* Sección de tarjetas destacando tipos de propiedades */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Casas */}
        <div className="bg-white shadow-lg rounded-xl p-6 border hover:scale-[1.02] transition">
          <h3 className="text-xl font-bold text-blue-800">Casas</h3>
          <p className="mt-2 text-gray-600">
            Explora las mejores casas disponibles para la venta.
          </p>
          <button className="mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition">
            Ver Casas
          </button>
        </div>

        {/* Tarjeta 2: Apartamentos */}
        <div className="bg-white shadow-lg rounded-xl p-6 border hover:scale-[1.02] transition">
          <h3 className="text-xl font-bold text-blue-800">Apartamentos</h3>
          <p className="mt-2 text-gray-600">
            Encuentra apartamentos modernos en las mejores zonas.
          </p>
          <button className="mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition">
            Ver Apartamentos
          </button>
        </div>

        {/* Tarjeta 3: Lotes */}
        <div className="bg-white shadow-lg rounded-xl p-6 border hover:scale-[1.02] transition">
          <h3 className="text-xl font-bold text-blue-800">Lotes</h3>
          <p className="mt-2 text-gray-600">
            Invierte en lotes estratégicamente ubicados.
          </p>
          <button className="mt-4 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition">
            Ver Lotes
          </button>
        </div>
      </section>

      {/* ================= PIE DE PÁGINA ================= */}
      {/* Footer con derechos de autor */}
      <footer className="bg-blue-900 text-gray-200 text-center py-6 mt-auto">
        <p>&copy; 2025 InmoGestión. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
