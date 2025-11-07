/**
 * Página de Política de Privacidad
 * Información legal sobre el tratamiento de datos personales
 * Cumplimiento con normativas de protección de datos
 */
const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header con logo */}
        <div className="text-center mb-12">
          <img 
            src="/logo.png" 
            alt="Grupo Inmobiliario Cortés" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Política de Privacidad
          </h1>
          <p className="text-gray-600 text-lg">
            Grupo Inmobiliario Cortés
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Última actualización: 5 de noviembre de 2025
          </p>
        </div>

        {/* Contenido en card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Introducción */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Introducción</h2>
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold text-blue-600">Grupo Inmobiliario Cortés</span> utiliza la plataforma <span className="font-semibold text-gray-800">InmoGestión</span> para la gestión de sus servicios inmobiliarios. Respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos su información.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Información que recopilamos */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Información que Recopilamos</h2>
                  <p className="text-gray-700 mb-4">Recopilamos información que usted nos proporciona directamente, incluyendo:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Datos de identificación:</strong> Nombre completo, documento de identidad, fecha de nacimiento</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Datos de contacto:</strong> Dirección de correo electrónico, número de teléfono, dirección física</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Información de propiedad:</strong> Preferencias de búsqueda, propiedades de interés, historial de visitas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span><strong>Datos financieros:</strong> Información necesaria para transacciones y verificación de capacidad financiera</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Uso de la información */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Uso de la Información</h2>
                  <p className="text-gray-700 mb-4">Utilizamos su información personal para:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Proporcionar y gestionar nuestros servicios inmobiliarios</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Programar y coordinar visitas a propiedades</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Enviar notificaciones sobre propiedades que coincidan con sus preferencias</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Procesar transacciones y gestionar contratos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Mejorar nuestros servicios y experiencia del usuario</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Cumplir con obligaciones legales y regulatorias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Protección de datos */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Protección y Seguridad</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, pérdida, destrucción o alteración. Esto incluye:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Encriptación de datos sensibles
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Acceso restringido a personal autorizado
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Monitoreo continuo de sistemas
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Copias de seguridad regulares
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Sus derechos */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Sus Derechos</h2>
                  <p className="text-gray-700 mb-4">Usted tiene derecho a:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Acceder</p>
                      <p className="text-sm text-gray-600">A sus datos personales</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Rectificar</p>
                      <p className="text-sm text-gray-600">Información incorrecta</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Eliminar</p>
                      <p className="text-sm text-gray-600">Sus datos personales</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Oponerse</p>
                      <p className="text-sm text-gray-600">Al procesamiento</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Portabilidad</p>
                      <p className="text-sm text-gray-600">De sus datos</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">✓ Revocar</p>
                      <p className="text-sm text-gray-600">Consentimientos</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Contacto */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Contacto</h2>
                  <p className="text-gray-700 mb-4">
                    Para ejercer sus derechos o si tiene preguntas sobre esta política de privacidad, puede contactarnos:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <strong>Email:</strong> <a href="mailto:privacidad@inmobiliariocortes.com" className="text-blue-600 hover:text-blue-700 underline">privacidad@inmobiliariocortes.com</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Teléfono:</strong> <a href="tel:+573001234567" className="text-blue-600 hover:text-blue-700">+57 300 123 4567</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Dirección:</strong> Bogotá, Colombia
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Derechos reservados */}
            <section className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <div className="text-center">
                <img 
                  src="/logo.png" 
                  alt="Grupo Inmobiliario Cortés" 
                  className="h-16 w-auto mx-auto mb-4 opacity-90"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  © 2025 InmoGestión
                </h3>
                <p className="text-gray-600 mb-3">
                  Todos los derechos reservados
                </p>
                <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-4">
                  <strong>InmoGestión</strong> es una plataforma de gestión inmobiliaria. Todo el contenido de esta aplicación, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes, código fuente, diseño y funcionalidades, son propiedad de InmoGestión y están protegidos por las leyes de derechos de autor y propiedad intelectual nacionales e internacionales.
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200 inline-block">
                  <p className="text-xs text-gray-600">
                    <strong>Cliente:</strong> Grupo Inmobiliario Cortés<br />
                    <strong>Plataforma:</strong> InmoGestión
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Botón volver */}
        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;