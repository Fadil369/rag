#!/bin/bash
# Setup New Cloudflare Token
# Powered by BrainSAIT | برينسايت

echo "🔑 Setup New Cloudflare Token"
echo "=============================="
echo ""
echo "After creating your token from:"
echo "  https://dash.cloudflare.com/profile/api-tokens"
echo ""
echo "Paste your new token here (then press Enter):"
read -r NEW_TOKEN

if [ -z "$NEW_TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

echo ""
echo "Testing token..."

# Test the token
VERIFY=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${NEW_TOKEN}")

if echo "$VERIFY" | grep -q '"success":true'; then
    echo "✅ Token is VALID!"
    echo ""

    # Set for current session
    export CLOUDFLARE_API_TOKEN="${NEW_TOKEN}"

    # Test with Wrangler
    echo "Testing with Wrangler..."
    wrangler whoami

    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Everything works!"
        echo ""
        echo "To make permanent, run:"
        echo "  echo 'export CLOUDFLARE_API_TOKEN=\"${NEW_TOKEN}\"' >> ~/.zshrc"
        echo "  source ~/.zshrc"
        echo ""
        echo "For now, your token is active in this terminal session."
        echo ""
        echo "Next steps:"
        echo "  ./setup-secrets.sh"
        echo "  ./deploy.sh"
    else
        echo ""
        echo "⚠️  Token works with Cloudflare but might lack Workers permissions"
        echo "Make sure you used 'Edit Cloudflare Workers' template"
    fi
else
    echo "❌ Token is INVALID"
    echo ""
    echo "Response:"
    echo "$VERIFY" | jq '.'
    echo ""
    echo "Please try creating the token again"
fi

echo ""
echo "Powered by BrainSAIT | برينسايت"
