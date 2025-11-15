#!/bin/bash
# Test Cloudflare API Token
# Powered by BrainSAIT | برينسايت

echo "🧪 Testing Cloudflare API Token"
echo "================================"
echo ""

TOKEN="1234567893feefc5f0q5000bfo0c38d90bbeb"

echo "Step 1: Verifying token is valid..."
VERIFY_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${TOKEN}")

echo "$VERIFY_RESPONSE" | jq '.'

if echo "$VERIFY_RESPONSE" | jq -e '.success == true' > /dev/null 2>&1; then
    echo ""
    echo "✅ Token is VALID"
    echo ""
    echo "Token Details:"
    echo "$VERIFY_RESPONSE" | jq -r '.result | "Status: \(.status)\nExpires: \(.expires_on // "Never")"'

    echo ""
    echo "Step 2: Setting token for Wrangler..."
    export CLOUDFLARE_API_TOKEN="${TOKEN}"

    echo "Step 3: Testing with Wrangler..."
    wrangler whoami

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Token works with Wrangler"
        echo ""
        echo "To make this permanent, run:"
        echo "  echo 'export CLOUDFLARE_API_TOKEN=\"${TOKEN}\"' >> ~/.zshrc"
        echo "  source ~/.zshrc"
        echo ""
        echo "Or just use it for this session:"
        echo "  export CLOUDFLARE_API_TOKEN=\"${TOKEN}\""
        echo ""
        echo "Then deploy:"
        echo "  ./setup-secrets.sh"
        echo "  ./deploy.sh"
    else
        echo ""
        echo "❌ Token doesn't have required permissions for Workers"
        echo ""
        echo "Please create a new token with 'Edit Cloudflare Workers' permissions:"
        echo "  https://dash.cloudflare.com/profile/api-tokens"
    fi
else
    echo ""
    echo "❌ Token is INVALID or has errors"
    echo ""
    echo "Error:"
    echo "$VERIFY_RESPONSE" | jq -r '.errors[]?.message // "Unknown error"'
    echo ""
    echo "Please create a new token:"
    echo "  https://dash.cloudflare.com/profile/api-tokens"
fi

echo ""
echo "Powered by BrainSAIT | برينسايت"
