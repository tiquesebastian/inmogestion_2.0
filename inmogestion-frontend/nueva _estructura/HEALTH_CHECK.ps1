Write-Host "== InmoGestión :: HEALTH CHECK ==" -ForegroundColor Cyan

$backendUrl = "http://localhost:4000"
$frontendUrl = "http://localhost:5173"

function Test-Endpoint($name, $url) {
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
    Write-Host ("[OK] {0} -> {1} ({2})" -f $name, $url, $res.StatusCode) -ForegroundColor Green
  }
  catch {
    Write-Host ("[FAIL] {0} -> {1} :: {2}" -f $name, $url, $_.Exception.Message) -ForegroundColor Red
  }
}

# Backend básico
Test-Endpoint "Backend root" $backendUrl
Test-Endpoint "Saludo" "$backendUrl/api/saludo"
Test-Endpoint "Propiedades" "$backendUrl/api/propiedades"
Test-Endpoint "Contratos" "$backendUrl/api/contratos-documentos"

# Frontend básico (espera HTML)
Test-Endpoint "Frontend" $frontendUrl

Write-Host "Health check finalizado." -ForegroundColor Cyan
