@echo off
echo 🚀 Starting TaskFlow Backend Server
echo ===================================

cd /d "d:\Assignment\scalable-web-app\backend"
echo 📂 Current directory: %cd%
echo.

if not exist server.js (
    echo ❌ Error: server.js not found in current directory
    echo Please make sure you're in the correct backend directory
    pause
    exit /b 1
)

echo 🟢 Starting server...
node server.js