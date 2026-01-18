#!/usr/bin/env pwsh
# Merge All Tiers - Process all pharmacy data in sequence

Write-Host "Merging All Pharmacy Tiers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if all CSV files exist
$csvFiles = @(
    "raw-results.csv",
    "raw-results-tier2.csv",
    "raw-results-tier3.csv",
    "raw-results-tier4.csv"
)

$missing = @()
foreach ($file in $csvFiles) {
    if (-not (Test-Path "scraper/$file")) {
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing CSV files:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Run the scraper scripts first!" -ForegroundColor Yellow
    exit 1
}

# Backup existing pharmacies.json if it exists
if (Test-Path "scraper/pharmacies.json") {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = "scraper/pharmacies-backup-$timestamp.json"
    Write-Host "Backing up existing pharmacies.json" -ForegroundColor Yellow
    Copy-Item "scraper/pharmacies.json" $backupFile
}

# Process Tier 1
Write-Host ""
Write-Host "Processing Tier 1..." -ForegroundColor Green
node scraper/scripts/process-pharmacies.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tier 1 processing failed!" -ForegroundColor Red
    exit 1
}

# Process Tier 2
Write-Host ""
Write-Host "Processing Tier 2..." -ForegroundColor Green
node scraper/scripts/process-tier2.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tier 2 processing failed!" -ForegroundColor Red
    exit 1
}

# Process Tier 3
Write-Host ""
Write-Host "Processing Tier 3..." -ForegroundColor Green
node scraper/scripts/process-tier3.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tier 3 processing failed!" -ForegroundColor Red
    exit 1
}

# Process Tier 4
Write-Host ""
Write-Host "Processing Tier 4..." -ForegroundColor Green
node scraper/scripts/process-tier4.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tier 4 processing failed!" -ForegroundColor Red
    exit 1
}

# Final summary
Write-Host ""
Write-Host "All tiers merged successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Final pharmacies.json contains all data from:" -ForegroundColor Cyan
Write-Host "   Tier 1 (raw-results.csv)" -ForegroundColor Green
Write-Host "   Tier 2 (raw-results-tier2.csv)" -ForegroundColor Green
Write-Host "   Tier 3 (raw-results-tier3.csv)" -ForegroundColor Green
Write-Host "   Tier 4 (raw-results-tier4.csv)" -ForegroundColor Green

$count = (Get-Content "scraper/pharmacies.json" -Raw | ConvertFrom-Json).Count
Write-Host ""
Write-Host "Total pharmacies: $count" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready to import to database!" -ForegroundColor Green
Write-Host "Run: npm run import-data" -ForegroundColor Yellow
