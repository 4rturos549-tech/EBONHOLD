# Para todo el stack (preserva volumenes y datos)
Set-Location $PSScriptRoot
docker compose down
Write-Host "Stack detenido." -ForegroundColor Green
Write-Host "Los datos de las BDs se preservaron en el volumen 'server_ac-db-data'."
Write-Host "Para borrar todo: .\start.ps1 -Reset"
