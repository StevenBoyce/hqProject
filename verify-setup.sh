#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verifying Layout Builder setup...${NC}"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if package-lock.json files exist
if [ ! -f "backend/package-lock.json" ]; then
    echo -e "${RED}❌ Backend package-lock.json not found. Run ./setup.sh first${NC}"
    exit 1
fi

if [ ! -f "frontend/package-lock.json" ]; then
    echo -e "${RED}❌ Frontend package-lock.json not found. Run ./setup.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package lock files found${NC}"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ docker-compose is available${NC}"

# Check if all required files exist
required_files=(
    "backend/Dockerfile"
    "backend/package.json"
    "backend/src/index.ts"
    "backend/prisma/schema.prisma"
    "frontend/Dockerfile"
    "frontend/package.json"
    "frontend/src/App.tsx"
    "frontend/index.html"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All required files present${NC}"
echo ""
echo -e "${GREEN}🎉 Setup verification complete! You're ready to run:${NC}"
echo -e "${YELLOW}docker-compose up --build${NC}" 