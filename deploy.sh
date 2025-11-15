#!/bin/bash
# BrainSAIT RAG - Cloudflare Deployment Script
# Powered by BrainSAIT | برينسايت

set -e  # Exit on error

echo "🚀 BrainSAIT RAG Deployment Script"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "wrangler.toml" ]; then
    echo "❌ Error: wrangler.toml not found. Are you in /Users/fadil369/rag?"
    exit 1
fi

echo -e "${BLUE}Step 1: Switching to production services...${NC}"
if [ -f "files/services-production.js" ]; then
    # Backup dev services if not already done
    if [ -f "files/services.js" ] && [ ! -f "files/services-dev.js" ]; then
        mv files/services.js files/services-dev.js
        echo "✅ Backed up development services to files/services-dev.js"
    fi

    # Use production services
    cp files/services-production.js files/services.js
    echo "✅ Using production services (Worker-based)"
else
    echo "⚠️  services-production.js not found, using existing services.js"
fi

echo ""
echo -e "${BLUE}Step 2: Verifying Wrangler login...${NC}"
if wrangler whoami > /dev/null 2>&1; then
    echo "✅ Logged in to Cloudflare"
    wrangler whoami
else
    echo "❌ Not logged in. Please run: wrangler login"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Checking Worker secrets...${NC}"
echo "Listing configured secrets:"
wrangler secret list 2>/dev/null || echo "⚠️  Run: wrangler secret put GEMINI_API_KEY (etc.)"

echo ""
echo -e "${YELLOW}Ready to deploy? Press Enter to continue or Ctrl+C to cancel...${NC}"
read

echo ""
echo -e "${BLUE}Step 4: Deploying Worker (API Backend)...${NC}"
wrangler deploy
echo "✅ Worker deployed!"

echo ""
echo -e "${BLUE}Step 5: Deploying Pages (Frontend)...${NC}"
wrangler pages deploy files --project-name=brainsait-rag || {
    echo "Creating Pages project first..."
    wrangler pages project create brainsait-rag
    wrangler pages deploy files --project-name=brainsait-rag
}
echo "✅ Pages deployed!"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Configure custom domains in Cloudflare Dashboard:"
echo "   - Worker: rag-api.brainsait.io"
echo "   - Pages: rag.brainsait.io"
echo ""
echo "2. Test your deployment:"
echo "   - Worker health: curl https://brainsait-rag-api.{your-subdomain}.workers.dev/health"
echo "   - Pages: Open the URL shown above in your browser"
echo ""
echo "3. Monitor logs:"
echo "   - wrangler tail"
echo ""
echo -e "${GREEN}Powered by BrainSAIT | برينسايت${NC}"
