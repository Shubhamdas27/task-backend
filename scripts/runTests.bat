@echo off
echo 🚀 Starting Full API Test Suite
echo ================================

echo 📡 Checking if backend server is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server is not running. Please start it first:
    echo    cd d:\Assignment\scalable-web-app\backend
    echo    npm start
    exit /b 1
)

echo.
echo 🌱 Running database seed...
cd /d "d:\Assignment\scalable-web-app\backend"
node scripts/seedData.js

echo.
echo 🧪 Running API tests...
node scripts/testAPI.js

echo.
echo 🎉 Complete! Check the output above for test results.
pause