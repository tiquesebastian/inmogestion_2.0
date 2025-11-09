import { Link } from "react-router-dom";

/**
 * Página de Términos y Condiciones
 * Detalla las condiciones de uso del servicio de InmoGestión
 */
export default function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Términos y Condiciones
        </h1>
        
        <p className="text-gray-600 mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Aceptación de los Términos
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Al acceder y utilizar la plataforma InmoGestión (en adelante, "la Plataforma"), 
            operada por Grupo Inmobiliario Cortés, usted acepta cumplir con estos Términos y Condiciones. 
            Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Descripción del Servicio
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            InmoGestión es una plataforma digital diseñada para facilitar la gestión inmobiliaria, 
            permitiendo a los usuarios:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Buscar y visualizar propiedades disponibles</li>
            <li>Agendar visitas a propiedades</li>
            <li>Registrar interés en propiedades específicas</li>
            <li>Contactar con agentes inmobiliarios</li>
            <li>Gestionar información personal relacionada con búsquedas inmobiliarias</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Registro y Cuenta de Usuario
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para acceder a ciertas funcionalidades, deberá crear una cuenta proporcionando información 
            veraz, completa y actualizada. Usted es responsable de:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            <li>Asegurar que la información proporcionada sea precisa y esté actualizada</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Uso Aceptable
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Al utilizar la Plataforma, usted se compromete a:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>No utilizar la Plataforma para fines ilegales o no autorizados</li>
            <li>No intentar obtener acceso no autorizado a sistemas o datos</li>
            <li>No enviar información falsa o engañosa</li>
            <li>No interferir con el funcionamiento normal de la Plataforma</li>
            <li>Respetar los derechos de propiedad intelectual</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Protección de Datos Personales
          </h2>
          <p className="text-gray-700 leading-relaxed">
            La recopilación, uso y protección de sus datos personales se rige por nuestra{' '}
            <Link to="/politica-privacidad" className="text-blue-600 hover:underline">
              Política de Privacidad
            </Link>
            . Al aceptar estos Términos, también acepta el tratamiento de sus datos conforme 
            a dicha política.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Propiedad Intelectual
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Todo el contenido de la Plataforma, incluyendo textos, gráficos, logotipos, iconos, 
            imágenes, clips de audio y software, es propiedad de Grupo Inmobiliario Cortés o de 
            sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Limitación de Responsabilidad
          </h2>
          <p className="text-gray-700 leading-relaxed">
            La Plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos 
            que el servicio será ininterrumpido, libre de errores o completamente seguro. 
            Grupo Inmobiliario Cortés no será responsable por daños directos, indirectos, 
            incidentales o consecuentes derivados del uso de la Plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Modificaciones del Servicio
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto 
            de la Plataforma en cualquier momento, sin previo aviso. No seremos responsables 
            ante usted o terceros por cualquier modificación, suspensión o discontinuación 
            del servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Terminación
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos suspender o terminar su acceso a la Plataforma inmediatamente, sin previo 
            aviso, si consideramos que ha violado estos Términos y Condiciones o por cualquier 
            otra razón que consideremos apropiada.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            10. Ley Aplicable y Jurisdicción
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Estos Términos y Condiciones se rigen por las leyes de Colombia. Cualquier disputa 
            relacionada con estos términos será sometida a la jurisdicción exclusiva de los 
            tribunales competentes de Colombia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            11. Contacto
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de:
          </p>
          <ul className="list-none text-gray-700 space-y-2 mt-4 ml-4">
            <li><strong>Email:</strong> info@inmogestion.com</li>
            <li><strong>Teléfono:</strong> +57 (XXX) XXX-XXXX</li>
            <li><strong>Dirección:</strong> Calle XX #XX-XX, Ciudad, Colombia</li>
          </ul>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 text-center">
            Al utilizar InmoGestión, usted reconoce que ha leído, entendido y aceptado estos 
            Términos y Condiciones en su totalidad.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
