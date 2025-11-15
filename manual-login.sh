#!/bin/bash
# Manual Wrangler Login
# Powered by BrainSAIT | برينسايت

echo "🔐 Manual Wrangler Login"
echo "========================"
echo ""
echo "This will open your browser. You have 2 minutes to:"
echo "1. Check if browser opens automatically"
echo "2. If not, copy the URL manually and paste in browser"
echo "3. Click 'Allow' on the Cloudflare page"
echo "4. Wait for 'Successfully logged in!' message"
echo ""
echo "Press Enter to start..."
read

# Clear any existing token
unset CLOUDFLARE_API_TOKEN

# Try login with increased verbosity
echo ""
echo "Starting OAuth login..."
echo "⚠️  IMPORTANT: Watch for the browser to open!"
echo ""

wrangler login --verbose 2>&1 | tee /tmp/wrangler-login.log &

# Wait a bit for the URL to be generated
sleep 3

# Extract and show the URL
echo ""
echo "If browser didn't open, manually visit this URL:"
grep -o 'https://dash.cloudflare.com/oauth2/auth[^"]*' /tmp/wrangler-login.log | head -1
echo ""
echo "⏰ You have 2 minutes to authorize in browser..."
echo ""

# Wait for the login process
wait

echo ""
echo "Powered by BrainSAIT | برينسايت"
