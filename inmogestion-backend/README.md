# 🏡 InmoGestión – Backend

Bienvenido al backend de **InmoGestión**, una plataforma de gestión inmobiliaria que permite administrar clientes, propiedades, contratos, reportes, historial de estados e interacciones entre agentes y clientes.

Desarrollado con **Node.js**, **Express** y **MySQL**.

---

## 🚀 Tecnologías principales

- **Node.js** (v18+)
- **Express.js**
- **MySQL**
- **JWT** para autenticación
- **Dotenv** para variables de entorno
- **Nodemon** para desarrollo
- **Bruno/Postman** para pruebas

---

## 📂 Estructura del Proyecto

inmogestion-backend/
│
├── src/
│ ├── config/ # Configuración de conexión a MySQL
│ ├── controllers/ # Controladores de cada entidad
│ ├── models/ # Consultas SQL (modelo de datos)
│ ├── routes/ # Definición de rutas (endpoints)
│ ├── middleware/ # Middlewares de seguridad, validación, etc.
│ └── server.js # Punto de entrada del servidor
│
├── .env # Variables de entorno
├── package.json
└── README.md

yaml
Copiar código

---

## ⚙️ Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://dev.mysql.com/downloads/)
- [NPM](https://www.npmjs.com/)

---

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inmogestion
JWT_SECRET=clave_secreta
▶️ Cómo ejecutar el proyecto
Clona este repositorio

bash
Copiar código
git clone https://github.com/usuario/inmogestion-backend.git
cd inmogestion-backend
Instala las dependencias

bash
Copiar código
npm install
Ejecuta el servidor

bash
Copiar código
npm run dev
Verifica que esté funcionando

Navega a: http://localhost:3000

🛢️ Base de Datos
El sistema utiliza MySQL como motor de base de datos. Las principales tablas son:

usuario (roles: administrador, agente)

cliente

propiedad

contrato

reporte_ventas

historial_estado_propiedad

interaccion_cliente

auditoria (registro de acciones críticas)

📝 Ejecuta el archivo database.sql para crear las tablas necesarias.

🔐 Autenticación y Seguridad
Se usa JWT (JSON Web Token) para manejar sesiones y autenticación.

Middleware authMiddleware.js protege las rutas privadas.

Soporte para roles:

Administrador: acceso completo al sistema

Agente: acceso limitado a clientes, propiedades e interacciones

📌 Endpoints disponibles
👤 Clientes
Método	Endpoint	Descripción
| Método | Endpoint            | Descripción        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/clientes`     | Listar clientes    |
| POST   | `/api/clientes`     | Crear cliente      |
| PUT    | `/api/clientes/:id` | Actualizar cliente |
| DELETE | `/api/clientes/:id` | Eliminar cliente   |

🏠 Propiedades
Método	Endpoint	Descripción
| Método | Endpoint               | Descripción                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/api/propiedades`     | Listar propiedades            |
| POST   | `/api/propiedades`     | Crear propiedad               |
| GET    | `/api/propiedades/:id` | Ver propiedad por ID          |
| PUT    | `/api/propiedades/:id` | Actualizar propiedad          |
| DELETE | `/api/propiedades/:id` | Eliminar propiedad (opcional) |


📄 Contratos
Método	Endpoint	Descripción
| Método | Endpoint                            | Descripción             |
| ------ | ----------------------------------- | ----------------------- |
| GET    | `/api/contratos`                    | Listar contratos        |
| POST   | `/api/contratos`                    | Crear contrato          |
| PUT    | `/api/contratos/:id`                | Actualizar contrato     |
| GET    | `/api/contratos/cliente/:idCliente` | Contratos por cliente   |
| GET    | `/api/contratos/propiedad/:idProp`  | Contratos por propiedad |


📊 Reportes

Todos los endpoints se encuentran bajo la ruta base: /api/reportes

| Método | Endpoint                   | Descripción                                                                  |
| ------ | -------------------------- | ---------------------------------------------------------------------------- |
| POST   | `/`                        | Crear nuevo reporte de ventas                                                |
| GET    | `/`                        | Listar todos los reportes                                                    |
| GET    | `/:id`                     | Obtener reporte por ID                                                       |
| GET    | `/ventas-rango`            | Calcular total de ventas en un rango de fechas (`fecha_inicio`, `fecha_fin`) |
| GET    | `/usuario/:idUsuario`      | Mostrar reportes generados por un usuario específico                         |
| GET    | `/especial/agentes`        | Reporte especial de agentes                                                  |
| GET    | `/filtrar-fechas`          | Filtrar reportes por rango de fechas (`startDate`, `endDate`)                |
| GET    | `/propiedades-disponibles` | Ver propiedades disponibles                                                  |
| GET    | `/propiedades-vendidas`    | Ver propiedades vendidas                                                     |

🧪 Ejemplo de petición para ventas por rango
GET /api/reportes/ventas-rango?fecha_inicio=2025-01-01&fecha_fin=2025-12-31

🕓 Historial de Estados de Propiedades

| Método | Endpoint         | Descripción                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/historial` | Obtener historial de cambios |
| POST   | `/api/historial` | Registrar cambio de estado   |

💬 Interacciones con Clientes

| Método | Endpoint                 | Descripción                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/api/interacciones`     | Listar interacciones registradas |
| POST   | `/api/interacciones`     | Registrar nueva interacción      |
| DELETE | `/api/interacciones/:id` | Eliminar interacción             |

🛡️ Auditoría del sistema
Cada acción crítica realizada en el sistema queda registrada en la tabla auditoria, incluyendo:

Usuario responsable

Acción realizada (crear, actualizar, eliminar)

Fecha y hora exacta

Tabla afectada

🧪 Pruebas con Bruno / Postman
Se recomienda utilizar Bruno o Postman para probar los endpoints REST.

Puedes importar una colección de pruebas en la carpeta /tests.

✅ Estado del Proyecto
 Conexión a base de datos MySQL

 CRUD de clientes y propiedades

 Gestión de contratos

 Reportes y estadísticas

 Historial de estados de propiedades

 Interacciones cliente-agente

 Seguridad por roles (JWT)

 Documentación con Swagger (pendiente)

 Tests automatizados (opcional)

👥 Equipo de Desarrollo
👨‍💻 Juan Sebastian Tique Rodriguez

👩‍💻 Yosman FERNANDO Espinosa

👨‍💻 Yair Esteban Peña

📬 Contacto
¿Dudas o sugerencias? Escríbenos a: tiquesebastian53@gmail.com


---

### ✅ Siguientes pasos (si querés mejorar aún más el proyecto):
- Agregar documentación con **Swagger** (`swagger-ui-express`)
- Implementar validaciones con **Joi** o **express-validator**
- Tests automáticos con **Jest** o **Supertest**
- CI/CD con **GitHub Actions** o **Render**