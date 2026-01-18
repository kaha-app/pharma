$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = "backups/$timestamp"

Write-Host "Creating backup..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null

if (Test-Path "raw-results.csv") {
    Copy-Item "raw-results.csv" "$backupFolder/raw-results.csv"
    Write-Host "✅ Backed up raw-results.csv" -ForegroundColor Green
}

if (Test-Path "pharmacies.json") {
    Copy-Item "pharmacies.json" "$backupFolder/pharmacies.json"
    Write-Host "✅ Backed up pharmacies.json" -ForegroundColor Green
}

Write-Host "Backup saved to: $backupFolder" -ForegroundColor Cyan
