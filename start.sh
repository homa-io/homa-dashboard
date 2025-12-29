#!/bin/bash
set -e

WORK_DIR="/home/evo/homa-dashboard"
PORT=3000  # Dashboard port

cd "$WORK_DIR"

# Set Node environment (nvm)
export NVM_DIR="/home/evo/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct Node version
export PATH="/home/evo/.nvm/versions/node/v24.10.0/bin:$PATH"

echo "Homa Dashboard startup script"
echo "Port: $PORT"

# Kill any old instances using the port
echo "Checking for old instances on port $PORT..."
if fuser -k "$PORT/tcp" 2>/dev/null; then
    echo "Killed old process on port $PORT"
    sleep 2
fi

# Also kill any existing next-server processes for this project
pkill -f "next-server.*homa-dashboard" 2>/dev/null || true
sleep 1

# Fix damaged .next build cache
echo "Checking Next.js build cache..."
if [ -d ".next" ]; then
    # Check for missing or corrupted manifest files
    if [ ! -f ".next/routes-manifest.json" ] || [ ! -f ".next/build-manifest.json" ]; then
        echo "Build cache corrupted, cleaning..."
        rm -rf .next
    fi
fi

# Ensure node_modules are present
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building homa-dashboard..."
npm run build

# Run the application
echo "Starting homa-dashboard on port $PORT..."
exec npm run start
