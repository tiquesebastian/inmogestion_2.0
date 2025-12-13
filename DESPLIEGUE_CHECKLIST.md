# 📋 CHECKLIST DE DESPLIEGUE EN RAILWAY

## ✅ PRE-DESPLIEGUE (Completado en tu máquina)

- [x] Repositorio migrado a inmogestion_2.0
- [x] Credenciales en `.env` local
- [x] Configuración Railway agregada
- [x] Script de init-db.js listo
- [x] Variables de entorno documentadas

---

## 🚀 DURANTE EL DESPLIEGUE

### 1. Crear Proyecto Railway

```bash
Paso 1: Ir a https://railway.app/
Paso 2: Click "New Project"
Paso 3: "Deploy from GitHub"
Paso 4: Seleccionar tiquesebastian/inmogestion_2.0
Paso 5: Rama: main
```

**Tiempo**: ⏱️ 2 minutos

---

### 2. Agregar Base de Datos MySQL

```bash
Paso 1: En dashboard, click "+ Add"
Paso 2: Seleccionar "Database"
Paso 3: Seleccionar "MySQL"
Paso 4: Railway crea la BD automáticamente

⚠️ IMPORTANTE: Copia estas variables que Railway genera:
   - MYSQLHOST
   - MYSQLPORT
   - MYSQLUSER
   - MYSQLPASSWORD
   - MYSQLDATABASE
```

**Tiempo**: ⏱️ 2 minutos

---

### 3. Configurar Variables de Entorno

**En Railway (Backend Service → Variables):**

```
# BASE DE DATOS (de MySQL arriba)
DB_HOST=<MYSQLHOST>
DB_PORT=<MYSQLPORT>
DB_USER=<MYSQLUSER>
DB_PASSWORD=<MYSQLPASSWORD>
DB_NAME=<MYSQLDATABASE>

# SERVIDOR
PORT=4000
NODE_ENV=production

# EMAIL
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tiquesebastian53@gmail.com
EMAIL_PASS=zpvifywa sktbwmkl

# JWT
JWT_SECRET=supersecret

# URLs (actualizar después de obtener URLs de Railway)
BACKEND_URL=https://<nombre-backend>.up.railway.app
FRONTEND_URL=https://<nombre-frontend>.up.railway.app
```

**Tiempo**: ⏱️ 3 minutos

---

### 4. Inicializar Base de Datos

**OPCIÓN A: Usar phpMyAdmin (Más fácil)**

```bash
1. En Railway, click "+ Add"
2. Buscar "phpMyAdmin"
3. Agregarlo como servicio
4. Abrir phpMyAdmin desde la URL generada
5. Conectar con credenciales de MySQL
6. Import → Seleccionar archivo
   → inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql
7. ¡Importar!
```

**OPCIÓN B: Usar CLI (Desde tu máquina)**

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Conectar
railway login
railway link

# 3. Ejecutar SQL
mysql -h <DB_HOST> \
      -u <DB_USER> \
      -p<DB_PASSWORD> \
      <DB_NAME> < "inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql"
```

**Tiempo**: ⏱️ 2 minutos

---

### 5. Verificar Despliegue

```bash
# Obtener URL del backend desde Railway dashboard
# Luego ejecutar:

curl https://<nombre>.up.railway.app/

# Deberías ver:
# "Servidor funcionando correctamente 🚀"
```

**Tiempo**: ⏱️ 1 minuto

---

## 📊 RESULTADO ESPERADO

```
COMPONENTE          ESTADO      URL
─────────────────────────────────────────────
Backend API         ✅ Online   https://<app>.up.railway.app
MySQL Database      ✅ Online   <MYSQLHOST>:3306
phpMyAdmin          ✅ Online   https://<app>.up.railway.app:8080
```

---

## 🎯 TIEMPO TOTAL

| Paso | Tiempo |
|------|--------|
| Crear Proyecto | 2 min |
| Agregar MySQL | 2 min |
| Configurar Variables | 3 min |
| Inicializar BD | 2 min |
| Verificar | 1 min |
| **TOTAL** | **~10 min** |

---

## 🔄 DESPUÉS DEL DESPLIEGUE

### Actualizar Frontend

En `inmogestion-frontend/src/services/api.js`:

```javascript
// Cambiar de:
const API_BASE_URL = 'http://localhost:4000'

// A:
const API_BASE_URL = 'https://<nombre-backend>.up.railway.app'
```

### Deployar Frontend (Opcional)

```bash
# Si quieres servir el frontend también en Railway:
1. "+ Add Service" en Railway
2. Seleccionar GitHub nuevamente
3. Configurar como segundo servicio
4. Build: cd inmogestion-frontend && npm run build
5. Start: npm run preview
```

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Se sincroniza automáticamente con GitHub?**
R: ✅ Sí, cada `git push` a `main` dispara un nuevo deploy

**P: ¿Dónde veo los logs?**
R: En Railway Dashboard → Seleccionar servicio → "View Logs"

**P: ¿Cómo cambio variables después?**
R: Railway → Variables → Cambiar → Automáticamente redeploy

**P: ¿Se puede rollback?**
R: ✅ Sí, en pestaña "Deployments" → seleccionar versión anterior

**P: ¿Necesito Procfile?**
R: ❌ No, Railway detecta automáticamente desde package.json

---

## 🆘 SOLUCIONAR PROBLEMAS

### Error: "Cannot find module"
```bash
Solución:
  cd .vscode
  npm install
  cd ..
```

### Error: "Cannot connect to database"
```
Verificar:
  ✓ Las credenciales sean exactas
  ✓ Copiar desde MySQL, no del .env local
  ✓ El puerto sea 3306
  ✓ Las variables estén en Railway, no en .env
```

### Error: "404 Not Found"
```
Causas posibles:
  • El servidor no está en puerto 4000
  • El script start es incorrecto
  • Las dependencias no se instalaron
```

### BD no se importó
```
Soluciones:
  1. Usar phpMyAdmin (más visual)
  2. Dividir el archivo SQL en partes
  3. Verificar caracteres especiales UTF-8
  4. Revisar logs de Railway
```

---

## 🔐 SEGURIDAD

⚠️ **IMPORTANTE**:

```
✅ NO guardes contraseñas en GitHub
✅ Usa Railway Variables, no .env
✅ JWT_SECRET es solo para testing
✅ EMAIL_PASS no debe estar en repositorio
   → Usa variables secretas de Railway
```

---

## 📞 SOPORTE

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/tiquesebastian/inmogestion_2.0/issues

---

## ✨ CONCLUSIÓN

¡Felicidades! 🎉 Tu sistema InmoGestion estará en vivo en ~10 minutos

Sigue los pasos en orden y tendrás:
- ✅ Backend corriendo en Railway
- ✅ BD MySQL alojada y sincronizada
- ✅ Acceso 24/7 desde cualquier lugar
- ✅ Auto-deployments con cada push a GitHub

¡Ahora a desplegar! 🚀
