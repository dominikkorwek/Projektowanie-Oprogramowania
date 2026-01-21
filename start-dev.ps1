$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

function Ensure-Install($path) {
  if (!(Test-Path (Join-Path $path "node_modules"))) {
    Write-Host "Instaluję zależności w: $path"
    npm --prefix $path install
  }
}

Write-Host "Start: backend + frontend"

Ensure-Install "."
Ensure-Install "backend"
Ensure-Install "frontend"

npm run dev:all

