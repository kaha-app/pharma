Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kathmandu Pharmacy Scraper - Tier 1" -ForegroundColor Cyan
Write-Host "  120 queries | Depth 5 | NEW FILE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output: raw-results-depth5.csv (won't overwrite existing)" -ForegroundColor Green
Write-Host "Starting scraper... This will take 60-90 minutes" -ForegroundColor Yellow
Write-Host ""

$currentPath = (Get-Location).Path

docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/raw-results-depth5.csv -c 1 -depth 5 -lang en

Write-Host ""
Write-Host "Scraping complete! Counting results..." -ForegroundColor Green
Write-Host ""

if (Test-Path "raw-results-depth5.csv") {
    $lineCount = (Get-Content raw-results-depth5.csv | Measure-Object -Line).Lines - 1
    Write-Host "✅ Scraped $lineCount pharmacies from 120 queries" -ForegroundColor Green
    Write-Host "   Average: $([math]::Round($lineCount / 120, 1)) results per query" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "Now processing data..." -ForegroundColor Yellow
    node scripts/process-pharmacies-depth5.js
    
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
Write-Host "  File: raw-results-depth5.csv" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

