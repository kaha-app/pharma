@echo off
REM Pharmacy API Deployment Script for Windows
REM Usage: deploy.bat [dev|prod]

setlocal

set MODE=%1
if "%MODE%"=="" set MODE=dev

echo 🚀 Deploying Pharmacy API in %MODE% mode...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

if "%MODE%"=="prod" (
    echo 📦 Building production image...
    docker-compose -f docker-compose.prod.yml build
    
    echo 🚀 Starting production container...
    docker-compose -f docker-compose.prod.yml up -d
    
    echo ⏳ Waiting for container to start...
    timeout /t 5 /nobreak >nul
    
    echo 📋 Container logs:
    docker logs --tail 20 pharmacy-api-prod
    
    echo.
    echo ✅ Production deployment complete!
    echo 📍 API: http://localhost:3001/pharmacy/api/pharmacies
    echo 📍 Health: http://localhost:3001/health
    echo 📋 Logs: docker logs -f pharmacy-api-prod
    
) else (
    echo 🚀 Starting dev server container...
    docker-compose -f docker-compose.server.yml up -d
    
    echo ⏳ Waiting for container to start...
    timeout /t 5 /nobreak >nul
    
    echo 📋 Container logs:
    docker logs --tail 20 pharmacy-api
    
    echo.
    echo ✅ Dev server deployment complete!
    echo 📍 API: http://localhost:3001/pharmacy/api/pharmacies
    echo 📍 Health: http://localhost:3001/health
    echo 📋 Logs: docker logs -f pharmacy-api
)

echo.
echo 🧪 Testing health endpoint...
timeout /t 2 /nobreak >nul
curl -s http://localhost:3001/health

endlocal
