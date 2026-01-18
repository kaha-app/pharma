Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SCRAPE - 5 queries" -ForegroundColor Cyan
Write-Host "  Testing depth=5 setting" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting test scrape... (~3-5 minutes)" -ForegroundColor Yellow
Write-Host ""

$currentPath = (Get-Location).Path

docker run --rm -v "${currentPath}:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input-test-5.txt -results /scraper-test/raw-results-test-5.csv -c 1 -depth 5 -lang en

Write-Host ""
Write-Host "Test complete! Processing data..." -ForegroundColor Green
Write-Host ""

# Count results
if (Test-Path "raw-results-test-5.csv") {
    $lineCount = (Get-Content raw-results-test-5.csv | Measure-Object -Line).Lines - 1
    Write-Host "✅ Scraped $lineCount pharmacies from 5 queries" -ForegroundColor Green
    Write-Host "   Average: $([math]::Round($lineCount / 5, 1)) results per query" -ForegroundColor Gray
} else {
    Write-Host "❌ No results file found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Check raw-results-test-5.csv" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
