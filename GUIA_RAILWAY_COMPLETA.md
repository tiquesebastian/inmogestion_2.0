# Guía Completa: Desplegar InmoGestion en Railway

## 📋 Requisitos Previos
- Cuenta en [Railway.app](https://railway.app/)
- GitHub conectado a Railway
- El repositorio `inmogestion_2.0` en GitHub

---

## 🚀 PASO 1: Crear el Proyecto en Railway

### 1.1 Acceder a Railway
1. Ve a https://railway.app/
2. Inicia sesión con tu cuenta de GitHub
3. Click en "New Project"

### 1.2 Conectar tu Repositorio
- Selecciona "Deploy from GitHub"
- Autoriza a Railway acceder a tus repos
- Selecciona `tiquesebastian/inmogestion_2.0`
- Elige la rama `main`

---

## 🗄️ PASO 2: Agregar Base de Datos MySQL

### 2.1 Crear la Instancia MySQL
1. En el dashboard del proyecto, click en "+ Add"
2. Selecciona "Database"
3. Selecciona "MySQL"
4. Railway creará la BD automáticamente

### 2.2 Copiar Credenciales
En la pestaña "MySQL" verás las variables de entorno:
- **DB_HOST**: Dirección del servidor
- **DB_PORT**: Puerto (normalmente 3306)
- **DB_USER**: Usuario (normalmente `root`)
- **DB_PASSWORD**: Contraseña generada
- **DB_NAME**: Nombre de la BD

**Guarda estas credenciales**, las usarás después.

---

## 🔐 PASO 3: Configurar Variables de Entorno

### 3.1 En Railway (Backend)
1. En el dashboard, selecciona el servicio del Backend
2. Ve a la pestaña "Variables"
3. Agrega las siguientes variables:

```
DB_HOST=<Copia de MySQL>
DB_PORT=<Copia de MySQL>
DB_USER=<Copia de MySQL>
DB_PASSWORD=<Copia de MySQL>
DB_NAME=<Copia de MySQL>
PORT=4000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tiquesebastian53@gmail.com
EMAIL_PASS=zpvifywa sktbwmkl
BACKEND_URL=https://<tu-backend-en-railway>.up.railway.app
FRONTEND_URL=https://<tu-frontend-en-railway>.up.railway.app
JWT_SECRET=supersecret
NODE_ENV=production
```

---

## 🗂️ PASO 4: Inicializar la Base de Datos

### 4.1 Usando Railway CLI (Recomendado)

**Instala Railway CLI:**
```bash
npm install -g @railway/cli
# o con scoop (Windows)
scoop install railway
```

**Conéctate a tu proyecto:**
```bash
railway login
railway link  # Selecciona tu proyecto
```

**Ejecutar el script SQL:**
```bash
# Primera opción: Usando el archivo SQL directamente
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> < "inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql"
```

### 4.2 Usando phpMyAdmin en Railway
1. Agrega phpMyAdmin como servicio en Railway
2. Accede a través de la URL proporcionada
3. Importa `BASE_DATOS_COMPLETA.sql` desde la interfaz

---

## 🎯 PASO 5: Desplegar el Backend

### 5.1 Verificar Procfile (Opcional)
Si tu `package.json` tiene script `start`, Railway lo detectará automáticamente.

El backend se iniciará con: `npm start` (desde la raíz del proyecto)

### 5.2 Conexión desde el Frontend
Actualiza tu `api.js` para usar la URL del backend en Railway:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://<tu-backend>.up.railway.app';
```

---

## 🎨 PASO 6: Desplegar Frontend (Opcional)

Si quieres también desplegar el frontend en Railway:

### 6.1 Crear segundo servicio
1. En Railway, "+ Add Service"
2. Selecciona "GitHub"
3. Selecciona `tiquesebastian/inmogestion_2.0` nuevamente
4. Configura como segundo servicio

### 6.2 Variables para Frontend
```
VITE_API_URL=https://<tu-backend>.up.railway.app
VITE_JWT_SECRET=supersecret
```

### 6.3 Build Command
```
cd inmogestion-frontend && npm run build
```

---

## ✅ PASO 7: Verificar la Conexión

### 7.1 Test de Backend
```bash
curl https://<tu-backend>.up.railway.app/
# Deberías ver: "Servidor funcionando correctamente 🚀"
```

### 7.2 Verificar BD
```bash
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> -e "SELECT COUNT(*) FROM usuario;"
```

---

## 🐛 Solución de Problemas

### Error de conexión a BD
- ✅ Verifica que las credenciales sean exactas
- ✅ Comprueba que la BD MySQL esté corriendo
- ✅ Revisa que el puerto 3306 esté abierto

### Errores en deployment
- Revisa los logs en Railway: "View Logs"
- Verifica que el `start` script en `package.json` sea correcto
- Asegúrate que todas las dependencias estén en `package.json`

### Base de datos no se inicializa
- Conecta con phpMyAdmin para verificar manualmente
- Revisa que el archivo SQL no tenga caracteres especiales
- Intenta splitear el SQL en comandos más pequeños

---

## 📝 Notas Importantes

1. **Carpeta `.vscode`**: Railway ejecutará desde aquí el `npm start`
2. **Variables de Entorno**: Todas las configuraciones deben estar en Railway, no en `.env`
3. **URL del Servidor**: Railway genera URLs automáticas, cópiala desde el dashboard
4. **Monitoreo**: Railway tiene panel de monitoreo en tiempo real

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a la rama `main`:
1. Railway detectará los cambios automáticamente
2. Iniciará un nuevo deploy
3. Puedes ver el progreso en la pestaña "Deployments"

---

## 📞 Soporte Railway
- [Documentación Oficial](https://docs.railway.app/)
- [Discord Community](https://discord.gg/railway)
- [Dashboard Help](https://railway.app/dashboard)
