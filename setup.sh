#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Layout Builder project...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    echo -e "${YELLOW}📥 Download from: https://nodejs.org/${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) and npm $(npm --version) detected${NC}"

# Create package-lock.json files for both frontend and backend
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
if npm install; then
    echo -e "${GREEN}✅ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd frontend
if npm install; then
    echo -e "${GREEN}✅ Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
echo ""
echo -e "${YELLOW}🎯 Next steps:${NC}"
echo "1. Run: docker-compose up --build"
echo "2. Visit: http://localhost:3000"
echo "3. You should see 'Hello World' and the current GMT time"
echo ""
echo -e "${YELLOW}🔧 If you encounter any issues:${NC}"
echo "- Run: docker-compose down -v"
echo "- Then: docker-compose up --build"
echo ""
echo -e "${BLUE}💡 Tip: Make sure Docker Desktop is running before starting the containers${NC}" 