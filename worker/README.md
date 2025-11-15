# Cloudflare Worker - API Proxy

## BrainSAIT RAG API Backend
**Powered by BrainSAIT | برينسايت**

This Worker acts as a secure API proxy for AI provider requests.

---

## Purpose

Securely proxy API calls to:
- Google Gemini
- Anthropic Claude
- OpenAI GPT

**Benefits:**
- API keys stay server-side (secure)
- Rate limiting built-in
- CORS handling centralized
- Request monitoring & logging

---

## Endpoints

### Health Check
```bash
GET /health
```
Returns: `{"status":"ok","service":"BrainSAIT RAG API"}`

### Gemini Proxy
```bash
POST /api/gemini
Content-Type: application/json

{
  "action": "generateContent" | "generateSpeech",
  "data": {
    "model": "gemini-2.5-flash-lite",
    "contents": [...],
    "generationConfig": {...}
  }
}
```

### Claude Proxy
```bash
POST /api/claude
Content-Type: application/json

{
  "model": "claude-sonnet-4-20250514",
  "system": "...",
  "messages": [...],
  "max_tokens": 2048
}
```

### OpenAI Proxy
```bash
POST /api/openai
Content-Type: application/json

{
  "action": "chat" | "tts",
  "data": {
    "model": "gpt-4-turbo-preview",
    "messages": [...],
    "temperature": 0.7,
    "max_tokens": 2048
  }
}
```

---

## Configuration

### Environment Variables (Secrets)
Set via `wrangler secret put`:
- `GEMINI_API_KEY` - Google Gemini API key
- `CLAUDE_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI API key

### Rate Limiting
Default: 20 requests/minute per IP

Adjust in `index.js`:
```javascript
const RATE_LIMIT = {
  windowMs: 60000,    // 1 minute window
  maxRequests: 20,    // max requests per window
};
```

### CORS
Default: Allow all origins (`*`)

For production, restrict to your domain:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://rag.brainsait.io',
  // ...
};
```

---

## Development

### Local Testing
```bash
# Install wrangler
npm install -g wrangler

# Login
wrangler login

# Set secrets locally
wrangler secret put GEMINI_API_KEY --env development
wrangler secret put CLAUDE_API_KEY --env development
wrangler secret put OPENAI_API_KEY --env development

# Run locally
wrangler dev
```

### Deploy
```bash
# Deploy to production
wrangler deploy

# Deploy to specific environment
wrangler deploy --env production
```

### Monitor Logs
```bash
# Stream all logs
wrangler tail

# Filter by status
wrangler tail --status error

# Filter by IP
wrangler tail --ip 1.2.3.4
```

---

## File Structure

```
worker/
├── index.js        # Main Worker code
└── README.md       # This file
```

---

## Security Features

1. **API Key Protection**
   - Keys stored as Worker secrets
   - Never exposed in responses
   - Encrypted at rest

2. **Rate Limiting**
   - Per-IP request limiting
   - Prevents abuse
   - Returns 429 when exceeded

3. **CORS Handling**
   - Preflight requests supported
   - Configurable allowed origins
   - Security headers included

4. **Error Handling**
   - Try-catch wrappers
   - Sanitized error messages
   - No sensitive data leakage

---

## Performance

- **Cold Start**: < 50ms
- **Response Time**: < 10ms (excluding AI provider latency)
- **Global Edge**: Runs on Cloudflare's edge network
- **Auto-scaling**: Handles millions of requests

---

## Monitoring

### Metrics Available
- Total requests
- Error rate
- CPU time
- Response time
- Geographic distribution
- Status code breakdown

### Access Metrics
1. Go to Cloudflare Dashboard
2. Workers & Pages > brainsait-rag-api
3. View Analytics tab

---

## Troubleshooting

### Issue: 500 Internal Server Error
Check that all API keys are set:
```bash
wrangler secret list
```

### Issue: Rate Limit Exceeded
Adjust `RATE_LIMIT` constants or wait for window to reset

### Issue: CORS Errors
Verify `corsHeaders` configuration matches your frontend domain

### Issue: API Key Invalid
Re-set the problematic key:
```bash
wrangler secret put GEMINI_API_KEY
```

---

## Updating

### Add New Provider
1. Create handler function (e.g., `handleNewProvider`)
2. Add route in main `fetch` handler
3. Update frontend services
4. Set API key secret
5. Deploy

### Modify Rate Limits
1. Edit `RATE_LIMIT` constants
2. Deploy with `wrangler deploy`

### Update AI Models
1. Edit model names in handler functions
2. Deploy with `wrangler deploy`

---

## Production Checklist

Before deploying to production:

- [ ] All API keys set as secrets
- [ ] Rate limiting configured appropriately
- [ ] CORS origins restricted to production domain
- [ ] Error handling tested
- [ ] Monitoring alerts configured
- [ ] Custom domain configured
- [ ] SSL certificate active

---

## Links

- **Worker Docs**: https://developers.cloudflare.com/workers/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Deployment Guide**: ../CLOUDFLARE_DEPLOYMENT.md
- **BrainSAIT**: https://brainsait.io

---

**Powered by BrainSAIT | برينسايت**
