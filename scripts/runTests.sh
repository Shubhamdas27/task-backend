#!/bin/bash

echo "🚀 Starting Full API Test Suite"
echo "================================"

# Check if server is running
echo "📡 Checking if backend server is running..."
curl -s http://localhost:5000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running. Please start it first:"
    echo "   cd d:/Assignment/scalable-web-app/backend"
    echo "   npm start"
    exit 1
fi

echo ""
echo "🌱 Running database seed..."
cd d:/Assignment/scalable-web-app/backend
node scripts/seedData.js

echo ""
echo "🧪 Running API tests..."
node scripts/testAPI.js

echo ""
echo "🎉 Complete! Check the output above for test results."