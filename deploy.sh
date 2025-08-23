#!/bin/bash

# 🚀 Veritas Production Deployment Script
# This script builds and deploys your Veritas application

set -e  # Exit on any error

echo "🚀 Starting Veritas Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found!${NC}"
    echo "Please create .env.local with your production environment variables"
    echo "You can copy from env.production.example"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ is required. Current version: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Show build stats
echo "📊 Build Statistics:"
echo "Total size: $(du -sh .next | cut -f1)"
echo "Static pages: $(find .next/server/app -name "*.html" | wc -l)"
echo "API routes: $(find .next/server/app/api -name "*.js" | wc -l)"

# Test production build locally
echo "🧪 Testing production build..."
timeout 30s npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Production build test successful!${NC}"
    kill $SERVER_PID 2>/dev/null || true
else
    echo -e "${RED}❌ Production build test failed!${NC}"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy the .next folder to your production server"
echo "2. Set up your production environment variables"
echo "3. Start the application with: npm run start"
echo ""
echo "Or use Docker:"
echo "docker build -t veritas ."
echo "docker run -d -p 3000:3000 --env-file .env.local veritas"
echo ""
echo "Or use docker-compose:"
echo "docker-compose up -d"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo "🔒 Make sure your production environment is secure!"
