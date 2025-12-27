#!/bin/bash
set -e

cd /home/evo/homa-dashboard

# Set Node environment (nvm)
export NVM_DIR="/home/evo/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct Node version
export PATH="/home/evo/.nvm/versions/node/v24.10.0/bin:$PATH"

# Build the application
echo "Building homa-dashboard..."
npm run build

# Run the application
echo "Starting homa-dashboard..."
exec npm run start
