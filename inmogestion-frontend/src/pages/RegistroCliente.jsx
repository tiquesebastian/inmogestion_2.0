import { useNavigate, Link } from "react-router-dom";
import ClientRegistration from "../components/ClientRegistration";

/**
 * Página de Registro de Clientes
 * Permite a nuevos clientes crear una cuenta
 */
export default function RegistroCliente() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirigir al login después de registro exitoso
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Crear Cuenta de Cliente</h1>
          <p className="text-gray-600 mt-2">
            Completa el formulario para registrarte
          </p>
        </div>

        <ClientRegistration onSuccess={handleSuccess} />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
