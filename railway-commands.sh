#!/usr/bin/env bash
#
# RAILWAY DEPLOYMENT REFERENCE
# Comandos rápidos para desplegar en Railway
#
# Uso: source railway-commands.sh
#

# =================================================================
# 1. INSTALAR RAILWAY CLI
# =================================================================

echo "🔧 Instalando Railway CLI..."
npm install -g @railway/cli


# =================================================================
# 2. CONECTAR Y VINCULAR PROYECTO
# =================================================================

echo "🔗 Conectando a Railway..."
railway login

echo "📋 Vinculando proyecto..."
railway link


# =================================================================
# 3. VER ESTADO DEL PROYECTO
# =================================================================

echo "📊 Estado del proyecto:"
railway status
railway logs


# =================================================================
# 4. VARIABLES DE ENTORNO (EN RAILWAY)
# =================================================================

echo "
⚙️ VARIABLES A CONFIGURAR EN RAILWAY:

# De MySQL
DB_HOST=<MYSQLHOST>
DB_PORT=<MYSQLPORT>
DB_USER=<MYSQLUSER>
DB_PASSWORD=<MYSQLPASSWORD>
DB_NAME=<MYSQLDATABASE>

# Servidor
PORT=4000
NODE_ENV=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tiquesebastian53@gmail.com
EMAIL_PASS=zpvifywa sktbwmkl

# JWT
JWT_SECRET=supersecret

# URLs
BACKEND_URL=https://<app>.up.railway.app
FRONTEND_URL=https://<app>.up.railway.app
"


# =================================================================
# 5. INICIALIZAR BASE DE DATOS
# =================================================================

echo "🗄️ Importando base de datos..."

# Obtener variables de Railway
DB_HOST=$(railway variables get MYSQLHOST)
DB_USER=$(railway variables get MYSQLUSER)
DB_PASSWORD=$(railway variables get MYSQLPASSWORD)
DB_NAME=$(railway variables get MYSQLDATABASE)

# Ejecutar SQL
mysql -h "$DB_HOST" \
      -u "$DB_USER" \
      -p"$DB_PASSWORD" \
      "$DB_NAME" < "inmogestion-frontend/nueva _estructura/BASE_DATOS_COMPLETA.sql"

echo "✅ Base de datos importada"


# =================================================================
# 6. VERIFICAR DESPLIEGUE
# =================================================================

echo "✅ Verificando despliegue..."

# Obtener URL
BACKEND_URL=$(railway variables get BACKEND_URL)

# Test
curl "$BACKEND_URL/"


# =================================================================
# 7. VER LOGS EN VIVO
# =================================================================

echo "📜 Viendo logs en tiempo real..."
railway logs --follow


# =================================================================
# 8. REVERTIR A VERSIÓN ANTERIOR
# =================================================================

echo "⏮️ Mostrando deployments anteriores..."
railway deployments

# Para revertir: railway deployments rollback <ID>


# =================================================================
# REFERENCIA RÁPIDA DE COMANDOS
# =================================================================

echo "
📚 COMANDOS RAILWAY COMUNES:

  railway login               # Conectar a cuenta
  railway link                # Vincular proyecto
  railway status              # Ver estado
  railway logs                # Ver logs
  railway logs --follow       # Logs en vivo
  railway variables           # Ver variables
  railway variables set KEY VALUE  # Cambiar variable
  railway deployments         # Ver histórico de deployments
  railway shell               # Abrir shell del servidor
  railway open                # Abrir dashboard en navegador
"
