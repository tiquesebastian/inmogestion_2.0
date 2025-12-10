# ============================================
# Script de Migración - Verificación de Email
# Ejecuta las migraciones SQL para agregar campos de verificación
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MIGRACIÓN: Verificación de Email" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cargar variables de entorno desde .env
$envFile = ".\.env"
if (Test-Path $envFile) {
    Write-Host "✓ Cargando variables de entorno..." -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "⚠ Archivo .env no encontrado" -ForegroundColor Yellow
}

# Obtener credenciales de la base de datos
$dbHost = $env:DB_HOST
if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "localhost" }

$dbUser = $env:DB_USER
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "root" }

$dbName = $env:DB_NAME
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "inmogestion" }

Write-Host ""
Write-Host "Configuración de Base de Datos:" -ForegroundColor Yellow
Write-Host "  Host: $dbHost" -ForegroundColor Gray
Write-Host "  Usuario: $dbUser" -ForegroundColor Gray
Write-Host "  Base de Datos: $dbName" -ForegroundColor Gray
Write-Host ""

# Solicitar contraseña
$dbPassword = Read-Host "Ingresa la contraseña de MySQL" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
$dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Verificar que existe el archivo SQL
$sqlFile = ".\db\add_email_verification.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Error: No se encontró el archivo de migración" -ForegroundColor Red
    Write-Host "   Ruta esperada: $sqlFile" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ Archivo de migración encontrado" -ForegroundColor Green
Write-Host ""

# Ejecutar migración
Write-Host "Ejecutando migración..." -ForegroundColor Yellow
Write-Host ""

try {
    # Construir comando MySQL
    $mysqlCmd = "mysql"
    $mysqlArgs = @(
        "-h", $dbHost,
        "-u", $dbUser,
        "-p$dbPasswordPlain",
        $dbName,
        "-e", "source $sqlFile"
    )

    # Intentar ejecutar
    $process = Start-Process -FilePath $mysqlCmd -ArgumentList $mysqlArgs -NoNewWindow -Wait -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ Migración ejecutada exitosamente!" -ForegroundColor Green
        Write-Host ""
        
        # Verificar columnas creadas
        Write-Host "Verificando columnas creadas..." -ForegroundColor Yellow
        
        $verifyQuery = @"
SELECT 
  'usuario' AS tabla,
  COLUMN_NAME AS columna,
  COLUMN_TYPE AS tipo
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = '$dbName'
AND TABLE_NAME = 'usuario'
AND COLUMN_NAME IN ('email_verificado', 'email_token', 'email_token_expires')
UNION ALL
SELECT 
  'cliente' AS tabla,
  COLUMN_NAME AS columna,
  COLUMN_TYPE AS tipo
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = '$dbName'
AND TABLE_NAME = 'cliente'
AND COLUMN_NAME IN ('email_verificado', 'email_token', 'email_token_expires');
"@

        $verifyArgs = @(
            "-h", $dbHost,
            "-u", $dbUser,
            "-p$dbPasswordPlain",
            $dbName,
            "-e", $verifyQuery
        )

        Start-Process -FilePath $mysqlCmd -ArgumentList $verifyArgs -NoNewWindow -Wait
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ MIGRACIÓN COMPLETADA" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Cyan
        Write-Host "  1. Reinicia el servidor backend: npm run dev" -ForegroundColor Gray
        Write-Host "  2. Verifica que aparezca: 'Servidor de email listo'" -ForegroundColor Gray
        Write-Host "  3. Prueba el registro de usuarios" -ForegroundColor Gray
        Write-Host ""
        
    } else {
        Write-Host ""
        Write-Host "❌ Error ejecutando la migración" -ForegroundColor Red
        Write-Host "   Código de salida: $($process.ExitCode)" -ForegroundColor Gray
        exit 1
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa: Ejecuta manualmente" -ForegroundColor Yellow
    Write-Host "  mysql -u $dbUser -p $dbName < db\add_email_verification.sql" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
