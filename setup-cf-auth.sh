#!/bin/bash
# Setup Cloudflare Authentication
# Powered by BrainSAIT | برينسايت

echo "🔐 Setting up Cloudflare Authentication"
echo "========================================"
echo ""

# Export API token
export CLOUDFLARE_API_TOKEN="IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC"

echo "✅ Cloudflare API token set for this session"
echo ""

# Verify authentication
echo "Verifying authentication..."
wrangler whoami

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully authenticated with Cloudflare!"
    echo ""
    echo "You can now run deployment commands:"
    echo "  ./setup-secrets.sh"
    echo "  ./deploy.sh"
    echo ""
    echo "Or make this permanent by adding to your shell profile:"
    echo "  echo 'export CLOUDFLARE_API_TOKEN=\"IXRg-qPB7Yn5eoVzLgPtsOYRK4j1oj_2mS0cZSBC\"' >> ~/.zshrc"
    echo "  source ~/.zshrc"
else
    echo ""
    echo "❌ Authentication failed. Please check your API token."
fi

echo ""
echo "Powered by BrainSAIT | برينسايت"
