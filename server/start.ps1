# =========================================================
# Ebonhold - Arranque del stack de desarrollo
# =========================================================
# Uso:
#   .\start.ps1              # MySQL + auth (sin worldserver)
#   .\start.ps1 -Full        # arranca todo (requiere cliente + extraccion previa)
#   .\start.ps1 -Extract     # solo extrae datos del cliente WoW (30-50 min)
#   .\start.ps1 -Reset       # borra volumenes y vuelve a empezar
# =========================================================

param(
  [switch]$Full,
  [switch]$Extract,
  [switch]$Reset
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Ebonhold Server Stack" -ForegroundColor Cyan
Write-Host "===================="  -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Docker
Write-Host "[1] Verificando Docker..."
$null = docker info --format "{{.ServerVersion}}" 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: Docker Desktop no esta corriendo. Abrelo y reintenta." -ForegroundColor Red
  exit 1
}
Write-Host "    OK"

# Modo extraccion: solo extrae mapas/dbc/vmaps/mmaps y sale
if ($Extract) {
  Write-Host ""
  Write-Host "Modo extraccion (30-50 min)..." -ForegroundColor Yellow
  if (-not (Test-Path client-data\Wow.exe)) {
    Write-Host "ERROR: No encuentro client-data\Wow.exe" -ForegroundColor Red
    Write-Host "       Copia tu cliente WoW 3.3.5a completo a server\client-data\" -ForegroundColor Yellow
    exit 1
  }
  docker compose --profile extract up ac-extract
  Write-Host "Extraccion lista. Ahora .\start.ps1 -Full" -ForegroundColor Green
  exit 0
}

# Reset opcional
if ($Reset) {
  Write-Host "[2] Reseteando volumenes (esto borra todas las BDs)..."
  docker compose down -v
  Write-Host "    OK"
}

# 3. Arrancar MySQL
Write-Host "[3] Arrancando MySQL..."
docker compose up -d ac-database

$ready = $false
for ($i = 1; $i -le 12; $i++) {
  Start-Sleep -Seconds 5
  $status = docker inspect --format='{{.State.Health.Status}}' azerothcore-mysql 2>$null
  if ($status -eq "healthy") {
    Write-Host "    OK (healthy en intento $i)"
    $ready = $true
    break
  }
  Write-Host "    esperando MySQL... ($i/12)"
}
if (-not $ready) {
  Write-Host "ERROR: MySQL no llego a healthy. Revisa: docker logs azerothcore-mysql" -ForegroundColor Red
  exit 1
}

# 4. Importar BDs del core (idempotente)
$worldHasData = docker exec azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='acore_world';" 2>$null
if ([int]$worldHasData -lt 100) {
  Write-Host "[4] Importando BDs del core (puede tardar la primera vez)..."
  docker compose run --rm ac-db-import
} else {
  Write-Host "[4] BDs del core ya existen ($worldHasData tablas en acore_world)"
}

# Inicializar ebonhold_web si no existe
$dbExists = docker exec azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore -N -e "SHOW DATABASES LIKE 'ebonhold_web';" 2>$null
if (-not $dbExists) {
  Write-Host "    creando ebonhold_web..."
  Get-Content db\init-web.sql | docker exec -i azerothcore-mysql mysql -h 127.0.0.1 -uroot -pazerothcore
  Push-Location ..\web
  npx drizzle-kit push --force
  Pop-Location
} else {
  Write-Host "    ebonhold_web ya existe"
}

# 5. Arrancar el resto
if ($Full) {
  Write-Host "[5] Arrancando authserver + worldserver..."
  if (-not (Test-Path client-data\Wow.exe)) {
    Write-Host "ERROR: No encuentro client-data\Wow.exe" -ForegroundColor Red
    exit 1
  }
  if (-not (Test-Path client-data\mmaps)) {
    Write-Host "AVISO: No encuentro client-data\mmaps - hay que extraer primero." -ForegroundColor Yellow
    Write-Host "       Ejecuta: .\start.ps1 -Extract" -ForegroundColor Yellow
    exit 1
  }
  docker compose up -d ac-authserver ac-worldserver
} else {
  Write-Host "[5] Arrancando solo authserver..."
  docker compose up -d ac-authserver
}

Write-Host ""
Write-Host "Listo." -ForegroundColor Green
Write-Host ""
docker compose ps
