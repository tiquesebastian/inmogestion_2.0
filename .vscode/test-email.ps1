# Script de prueba rápida de email
# Asegúrate de tener las variables EMAIL_* configuradas en tu .env

Write-Host "🧪 Probando conexión de email..." -ForegroundColor Cyan
Write-Host ""

# URL del backend (local o Railway)
$BACKEND_URL = Read-Host "Ingresa la URL del backend (Enter para localhost:4000)"
if ([string]::IsNullOrWhiteSpace($BACKEND_URL)) {
    $BACKEND_URL = "http://localhost:4000"
}

# Email de destino
$EMAIL = Read-Host "Ingresa el email de prueba"

# Tipo de email
Write-Host ""
Write-Host "Tipos de email disponibles:" -ForegroundColor Yellow
Write-Host "1. verificacion - Email de verificación de cuenta"
Write-Host "2. recuperacion - Email de recuperación de contraseña"
Write-Host ""
$TIPO = Read-Host "Selecciona el tipo (1 o 2)"

if ($TIPO -eq "1") {
    $TIPO = "verificacion"
} elseif ($TIPO -eq "2") {
    $TIPO = "recuperacion"
} else {
    Write-Host "❌ Tipo inválido" -ForegroundColor Red
    exit 1
}

# Crear el body JSON
$body = @{
    email = $EMAIL
    tipo = $TIPO
} | ConvertTo-Json

Write-Host ""
Write-Host "📤 Enviando petición a: $BACKEND_URL/api/test/email" -ForegroundColor Cyan
Write-Host "📧 Email destino: $EMAIL" -ForegroundColor Cyan
Write-Host "📝 Tipo: $TIPO" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/api/test/email" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ Respuesta exitosa:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
    Write-Host ""
    Write-Host "✅ Email enviado correctamente! Revisa tu bandeja de entrada." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error al enviar email:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Detalles del error:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
    
    Write-Host ""
    Write-Host "🔍 Posibles causas:" -ForegroundColor Yellow
    Write-Host "1. Variables EMAIL_* no configuradas en Railway/backend"
    Write-Host "2. App Password de Gmail incorrecto"
    Write-Host "3. Backend no está corriendo"
    Write-Host "4. CORS bloqueando la petición"
    exit 1
}
