Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kathmandu Pharmacy Scraper - Tier 1" -ForegroundColor Cyan
Write-Host "  120 queries | 30 areas | ~3,000-4,000 pharmacies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting scraper... This will take 45-60 minutes" -ForegroundColor Yellow
Write-Host ""

$currentPath = (Get-Location).Path

docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/raw-results.csv -c 1 -depth 5 -lang en

Write-Host ""
Write-Host "Scraping complete! Processing data..." -ForegroundColor Green
Write-Host ""

node scripts/process-pharmacies.js

Write-Host ""
Write-Host "Importing to database..." -ForegroundColor Green
Write-Host ""

cd ../backend
npm run import-data
cd ../scraper

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete! Data saved to:" -ForegroundColor Cyan
Write-Host "  - scraper/pharmacies.json (JSON file)" -ForegroundColor White
Write-Host "  - PostgreSQL database (pharmacy_db)" -ForegroundColor White
Write-Host "  - API: http://localhost:3000/api/pharmacies" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

