# 🏡 InmoGestión - Backend

Backend del sistema **InmoGestión**, una aplicación para la gestión inmobiliaria.  
Desarrollado con **Node.js + Express + MySQL**.

---

## ⚙️ Requisitos previos

Antes de ejecutar este proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://dev.mysql.com/downloads/)
- [NPM](https://www.npmjs.com/)

---

## 📂 Estructura de carpetas

inmogestion-backend/
│── src/
│ ├── config/ # Configuración de la BD y entorno
│ ├── controllers/ # Lógica de negocio
│ ├── models/ # Consultas SQL
│ ├── routes/ # Definición de rutas
│ └── server.js # Punto de entrada
│
│── .env # Variables de entorno
│── package.json
│── README.md

yaml
Copiar
Editar

---

## 🔑 Variables de entorno (.env)

En la raíz del proyecto crea un archivo `.env` con tu configuración:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Azb0251593*
DB_NAME=inmogestion
PORT=3000
▶️ Cómo ejecutar el proyecto
Clonar el repositorio o copiar los archivos.

Instalar dependencias:

bash
Copiar
Editar
npm install
Iniciar servidor en modo desarrollo:

bash
Copiar
Editar
npm run dev
Abrir en el navegador:

arduino
Copiar
Editar
http://localhost:3000
📌 Endpoints disponibles
🧑 Clientes
GET /api/clientes → Listar clientes

POST /api/clientes → Crear cliente
Ejemplo body JSON:

json
Copiar
Editar
{
  "nombre_cliente": "Pedro",
  "apellido_cliente": "Gómez",
  "documento_cliente": "11223344",
  "correo_cliente": "pedro@mail.com",
  "telefono_cliente": "301555444"
}
PUT /api/clientes/:id → Actualizar cliente

DELETE /api/clientes/:id → Eliminar cliente

🏠 Propiedades
GET /api/propiedades → Listar propiedades

POST /api/propiedades → Crear propiedad
Ejemplo body JSON:

json
Copiar
Editar
{
  "tipo_propiedad": "Casa",
  "direccion_formato": "Calle 12 #45-67",
  "precio_propiedad": 250000000,
  "area_m2": 120,
  "descripcion": "Hermosa casa familiar",
  "estado_propiedad": "Disponible",
  "id_barrio": 1,
  "id_usuario": 1
}
PUT /api/propiedades/:id → Actualizar propiedad

DELETE /api/propiedades/:id → Eliminar propiedad

✅ Estado del proyecto
 Conexión a MySQL

 CRUD de Clientes

 CRUD de Propiedades

 Contratos

 Reportes

 Interacciones con clientes

 Documentación Swagger