Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kathmandu Pharmacy Scraper - Tier 2" -ForegroundColor Cyan
Write-Host "  80 queries | 20 areas | Depth 5" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output: raw-results-tier2.csv" -ForegroundColor Green
Write-Host "Starting scraper... This will take 40-50 minutes" -ForegroundColor Yellow
Write-Host ""

$currentPath = (Get-Location).Path

docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input-tier2.txt -results /scraper-test/raw-results-tier2.csv -c 1 -depth 5 -lang en

Write-Host ""
Write-Host "Scraping complete! Counting results..." -ForegroundColor Green
Write-Host ""

if (Test-Path "raw-results-tier2.csv") {
    $lineCount = (Get-Content raw-results-tier2.csv | Measure-Object -Line).Lines - 1
    Write-Host "✅ Scraped $lineCount pharmacies from 80 queries" -ForegroundColor Green
    Write-Host "   Average: $([math]::Round($lineCount / 80, 1)) results per query" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "Now processing data..." -ForegroundColor Yellow
    node scripts/process-tier2.js
    
    Write-Host ""
    Write-Host "Importing to database..." -ForegroundColor Yellow
    cd ../backend
    npm run import-data
    cd ../scraper
} else {
    Write-Host "❌ No results file found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Scraping Complete!" -ForegroundColor Cyan
Write-Host "  File: raw-results-tier2.csv" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
