@echo off
echo Testing Pharmacy API on dev.kaha.com.np
echo ==========================================
echo.

echo 1. Testing health endpoint...
curl -i https://dev.kaha.com.np/pharmacy/health
echo.
echo.

echo 2. Testing API docs...
curl -i https://dev.kaha.com.np/pharmacy/api/v1/docs
echo.
echo.

echo 3. Testing pharmacies list...
curl -i https://dev.kaha.com.np/pharmacy/api/v1/pharmacies?limit=2
echo.
echo.

echo 4. Testing stats...
curl -i https://dev.kaha.com.np/pharmacy/api/v1/stats
echo.
echo.

pause
