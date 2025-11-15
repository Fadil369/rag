# 🚀 Deploy BrainSAIT RAG NOW

## Quick Deployment - Ready to Go!
**Powered by BrainSAIT | برينسايت**

Your API keys are ready. Let's deploy in 3 steps!

---

## ⚡ Option 1: Automated Deploy (Recommended)

### Step 1: Setup Secrets
```bash
cd /Users/fadil369/rag
./setup-secrets.sh
```

**What this does:**
- Sets GEMINI_API_KEY
- Sets CLAUDE_API_KEY
- Sets OPENAI_API_KEY
- All encrypted and secure

### Step 2: Deploy Everything
```bash
./deploy.sh
```

**What this does:**
- Switches to production services
- Deploys Worker (API backend)
- Deploys Pages (frontend)
- Shows you the URLs

### Step 3: Configure Domains
Go to Cloudflare Dashboard and add:
- Worker: `rag-api.brainsait.io`
- Pages: `rag.brainsait.io`

**Done! Your app is live!** 🎉

---

## 🔧 Option 2: Manual Deploy (Step-by-Step)

### 1. Setup Secrets
```bash
cd /Users/fadil369/rag

# Set Gemini key
wrangler secret put GEMINI_API_KEY
# Paste: YOUR_GEMINI_API_KEY

# Set Claude key
wrangler secret put CLAUDE_API_KEY
# Paste: YOUR_CLAUDE_API_KEY

# Set OpenAI key
wrangler secret put OPENAI_API_KEY
# Paste: YOUR_OPENAI_API_KEY
```

### 2. Switch to Production Services
```bash
# Backup dev services
mv files/services.js files/services-dev.js

# Use production services
cp files/services-production.js files/services.js
```

### 3. Deploy Worker
```bash
wrangler deploy
```

### 4. Deploy Pages
```bash
wrangler pages deploy files --project-name=brainsait-rag
```

### 5. Configure Custom Domains
In Cloudflare Dashboard:
- Workers & Pages → brainsait-rag-api → Triggers → Add Domain: `rag-api.brainsait.io`
- Workers & Pages → brainsait-rag → Custom Domains → Add: `rag.brainsait.io`

---

## ✅ Verify Deployment

### Test Worker
```bash
curl https://brainsait-rag-api.{your-subdomain}.workers.dev/health
```

**Expected:**
```json
{"status":"ok","service":"BrainSAIT RAG API"}
```

### Test Pages
```bash
open {pages-url-from-deploy-output}
```

### Test with Custom Domain (after DNS propagation)
```bash
curl https://rag-api.brainsait.io/health
open https://rag.brainsait.io
```

---

## 🎯 Your API Keys Summary

**Gemini:**
```
AIzaSyBcMmJaF2ZigKXZo9sQmfdGMJGHZ7sSMJc
```

**Claude:**
```
YOUR_CLAUDE_API_KEY
```

**OpenAI:**
```
YOUR_OPENAI_API_KEY
```

**Cloudflare API Token:**
```
YOUR_CLOUDFLARE_API_TOKEN
```

**DeepSeek API (for future OCR):**
```
sk-9db1a99228144db18762cf8c04dbb20b
```

---

## 🔒 Security Reminder

### After Deployment:

1. **Delete the secrets script:**
   ```bash
   rm setup-secrets.sh
   ```

2. **Rotate these keys** (regenerate new ones):
   - Gemini: https://makersuite.google.com/app/apikey
   - Claude: https://console.anthropic.com/
   - OpenAI: https://platform.openai.com/api-keys

3. **Update Worker secrets** with new keys:
   ```bash
   wrangler secret put GEMINI_API_KEY
   wrangler secret put CLAUDE_API_KEY
   wrangler secret put OPENAI_API_KEY
   ```

4. **Never commit** API keys to Git:
   ```bash
   # Already in .gitignore:
   setup-secrets.sh
   *.env
   ```

---

## 📊 Monitor Your Deployment

### Watch Live Requests
```bash
wrangler tail
```

### View Analytics
```
Cloudflare Dashboard → Workers & Pages → brainsait-rag-api → Analytics
```

### Check Secrets
```bash
wrangler secret list
```

---

## 🐛 Troubleshooting

### Secrets not set?
```bash
wrangler secret list
# If empty, run setup-secrets.sh again
```

### Worker not deploying?
```bash
wrangler whoami  # Verify login
wrangler deploy --verbose  # See detailed errors
```

### Pages not deploying?
```bash
# Create project first
wrangler pages project create brainsait-rag
# Then deploy
wrangler pages deploy files --project-name=brainsait-rag
```

### CORS errors?
Edit `worker/index.js` line 7:
```javascript
'Access-Control-Allow-Origin': 'https://rag.brainsait.io',
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Worker health check responds
- [ ] Pages loads without errors
- [ ] Can upload PDF document
- [ ] Gemini provider works
- [ ] Claude provider works
- [ ] OpenAI provider works
- [ ] TTS audio playback works
- [ ] Footer shows "Powered by BrainSAIT | برينسايت"
- [ ] Custom domains configured
- [ ] SSL certificates active

---

## 📞 Need Help?

- **Full Guide**: CLOUDFLARE_DEPLOYMENT.md
- **Quick Start**: DEPLOYMENT_QUICK_START.md
- **Summary**: DEPLOYMENT_SUMMARY.md
- **BrainSAIT Support**: support@brainsait.io

---

## 🚀 Ready to Deploy?

Choose your path:

**Fast & Easy:**
```bash
./setup-secrets.sh && ./deploy.sh
```

**Manual Control:**
Follow "Option 2: Manual Deploy" above

---

**Powered by BrainSAIT | برينسايت**

🇸🇦 Leading the AI revolution in the Arab world
