@echo off
echo ========================================
echo   Kathmandu Pharmacy Scraper
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Running Google Maps Scraper via Docker...
echo This may take 30-60 minutes for all areas.
echo.

docker run --rm -v "%cd%:/scraper-test" gosom/google-maps-scraper:latest-rod -input /scraper-test/input.txt -results /scraper-test/raw-results.csv -c 1 -depth 2 -lang en

echo.
echo Step 2: Processing results...
echo.

node scripts/process-pharmacies.js

echo.
echo ========================================
echo   Done! Check pharmacies.json
echo ========================================
pause
