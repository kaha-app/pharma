$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = "backups/$timestamp"

Write-Host "Creating backup of CLEAN data only..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null

# Only backup the processed, deduplicated JSON file
if (Test-Path "pharmacies.json") {
    Copy-Item "pharmacies.json" "$backupFolder/pharmacies.json"
    
    # Get count of pharmacies
    $json = Get-Content "pharmacies.json" | ConvertFrom-Json
    $count = $json.Count
    
    Write-Host "✅ Backed up pharmacies.json ($count unique pharmacies)" -ForegroundColor Green
    Write-Host "   No duplicates, clean data only" -ForegroundColor Gray
} else {
    Write-Host "❌ pharmacies.json not found. Run scraper first." -ForegroundColor Red
}

Write-Host "Backup saved to: $backupFolder" -ForegroundColor Cyan
