#!/bin/bash
# BrainSAIT RAG - Setup Worker Secrets
# Powered by BrainSAIT | برينسايت

echo "🔐 Setting up Cloudflare Worker Secrets"
echo "========================================"
echo ""
echo "⚠️  SECURITY: These secrets will be encrypted and stored securely by Cloudflare"
echo ""

# Gemini API Key
echo "Setting GEMINI_API_KEY..."
wrangler secret put GEMINI_API_KEY
echo "✅ Gemini API key set"
echo ""

# Claude API Key
echo "Setting CLAUDE_API_KEY..."
wrangler secret put CLAUDE_API_KEY
echo "✅ Claude API key set"
echo ""

# OpenAI API Key
echo "Setting OPENAI_API_KEY..."
wrangler secret put OPENAI_API_KEY
echo "✅ OpenAI API key set"
echo ""

echo "🎉 All secrets configured!"
echo ""
echo "Verify with:"
echo "  wrangler secret list"
echo ""
echo "⚠️  IMPORTANT: Delete this script after use for security:"
echo "  rm setup-secrets.sh"
echo ""
echo "Powered by BrainSAIT | برينسايت"
