#!/bin/bash

# Kill any process running on port 3000
echo "🔍 Checking for processes on port 3000..."
PORT_PID=$(lsof -ti:3000)

if [ ! -z "$PORT_PID" ]; then
    echo "⚠️  Found process $PORT_PID running on port 3000"
    echo "🔪 Killing process..."
    kill -9 $PORT_PID 2>/dev/null
    sleep 1
    echo "✅ Process killed"
else
    echo "✅ Port 3000 is available"
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server on port 3000
echo "🚀 Starting Homa Dashboard on port 3000..."
echo "📱 Access at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "────────────────────────────────────"
echo ""

# Run the development server with port 3000 explicitly
PORT=3000 npm run dev