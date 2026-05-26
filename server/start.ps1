# =========================================================
# Ebonhold - Arranque del stack de desarrollo
# =========================================================
# Uso:
#   .\start.ps1              # arranca BD + auth (sin worldserver)
#   .\start.ps1 -Full        # arranca todo (requiere cliente WoW en client-data/)
#   .\start.ps1 -Reset       # borra BDs y vuelve a inicializar todo
# =========================================================

param(
  [switch]$Full,
  [switch]$Reset
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Ebonhold Server Stack" -ForegroundColor Cyan
Write-Host "===================="  -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Docker
Write-Host "[1/5] Verificando Docker..."
$null = docker info --format "{{.ServerVersion}}" 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: Docker Desktop no esta corriendo. Abrelo y reintenta." -ForegroundColor Red
  exit 1
}
Write-Host "      OK"

# 2. Reset opcional
if ($Reset) {
  Write-Host "[2/5] Reseteando volumenes (esto borra todas las BDs)..."
  docker compose down -v
  Write-Host "      OK"
} else {
  Write-Host "[2/5] (saltando reset)"
}

# 3. Arrancar MySQL
Write-Host "[3/5] Arrancando MySQL..."
docker compose up -d ac-database

# Esperar healthy
$ready = $false
for ($i = 1; $i -le 12; $i++) {
  Start-Sleep -Seconds 5
  $status = docker inspect --format='{{.State.Health.Status}}' azerothcore-mysql 2>$null
  if ($status -eq "healthy") {
    Write-Host "      OK (healthy en intento $i)"
    $ready = $true
    break
  }
  Write-Host "      esperando MySQL... ($i/12)"
}
if (-not $ready) {
  Write-Host "ERROR: MySQL no llego a healthy. Revisa: docker logs azerothcore-mysql" -ForegroundColor Red
  exit 1
}

# 4. Importar BDs del core (idempotente: solo aplica diffs)
Write-Host "[4/5] Importando/actualizando BDs del core (puede tardar la primera vez)..."
docker compose run --rm ac-db-import

# Inicializar ebonhold_web si no existe
$dbExists = docker exec azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore -N -e "SHOW DATABASES LIKE 'ebonhold_web';" 2>$null
if (-not $dbExists) {
  Write-Host "      creando ebonhold_web..."
  Get-Content db\init-web.sql | docker exec -i azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore
  Write-Host "      OK"

  # Migrar tablas web con Drizzle
  Push-Location ..\web
  npm run db:push -- --force
  Pop-Location
}

# 5. Arrancar el resto
if ($Full) {
  Write-Host "[5/5] Arrancando authserver + worldserver..."
  if (-not (Test-Path client-data\Wow.exe)) {
    Write-Host "ERROR: No encuentro client-data/Wow.exe" -ForegroundColor Red
    Write-Host "       Necesitas el cliente WoW 3.3.5a en client-data/" -ForegroundColor Yellow
    exit 1
  }
  if (-not (Test-Path client-data\dbc)) {
    Write-Host "AVISO: No encuentro client-data/dbc - hay que extraer los mapas primero." -ForegroundColor Yellow
    Write-Host "       Ejecuta: docker compose --profile tools up ac-tools" -ForegroundColor Yellow
    exit 1
  }
  docker compose up -d ac-authserver ac-worldserver
} else {
  Write-Host "[5/5] Arrancando solo authserver (sin cliente WoW por ahora)..."
  docker compose up -d ac-authserver
}

Write-Host ""
Write-Host "Listo." -ForegroundColor Green
Write-Host ""
Write-Host "Estado:"
docker compose ps
Write-Host ""
Write-Host "Para crear una cuenta GM:"
Write-Host '  docker exec -it azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore acore_auth' -ForegroundColor Yellow
Write-Host ""
