# 🚀 Cloudflare Deployment Guide

## BrainSAIT RAG System - Production Deployment
**Powered by BrainSAIT | برينسايت**

Deploy to: `rag.brainsait.io`

---

## 📋 Prerequisites

### 1. Cloudflare Account Setup
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 2. Domain Configuration
- Domain: `brainsait.io`
- Worker subdomain: `rag-api.brainsait.io`
- Pages subdomain: `rag.brainsait.io`

### 3. API Keys Required
- Google Gemini API Key
- Anthropic Claude API Key
- OpenAI API Key

---

## 🔧 Part 1: Deploy Workers API (Backend)

### Step 1: Configure Worker Secrets
```bash
# Set API keys as secrets (never commit these!)
wrangler secret put GEMINI_API_KEY
# Paste your key: AIza...

wrangler secret put CLAUDE_API_KEY
# Paste your key: sk-ant-...

wrangler secret put OPENAI_API_KEY
# Paste your key: sk-...
```

### Step 2: Deploy Worker
```bash
# Deploy to production
wrangler deploy

# Or deploy to specific environment
wrangler deploy --env production
```

### Step 3: Verify Worker Deployment
```bash
# Test health endpoint
curl https://rag-api.brainsait.io/health

# Expected response:
# {"status":"ok","service":"BrainSAIT RAG API"}
```

### Step 4: Configure Custom Domain (in Cloudflare Dashboard)
1. Go to Workers & Pages > brainsait-rag-api
2. Click "Triggers" tab
3. Add Custom Domain: `rag-api.brainsait.io`
4. Wait for DNS propagation (~5 minutes)

---

## 🌐 Part 2: Deploy Pages (Frontend)

### Step 1: Update Frontend Configuration
Update `files/services-production.js` to use the Worker endpoint:
```javascript
const API_BASE_URL = 'https://rag-api.brainsait.io';
```

### Step 2: Rename Production Services File
```bash
# Use production services that call Worker instead of direct APIs
mv files/services.js files/services-dev.js
mv files/services-production.js files/services.js
```

### Step 3: Deploy to Cloudflare Pages

**Option A: Using Wrangler**
```bash
# From project root
wrangler pages deploy files --project-name=brainsait-rag

# Or create pages.json first:
wrangler pages project create brainsait-rag
wrangler pages deploy files --project-name=brainsait-rag
```

**Option B: Using Cloudflare Dashboard**
1. Go to Pages > Create Project
2. Connect to Git (GitHub/GitLab) OR
3. Direct Upload: Upload `files/` directory
4. Project name: `brainsait-rag`
5. Build settings:
   - Build command: (leave empty)
   - Build output directory: (leave empty, we're uploading pre-built)
6. Environment variables: (none needed for frontend)
7. Deploy!

### Step 4: Configure Custom Domain
1. In Pages project settings
2. Custom Domains > Set up custom domain
3. Add: `rag.brainsait.io`
4. Cloudflare auto-configures DNS
5. Wait for SSL certificate (~5 minutes)

---

## ✅ Verification Checklist

### Backend (Worker) Tests
```bash
# Test health
curl https://rag-api.brainsait.io/health

# Test Gemini endpoint (with curl)
curl -X POST https://rag-api.brainsait.io/api/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generateContent",
    "data": {
      "model": "gemini-2.5-flash-lite",
      "contents": [{"parts": [{"text": "Hello"}]}],
      "generationConfig": {"temperature": 0.7}
    }
  }'
```

### Frontend (Pages) Tests
```bash
# Visit in browser
open https://rag.brainsait.io

# Check SSL certificate
curl -I https://rag.brainsait.io

# Verify headers
curl -I https://rag.brainsait.io | grep -E "X-Frame-Options|Content-Security-Policy"
```

### End-to-End Test
1. Visit https://rag.brainsait.io
2. Upload a test PDF document
3. Ask a question in Arabic
4. Verify response from Gemini
5. Switch to Claude provider
6. Ask same question
7. Verify response from Claude
8. Test TTS playback
9. Check footer shows "Powered by BrainSAIT | برينسايت"

---

## 🔐 Security Configuration

### Environment Variables (Worker)
Set via Wrangler CLI (already done in Step 1):
- `GEMINI_API_KEY`
- `CLAUDE_API_KEY`
- `OPENAI_API_KEY`

### Rate Limiting (Built-in)
Current settings in `worker/index.js`:
- 20 requests per minute per IP
- Adjust in `RATE_LIMIT` object if needed

### CORS Configuration
Already configured in Worker for:
- Origin: `*` (consider restricting to `rag.brainsait.io` in production)
- Methods: GET, POST, OPTIONS
- Headers: Content-Type, Authorization

### Update CORS for Production (Optional)
Edit `worker/index.js`:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://rag.brainsait.io', // Restrict to your domain
  // ... rest of headers
};
```

---

## 📊 Monitoring & Analytics

### Cloudflare Analytics
1. Go to Workers & Pages > brainsait-rag-api
2. View analytics:
   - Requests per second
   - Error rate
   - CPU time
   - Success rate by endpoint

### Logs & Debugging
```bash
# Stream Worker logs in real-time
wrangler tail

