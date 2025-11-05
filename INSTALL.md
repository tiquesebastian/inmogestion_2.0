# 🏡 InmoGestión - Guía de Instalación

Esta guía te ayudará a configurar el proyecto InmoGestión completamente en tu equipo local.

## 📋 Requisitos Previos

1. **Node.js y npm**
   - Instalar [Node.js](https://nodejs.org/) (versión 18.0.0 o superior)
   - npm se instalará automáticamente con Node.js

2. **MySQL**
   - Instalar [MySQL Server](https://dev.mysql.com/downloads/mysql/) (versión 8.0 o superior)
   - Instalar [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (recomendado para gestión de base de datos)

3. **Git**
   - Instalar [Git](https://git-scm.com/downloads)

## 🚀 Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion
```

### 2. Configurar la Base de Datos

1. Abrir MySQL Workbench
2. Conectar a tu servidor MySQL local
3. Crear la base de datos y las tablas:
   - Abrir el archivo `db/schema.sql`
   - Ejecutar el script completo

### 3. Configurar las Variables de Entorno

#### Backend
1. Navegar a la carpeta del backend
```bash
cd inmogestion-backend
```

2. Crear archivo `.env`:
```env
# Puerto del servidor
PORT=4000

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=inmogestion

# JWT para autenticación
JWT_SECRET=tu_clave_secreta_muy_segura

# Configuración de correo (si usas Gmail)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

#### Frontend
1. Navegar a la carpeta del frontend
```bash
cd ../inmogestion-frontend
```

2. Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:4000
VITE_EMAIL_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAIL_TEMPLATE_ID=tu_template_id_de_emailjs
VITE_EMAIL_PUBLIC_KEY=tu_public_key_de_emailjs
```

### 4. Instalar Dependencias

#### Backend
```bash
cd inmogestion-backend
npm install
```

#### Frontend
```bash
cd ../inmogestion-frontend
npm install
```

### 5. Iniciar el Proyecto

1. **Iniciar el Backend**
```bash
cd inmogestion-backend
npm run dev
```
El servidor backend estará disponible en `http://localhost:4000`

2. **Iniciar el Frontend** (en una nueva terminal)
```bash
cd inmogestion-frontend
npm run dev
```
La aplicación frontend estará disponible en `http://localhost:5173`

## 🔍 Verificación de la Instalación

1. **Backend**
   - Acceder a `http://localhost:4000/api/health`
   - Deberías ver un mensaje de "OK" o similar

2. **Frontend**
   - Acceder a `http://localhost:5173`
   - Deberías ver la página de inicio de InmoGestión

3. **Base de Datos**
   - En MySQL Workbench, ejecutar:
   ```sql
   USE inmogestion;
   SELECT * FROM vista_usuarios_activos;
   ```
   - Deberías ver al menos el usuario administrador

## 🔧 Solución de Problemas Comunes

### Error de Conexión a la Base de Datos
- Verificar que MySQL esté corriendo
- Comprobar credenciales en archivo `.env`
- Verificar que el puerto 3306 esté disponible

### Error de CORS
- Verificar que las URLs en el frontend coincidan con el backend
- Comprobar la configuración de CORS en `server.js`

### Errores de Módulos
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

## 📝 Notas Adicionales

- Para desarrollo, usar `npm run dev`
- Para producción, usar `npm run build` y `npm start`
- Mantener las versiones de Node.js y MySQL actualizadas
- Revisar regularmente las actualizaciones de dependencias

## 🔐 Seguridad

- Cambiar las contraseñas por defecto
- No compartir los archivos `.env`
- Usar contraseñas fuertes para la base de datos
- Mantener el `JWT_SECRET` seguro y único

## 🆘 Soporte

Si encuentras algún problema durante la instalación:
1. Revisar los logs de error
2. Consultar la documentación
3. Abrir un issue en el repositorio de GitHub
4. Contactar al equipo de desarrollo