# =========================================
# Elite Saloon — Deploy to Azure Static Web Apps
# =========================================
# Prerequisites:
#   1. Azure CLI installed → https://aka.ms/installazurecli
#   2. SWA CLI installed  → npm install -g @azure/static-web-apps-cli
#   3. Logged in          → az login
#
# Usage (first time):
#   .\infra\deploy-swa.ps1 -ResourceGroup "elite-saloon-rg" -AppName "elite-saloon" -Location "eastus2"
#
# Usage (redeploy with token):
#   .\infra\deploy-swa.ps1 -DeployToken "your-deployment-token"
# =========================================

param(
  [string]$ResourceGroup  = "rg-sysint-elite-saloon",
  [string]$AppName        = "elite-saloon",
  [string]$Location       = "eastus",
  [string]$DeployToken    = "",
  [string]$SourcePath     = "$PSScriptRoot\..\site"
)

$ErrorActionPreference = "Stop"

Write-Host "`nElite Saloon — Azure Static Web Apps Deploy" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# ---- Step 1: Create Resource Group + SWA (first deploy only) ----
if (-not $DeployToken) {
  Write-Host "`n[1/3] Using existing Resource Group: $ResourceGroup" -ForegroundColor Yellow

  Write-Host "`n[2/3] Creating Static Web App..." -ForegroundColor Yellow
  $result = az staticwebapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Free `
    --output json | ConvertFrom-Json

  $DeployToken = az staticwebapp secrets list `
    --name $AppName `
    --resource-group $ResourceGroup `
    --query "properties.apiKey" --output tsv

  Write-Host "`nStatic Web App created!" -ForegroundColor Green
  Write-Host "Default URL: https://$($result.defaultHostname)" -ForegroundColor Yellow
  Write-Host "Save this deployment token for future deploys:" -ForegroundColor Cyan
  Write-Host $DeployToken -ForegroundColor White
}

# ---- Step 2: Deploy site folder ----
Write-Host "`n[3/3] Deploying site to Azure Static Web Apps..." -ForegroundColor Yellow

swa deploy $SourcePath --deployment-token $DeployToken --env production

Write-Host "`nDeploy complete!" -ForegroundColor Green
