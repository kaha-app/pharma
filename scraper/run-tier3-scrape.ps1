Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kathmandu Pharmacy Scraper - Tier 3" -ForegroundColor Cyan
Write-Host "  40 queries | 10 areas | Depth 5" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output: raw-results-tier3.csv" -ForegroundColor Green
Write-Host "Starting scraper... This will take 20-30 minutes" -ForegroundColor Yellow
Write-Host ""

$currentPath = (Get-Location).Path

docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input-tier3.txt -results /scraper-test/raw-results-tier3.csv -c 1 -depth 5 -lang en

Write-Host ""
Write-Host "Scraping complete! Counting results..." -ForegroundColor Green
Write-Host ""

if (Test-Path "raw-results-tier3.csv") {
    $lineCount = (Get-Content raw-results-tier3.csv | Measure-Object -Line).Lines - 1
    Write-Host "✅ Scraped $lineCount pharmacies from 40 queries" -ForegroundColor Green
    Write-Host "   Average: $([math]::Round($lineCount / 40, 1)) results per query" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "Now processing data..." -ForegroundColor Yellow
    node scripts/process-tier3.js
    
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
Write-Host "  ALL TIERS COMPLETE!" -ForegroundColor Cyan
Write-Host "  Check database for final count" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
