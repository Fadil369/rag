# 🚀 Quick Deployment Guide

## Deploy BrainSAIT RAG to Cloudflare
**Powered by BrainSAIT | برينسايت**

---

## ⚡ 5-Minute Deploy

### Prerequisites
```bash
npm install -g wrangler
wrangler login
```

### 1. Deploy Worker (Backend)
```bash
# Set API keys
wrangler secret put GEMINI_API_KEY
wrangler secret put CLAUDE_API_KEY
wrangler secret put OPENAI_API_KEY

# Deploy
wrangler deploy
```

### 2. Switch to Production Services
```bash
# Use Worker-based services
mv files/services.js files/services-dev.js
mv files/services-production.js files/services.js
```

### 3. Deploy Pages (Frontend)
```bash
wrangler pages deploy files --project-name=brainsait-rag
```

### 4. Configure Domains
In Cloudflare Dashboard:
- Worker: `rag-api.brainsait.io`
- Pages: `rag.brainsait.io`

### 5. Test
```bash
# Test backend
curl https://rag-api.brainsait.io/health

# Test frontend
open https://rag.brainsait.io
```

---

## 📁 Project Structure

```
/Users/fadil369/rag/
├── worker/
│   └── index.js                    # Cloudflare Worker (API proxy)
├── files/
│   ├── demo.html                   # Frontend entry
│   ├── app.js                      # React application
│   ├── services.js                 # Production services (uses Worker)
│   ├── services-dev.js             # Dev services (direct API calls)
│   ├── _headers                    # Security headers
│   └── _redirects                  # Routing rules
├── wrangler.toml                   # Worker configuration
├── CLOUDFLARE_DEPLOYMENT.md        # Full deployment guide
└── DEPLOYMENT_QUICK_START.md       # This file
```

---

## 🔑 Environment Variables

### Worker Secrets (via wrangler)
- `GEMINI_API_KEY` - Google Gemini API key
- `CLAUDE_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI API key

No environment variables needed for Pages (frontend calls Worker)

---

## 🌐 URLs After Deployment

- **Frontend**: https://rag.brainsait.io
- **API**: https://rag-api.brainsait.io
- **Health Check**: https://rag-api.brainsait.io/health

---

## 📊 Monitoring

```bash
# Watch Worker logs
wrangler tail

# View analytics
# Cloudflare Dashboard > Workers & Pages > brainsait-rag-api
```

---

## 🔄 Updates

### Update Worker
```bash
# Edit worker/index.js
wrangler deploy
```

### Update Frontend
```bash
# Edit files/*
wrangler pages deploy files --project-name=brainsait-rag
```

---

## 🐛 Common Issues

### Issue: Worker not found
```bash
wrangler whoami          # Verify login
wrangler deploy          # Redeploy
```

### Issue: API keys not working
```bash
wrangler secret list     # Check secrets
wrangler secret put GEMINI_API_KEY  # Reset
```

### Issue: CORS errors
Update `worker/index.js`:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://rag.brainsait.io',
  // ... rest
};
```

---

## 💡 Tips

1. **Free Tier**: 100k requests/day free on Workers
2. **Instant Deploy**: Changes live in < 30 seconds
3. **Global CDN**: Automatic worldwide distribution
4. **Zero Config**: No server management needed
5. **Auto SSL**: Free SSL certificates included

---

## 📞 Need Help?

- Full Guide: [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)
- Cloudflare Docs: https://developers.cloudflare.com
- BrainSAIT Support: support@brainsait.io

---

**Powered by BrainSAIT | برينسايت**
