# =========================================
# Elite Salon — Deploy static site to Azure Blob Storage
# =========================================
# Prerequisites:
#   az cli installed and logged in (az login)
#   Azure Storage Account with static website enabled
#
# Usage:
#   .\infra\deploy-site.ps1 -StorageAccount "elitesalonstorage" -ResourceGroup "elite-salon-rg"
# =========================================

param(
  [Parameter(Mandatory=$true)]
  [string]$StorageAccount,

  [Parameter(Mandatory=$true)]
  [string]$ResourceGroup,

  [string]$SourcePath = "$PSScriptRoot\..\site",
  [string]$SubscriptionId = ""
)

$ErrorActionPreference = "Stop"

Write-Host "`nElite Salon — Static Site Deploy" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Optionally set subscription
if ($SubscriptionId) {
  Write-Host "Setting subscription: $SubscriptionId"
  az account set --subscription $SubscriptionId
}

# Enable static website on the storage account (idempotent)
Write-Host "`n[1/3] Enabling static website hosting..."
az storage blob service-properties update `
  --account-name $StorageAccount `
  --static-website `
  --index-document index.html `
  --404-document 404.html `
  --auth-mode login

# Sync site folder to $web container
Write-Host "`n[2/3] Uploading files to `$web container..."
az storage blob sync `
  --account-name $StorageAccount `
  --source $SourcePath `
  --container "`$web" `
  --delete-destination true `
  --auth-mode login

# Get the static website URL
Write-Host "`n[3/3] Retrieving site URL..."
$url = az storage account show `
  --name $StorageAccount `
  --resource-group $ResourceGroup `
  --query "primaryEndpoints.web" `
  --output tsv

Write-Host "`nDeploy complete!" -ForegroundColor Green
Write-Host "Site URL: $url" -ForegroundColor Yellow
Write-Host ""
