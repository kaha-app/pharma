@echo off
echo ========================================
echo Import Pharmacy Data to Dev Server
echo ========================================
echo.

echo Step 1: You need to open SSH tunnel in another terminal
echo Run this command in a separate CMD window:
echo.
echo   ssh -L 5432:localhost:5432 ubuntu@202.51.83.186
echo.
echo Keep that window open, then press any key here to continue...
pause >nul

echo.
echo Step 2: Testing database connection through tunnel...
psql -U kaha-dev -h localhost -p 5432 -d postgres -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to database through SSH tunnel
    echo Make sure the SSH tunnel is running!
    pause
    exit /b 1
)
echo SUCCESS: Connected to database!

echo.
echo Step 3: Creating pharmacy_db database...
psql -U kaha-dev -h localhost -p 5432 -d postgres -c "CREATE DATABASE pharmacy_db;" 2>nul
echo Database created (or already exists)

echo.
echo Step 4: Initializing database schema...
cd backend
call npm run init-db
if errorlevel 1 (
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)

echo.
echo Step 5: Importing pharmacy data...
call npm run import-data
if errorlevel 1 (
    echo ERROR: Failed to import data
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! All data imported to dev server
echo ========================================
echo.
echo You can now close the SSH tunnel terminal.
pause
