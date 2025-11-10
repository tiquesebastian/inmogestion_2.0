param(
  [string]$Mysql = "mysql",
  [string]$User = "root"
)

Write-Host "== InmoGestión :: RESET RÁPIDO BD ==" -ForegroundColor Cyan

# Solicitar contraseña de MySQL de forma segura
$secure = Read-Host "Introduce la contraseña de MySQL para el usuario '$User'" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$Password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

# Rutas de los scripts SQL (ubicados junto a este script)
$BaseSql  = Join-Path $PSScriptRoot "BASE_DATOS_COMPLETA.sql"
$SeedsSql = Join-Path $PSScriptRoot "SEEDS_MINIMOS.sql"

if (!(Test-Path $BaseSql)) { Write-Error "No se encontró $BaseSql"; exit 1 }
if (!(Test-Path $SeedsSql)) { Write-Error "No se encontró $SeedsSql"; exit 1 }

# Ejecutar utilizando cmd para soportar redirección '<'
function Run-SqlFile([string]$file) {
  $quoted = '"' + $file + '"'
  $cmd = "${Mysql} -u ${User} -p${Password} < ${quoted}"
  Write-Host "Ejecutando: $file" -ForegroundColor Yellow
  cmd /c $cmd
  if ($LASTEXITCODE -ne 0) { throw "Fallo ejecutando $file (EXITCODE=$LASTEXITCODE)" }
}

try {
  Run-SqlFile $BaseSql
  Run-SqlFile $SeedsSql
  Write-Host "✔ BD instalada y con datos mínimos" -ForegroundColor Green
}
catch {
  Write-Host "✖ Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
