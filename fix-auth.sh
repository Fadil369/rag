#!/bin/bash
# Fix Cloudflare Authentication
# Powered by BrainSAIT | برينسايت

echo "🔧 Fixing Cloudflare Authentication"
echo "===================================="
echo ""

echo "Current issue: API token lacks permissions for Workers deployment"
echo ""
echo "Recommended fix: Use OAuth login (gives full permissions)"
echo ""
echo "Running: wrangler login"
echo ""

# Unset the token to use OAuth
unset CLOUDFLARE_API_TOKEN

# Login with OAuth
wrangler login

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully authenticated!"
    echo ""
    echo "You can now deploy:"
    echo "  ./setup-secrets.sh"
    echo "  ./deploy.sh"
else
    echo ""
    echo "❌ Login failed. Please try:"
    echo "  1. Check your internet connection"
    echo "  2. Allow pop-ups in your browser"
    echo "  3. Try again: wrangler login"
fi

echo ""
echo "Powered by BrainSAIT | برينسايت"