# Filter by status code
wrangler tail --status error

# Filter by IP
wrangler tail --ip 1.2.3.4
```

### Set up Alerts (in Cloudflare Dashboard)
1. Notifications > Add
2. Create alerts for:
   - Error rate > 5%
   - Request rate spike
   - CPU time > threshold

---

## 🔄 Updates & CI/CD

### Manual Updates

**Update Worker:**
```bash
# Make changes to worker/index.js
# Then deploy
wrangler deploy
```

**Update Pages:**
```bash
# Make changes to files/
# Then deploy
wrangler pages deploy files --project-name=brainsait-rag
```

### Automated CI/CD (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy

  deploy-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: brainsait-rag
          directory: files
```

---

## 💰 Cost Estimation

### Workers Pricing (Free Tier)
- 100,000 requests/day: **FREE**
- 10ms CPU time per request
- Above limits: $0.50 per million requests

### Pages Pricing
- Unlimited requests: **FREE**
- Unlimited bandwidth: **FREE**
- 500 builds/month: **FREE**

### Estimated Monthly Cost
For typical usage (< 100k requests/day):
- Workers: **$0**
- Pages: **$0**
- **Total: $0/month**

For high usage (1M requests/day):
- Workers: ~$15/month
- Pages: **$0**
- **Total: ~$15/month**

---

## 🐛 Troubleshooting

### Issue: Worker deployment fails
```bash
# Check wrangler.toml syntax
wrangler validate

# Verify login
wrangler whoami

# Re-login if needed
wrangler logout
wrangler login
```

### Issue: API keys not working
```bash
# List current secrets
wrangler secret list

# Re-set secret
wrangler secret put GEMINI_API_KEY
```

### Issue: CORS errors
Check browser console, then update `corsHeaders` in `worker/index.js`

### Issue: Pages not updating
```bash
# Clear Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Issue: Rate limiting too strict
Edit `worker/index.js`:
```javascript
const RATE_LIMIT = {
  windowMs: 60000,
  maxRequests: 50, // Increase from 20
};
```

---

## 📝 DNS Configuration

If not auto-configured, add these DNS records in Cloudflare:

### For Worker (rag-api.brainsait.io)
```
Type: CNAME
Name: rag-api
Content: brainsait-rag-api.{your-subdomain}.workers.dev
Proxy: Enabled (orange cloud)
```

### For Pages (rag.brainsait.io)
```
Type: CNAME
Name: rag
Content: brainsait-rag.pages.dev
Proxy: Enabled (orange cloud)
```

---

## 🎯 Performance Optimization

### Enable Cloudflare Features

1. **Cache Everything** (Page Rules)
   - URL: `rag.brainsait.io/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 2 hours

2. **Minify Assets** (Speed > Optimization)
   - ✅ Auto Minify JavaScript
   - ✅ Auto Minify CSS
   - ✅ Auto Minify HTML

3. **Brotli Compression**
   - Enabled by default

4. **HTTP/3 (QUIC)**
   - Network > HTTP/3: Enabled

---

## 🔗 Useful Links

- **Live Site**: https://rag.brainsait.io
- **API Endpoint**: https://rag-api.brainsait.io
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Pages Docs**: https://developers.cloudflare.com/pages/

---

## 📞 Support

### BrainSAIT Support
- Email: support@brainsait.io
- Website: https://brainsait.io
- OID: 1.3.6.1.4.1.61026

### Cloudflare Support
- Community: https://community.cloudflare.com
- Docs: https://developers.cloudflare.com
- Status: https://www.cloudflarestatus.com

---

## ✨ Post-Deployment Checklist

- [ ] Worker deployed and accessible at rag-api.brainsait.io
- [ ] Pages deployed and accessible at rag.brainsait.io
- [ ] All three API keys set as Worker secrets
- [ ] Custom domains configured and SSL active
- [ ] CORS headers working correctly
- [ ] Rate limiting tested and configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring set up
- [ ] Documentation updated
- [ ] Team notified of new deployment

---

**Powered by BrainSAIT | برينسايت**

🇸🇦 Leading the AI revolution in the Arab world
