#!/bin/bash

# ========================================
# 🚀 Selvadentro Dashboard - Deployment Script
# ========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Selvadentro Dashboard - Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "${YELLOW}Please create a .env file with your configuration${NC}"
    exit 1
fi

# Load environment variables from .env
echo -e "${YELLOW}📋 Loading environment variables from .env...${NC}"
set -a
source .env
set +a

# Check required variables
REQUIRED_VARS=(
    "VITE_GHL_API_KEY"
    "VITE_GHL_ACCESS_TOKEN"
    "VITE_GHL_LOCATION_ID"
    "VITE_N8N_BASE_URL"
)

MISSING_VARS=()
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        MISSING_VARS+=("$VAR")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for VAR in "${MISSING_VARS[@]}"; do
        echo -e "${RED}   - $VAR${NC}"
    done
    exit 1
fi

echo -e "${GREEN}✅ All required variables found${NC}"
echo ""

# Ask for deployment method
echo -e "${YELLOW}Select deployment method:${NC}"
echo "1) Docker build (local)"
echo "2) Docker build and push to registry"
echo "3) Build static files only (dist/)"
echo ""
read -p "Enter option (1-3): " DEPLOY_METHOD

case $DEPLOY_METHOD in
    1)
        echo -e "${BLUE}🐳 Building Docker image locally...${NC}"
        docker build \
            --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
            --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
            --build-arg VITE_GHL_API_KEY="${VITE_GHL_API_KEY}" \
            --build-arg VITE_GHL_ACCESS_TOKEN="${VITE_GHL_ACCESS_TOKEN}" \
            --build-arg VITE_GHL_LOCATION_ID="${VITE_GHL_LOCATION_ID}" \
            --build-arg VITE_ANTHROPIC_API_KEY="${VITE_ANTHROPIC_API_KEY}" \
            --build-arg VITE_N8N_BASE_URL="${VITE_N8N_BASE_URL}" \
            --build-arg VITE_N8N_WEBHOOK_PATH="${VITE_N8N_WEBHOOK_PATH:-/webhook/selvadentro}" \
            --build-arg VITE_DASHBOARD_URL="${VITE_DASHBOARD_URL}" \
            -t selvadentro-dashboard:latest .

        echo ""
        echo -e "${GREEN}✅ Docker image built successfully!${NC}"
        echo ""
        echo -e "${YELLOW}To run the container:${NC}"
        echo -e "${BLUE}docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest${NC}"
        ;;

    2)
        read -p "Enter Docker registry URL (e.g., registry.example.com/selvadentro): " REGISTRY_URL

        echo -e "${BLUE}🐳 Building and pushing Docker image...${NC}"
        docker build \
            --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
            --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
            --build-arg VITE_GHL_API_KEY="${VITE_GHL_API_KEY}" \
            --build-arg VITE_GHL_ACCESS_TOKEN="${VITE_GHL_ACCESS_TOKEN}" \
            --build-arg VITE_GHL_LOCATION_ID="${VITE_GHL_LOCATION_ID}" \
            --build-arg VITE_ANTHROPIC_API_KEY="${VITE_ANTHROPIC_API_KEY}" \
            --build-arg VITE_N8N_BASE_URL="${VITE_N8N_BASE_URL}" \
            --build-arg VITE_N8N_WEBHOOK_PATH="${VITE_N8N_WEBHOOK_PATH:-/webhook/selvadentro}" \
            --build-arg VITE_DASHBOARD_URL="${VITE_DASHBOARD_URL}" \
            -t ${REGISTRY_URL}:latest .

        echo -e "${BLUE}📤 Pushing to registry...${NC}"
        docker push ${REGISTRY_URL}:latest

        echo ""
        echo -e "${GREEN}✅ Image pushed successfully!${NC}"
        echo -e "${YELLOW}Image URL: ${REGISTRY_URL}:latest${NC}"
        ;;

    3)
        echo -e "${BLUE}📦 Building static files...${NC}"
        npm run build

        echo ""
        echo -e "${GREEN}✅ Build completed!${NC}"
        echo -e "${YELLOW}Static files are in: dist/${NC}"
        echo ""
        echo -e "${YELLOW}To deploy:${NC}"
        echo "1. Upload dist/ to your web server"
        echo "2. Or use: scp -r dist/* user@server:/path/to/webroot/"
        ;;

    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${BLUE}========================================${NC}"
