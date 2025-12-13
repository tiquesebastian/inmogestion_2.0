# 🚀 PASOS RÁPIDOS PARA DESPLEGAR EN RAILWAY

## ⚡ Resumen Ejecutivo

```
1. Crear proyecto en Railway → 2 min
2. Agregar BD MySQL → 2 min  
3. Configurar variables → 3 min
4. Inicializar BD → 2 min
5. Desplegar backend → Automático
Total: ~10 minutos
```

---

## 🎯 PASO A PASO

### PASO 1️⃣: Crear Proyecto en Railway (2 min)

```bash
1. Abre https://railway.app/
2. Click en "New Project"
3. Selecciona "Deploy from GitHub"
4. Conecta tu cuenta de GitHub
5. Selecciona: tiquesebastian/inmogestion_2.0
6. Rama: main
```

✅ **Resultado**: Tu proyecto está en Railway

---

### PASO 2️⃣: Agregar Base de Datos (2 min)

**En el dashboard de Railway:**

```bash
1. Click en "+ Add"
2. Selecciona "Database"
3. Selecciona "MySQL"
4. Railway crea la BD automáticamente
```

✅ **Resultado**: MySQL lista en Railway

---

### PASO 3️⃣: Copiar Credenciales de BD (1 min)

**En el panel de MySQL:**

Verás estas variables generadas por Railway:

```
MYSQLHOST=...
MYSQLPORT=...
MYSQLUSER=...
MYSQLPASSWORD=...
MYSQLDATABASE=...
```

**Guarda estas credenciales** 📝

---

### PASO 4️⃣: Configurar Variables en Backend (2 min)

**En Railway (selecciona el servicio Backend):**

1. Pestaña "Variables"
2. Agrega estas variables:

```
# De la BD MySQL (cópialas arriba)
DB_HOST=<MYSQLHOST>
DB_PORT=<MYSQLPORT>
DB_USER=<MYSQLUSER>
DB_PASSWORD=<MYSQLPASSWORD>
DB_NAME=<MYSQLDATABASE>

# Configuración del servidor
PORT=4000
NODE_ENV=production

# Email (actuales)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tiquesebastian53@gmail.com
EMAIL_PASS=zpvifywa sktbwmkl

# JWT
JWT_SECRET=supersecret

# URLs (actualiza después de obtener URLs de Railway)
BACKEND_URL=https://<tu-app>.up.railway.app
FRONTEND_URL=https://<tu-frontend>.up.railway.app
```

✅ **Resultado**: Variables configuradas

---

### PASO 5️⃣: Inicializar Base de Datos (2 min)

**Opción A: Usar phpMyAdmin**

1. Agregar servicio phpMyAdmin en Railway
2. Conectarse con las credenciales de MySQL
3. Importar archivo: `inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql`

**Opción B: Usar Railway CLI**

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Conectarse al proyecto
railway login
railway link

# Ejecutar script
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> < "inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql"
```

✅ **Resultado**: BD inicializada con tablas y datos

---

### PASO 6️⃣: Verificar Despliegue ✅

```bash
# Verificar que el backend está online
curl https://<tu-url>.up.railway.app/

# Deberías ver: "Servidor funcionando correctamente 🚀"
```

---

## 🔧 Tabla de URLs

Después de desplegar, tendrás:

| Servicio | URL |
|----------|-----|
| Backend | `https://<nombre>.up.railway.app` |
| phpMyAdmin | `https://<nombre>.up.railway.app:8080` |
| Frontend | (Si lo despliegas también) |

**Nota**: Railway genera estas URLs automáticamente en el dashboard

---

## 🆘 SOLUCIONAR PROBLEMAS

### ❌ La BD no se conecta
```
Verifica:
✓ Credenciales exactas
✓ Puerto 3306 abierto
✓ BD MySQL corriendo
✓ Variables correctas en Railway
```

### ❌ Error "Module not found"
```
Solución:
cd .vscode
npm install
cd ..
```

### ❌ Script SQL falla
```
Intenta:
1. Usar phpMyAdmin en lugar de CLI
2. Dividir el script en partes más pequeñas
3. Verificar caracteres especiales UTF-8
```

---

## 📲 Próximos Pasos Después del Deploy

1. **Actualizar URLs en Frontend**
   - Cambiar `api.js` para usar URL del backend en Railway
   
2. **Desplegar Frontend (Opcional)**
   - Agregar segundo servicio para React
   - Configurar variables de entorno
   
3. **Monitoreo**
   - Ver logs en Railway → "View Logs"
   - Monitorear CPU, RAM, requests

4. **Actualizaciones**
   - Cada `git push` a `main` dispara nuevo deploy automáticamente

---

## 📚 Documentación Completa

Lee: `GUIA_RAILWAY_COMPLETA.md` para más detalles

---

## ✨ ¡Listo!

Tu proyecto InmoGestion estará en vivo en Railway en ~10 minutos 🎉

Para soporte: https://docs.railway.app/
