# 🚀 BrainSAIT RAG System - Deployment Guide

## نظام كامل متكامل لعرض RAG بثلاث منصات AI

Complete integrated RAG demo system with three AI platforms

---

## 📦 Files Overview

### Landing Page
- **rag-arabic-business-enhanced.html** - Main landing page with demo link

### Demo Application
- **demo.html** - Demo app entry point
- **app-complete.js** - Main React application (rename to app.js)
- **services.js** - AI provider services

### Documentation
- **README.md** - Complete usage guide

---

## 🎯 Complete Setup Instructions

### Step 1: File Organization

```bash
# Create project directory
mkdir brainsait-rag-demo
cd brainsait-rag-demo

# Organize files
project/
├── index.html                    # Landing page (rename from rag-arabic-business-enhanced.html)
├── demo/
│   ├── demo.html                # Demo entry
│   ├── app.js                   # App component (from app-complete.js)
│   └── services.js              # AI services
└── README.md
```

### Step 2: Update File References

**In demo.html:**
```html
<!-- Change this line: -->
<script type="module">
  import App from './app.js';  // ✅ Correct path
</script>
```

**In app.js:**
```javascript
// Change import:
import { aiService, ... } from './services.js';  // ✅ Correct path
```

**In index.html (landing page):**
```html
<!-- Update demo link: -->
<a href="demo/demo.html" target="_blank">
  🚀 افتح التطبيق التجريبي
</a>
```

### Step 3: Get API Keys

#### Option A: Google Gemini (Easiest)
```bash
# 1. Visit: https://makersuite.google.com/app/apikey
# 2. Click "Create API Key"
# 3. Copy key (starts with AIza...)
# 4. Paste in Settings ⚙️
```

#### Option B: Anthropic Claude (Best Quality)
```bash
# 1. Visit: https://console.anthropic.com/
# 2. Sign up / Login
# 3. Go to API Keys
# 4. Create new key (sk-ant-...)
# 5. Paste in Settings ⚙️
```

#### Option C: OpenAI GPT (Most Popular)
```bash
# 1. Visit: https://platform.openai.com/api-keys
# 2. Create new key (sk-...)
# 3. Add credits to account ($5 minimum)
# 4. Paste in Settings ⚙️
```

### Step 4: Run Locally

**Option A: Python**
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

**Option B: Node.js**
```bash
npx serve .
# Visit: http://localhost:3000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

### Step 5: Test the System

1. **Landing Page**
   - Open `index.html`
   - Check all sections load
   - Test language toggle (AR ↔ EN)
   - Click demo button

2. **Demo App**
   - Opens in new tab
   - Click ⚙️ Settings
   - Enter API key
   - Click حفظ (Save)

3. **Upload & Test**
   - Click 📁 upload
   - Select test PDF/DOCX
   - Wait for processing
   - Ask question
   - Check response

---

## 🔧 Configuration

### API Keys Storage
```javascript
// Stored in localStorage:
localStorage.setItem('brainsait_api_keys', JSON.stringify({
  gemini: "AIza...",
  claude: "sk-ant-...",
  openai: "sk-..."
}));
```

### Provider Configuration

**Gemini (services.js)**
```javascript
this.model = 'gemini-2.5-flash-lite';  // Fast & cheap
// OR
this.model = 'gemini-2.5-flash';       // Better quality
```

**Claude (services.js)**
```javascript
this.model = 'claude-sonnet-4-20250514';  // Best balance
// OR
this.model = 'claude-opus-4';              // Highest quality
```

**OpenAI (services.js)**
```javascript
this.model = 'gpt-4-turbo-preview';  // Best for complex
// OR
this.model = 'gpt-3.5-turbo';        // Faster & cheaper
```

---

## 🌐 Deployment to Production

### Option 1: Cloudflare Pages (Recommended)

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Deploy
wrangler pages deploy .

# Your site is live at: https://your-project.pages.dev
```

### Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod

# Your site is live at: https://your-project.netlify.app
```

### Option 3: GitHub Pages

```bash
# 1. Create GitHub repo
# 2. Push files
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 3. Enable Pages in Settings
# 4. Site live at: https://username.github.io/repo
```

---

## 🔐 Production Security

### Environment Variables

**Create .env file:**
```env
GEMINI_API_KEY=AIza...
CLAUDE_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

**Update services.js:**
```javascript
// Don't hardcode keys
constructor(apiKey = process.env.GEMINI_API_KEY) {
  this.apiKey = apiKey;
}
```

### API Key Protection

**Option A: Backend Proxy (Recommended)**
```javascript
// Create API endpoint
// /api/chat
async function handleChat(request) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  const response = await fetch('https://...', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  
  return response;
}
```

**Option B: Rate Limiting**
```javascript
// Add to services.js
const RATE_LIMIT = 10; // requests per minute
let requestCount = 0;
let resetTime = Date.now() + 60000;

async function generateResponse(message) {
  if (Date.now() > resetTime) {
    requestCount = 0;
    resetTime = Date.now() + 60000;
  }
  
  if (requestCount >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please wait.');
  }
  
  requestCount++;
  // ... rest of code
}
```

---

## 📊 Analytics Integration

### Google Analytics

**Add to demo.html:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Events

**Add to app.js:**
```javascript
// After successful chat
gtag('event', 'chat_message', {
  provider: provider,
  message_length: input.length
});

// After file upload
gtag('event', 'file_upload', {
  file_type: fileExtension,
  file_size: file.size
});
```

---

## 🎨 Customization Guide

### Branding

**Update colors in demo.html:**
```css
/* Change primary color */
.bg-cyan-600 { background: #YOUR_COLOR; }
.text-cyan-400 { color: #YOUR_COLOR; }
.border-cyan-500 { border-color: #YOUR_COLOR; }
```

**Update logo:**
```javascript
// In Header component (app.js)
<span className="text-cyan-400">YOUR_BRAND</span>
```

### Language Customization

**Add new language:**
```javascript
// In app.js
const translations = {
  ar: { upload: 'تحميل' },
  en: { upload: 'Upload' },
  es: { upload: 'Subir' }  // Spanish
};
```

---

## 🧪 Testing

### Unit Tests

```bash
# Install Jest
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

**Example test:**
```javascript
// services.test.js
import { GeminiService } from './services.js';

test('generates response', async () => {
  const service = new GeminiService('test-key');
  service.setFileContext('Test document');
  
  const response = await service.generateResponse('What is this?');
  expect(response).toBeTruthy();
});
```

### Integration Tests

```javascript
// app.test.js
test('uploads file and enables chat', async () => {
  render(<App />);
  
  const file = new File(['test'], 'test.txt', { type: 'text/plain' });
  const input = screen.getByLabelText(/file-upload/);
  
  fireEvent.change(input, { target: { files: [file] } });
  
  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument();
  });
});
```

---

## 📱 Mobile Optimization

### Responsive Updates

**Add to demo.html:**
```css
/* Mobile-specific styles */
@media (max-width: 768px) {
  .api-selector {
    flex-direction: column;
  }
  
  .glass-header {
    padding: 0.75rem;
  }
  
  .message-bubble {
    max-width: 90%;
  }
}
```

### Touch Optimization

**Add to app.js:**
```javascript
// Prevent zoom on double-tap
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

// Better touch targets
.api-option {
  min-height: 44px;  /* iOS requirement */
  min-width: 44px;
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
```javascript
// Solution: Use proxy
// Instead of calling API directly:
fetch('https://api.anthropic.com/...')

// Call through proxy:
fetch('/api/proxy', {
  method: 'POST',
  body: JSON.stringify({ endpoint: 'anthropic', data: ... })
})
```

### Issue 2: API Key Not Working
```bash
# Check key format:
Gemini:  AIza...     (40 chars)
Claude:  sk-ant-...  (100+ chars)
OpenAI:  sk-...      (50+ chars)

# Verify in browser console:
console.log(localStorage.getItem('brainsait_api_keys'));
```

### Issue 3: File Upload Fails
```javascript
// Add error handling
reader.onerror = (error) => {
  console.error('File read error:', error);
  alert('Failed to read file. Try a smaller file.');
};

// Check file size
if (file.size > 10 * 1024 * 1024) {  // 10MB
  alert('File too large. Max 10MB.');
  return;
}
```

---

## 🚀 Performance Optimization

### Code Splitting

```javascript
// Lazy load components
const SettingsModal = React.lazy(() => import('./SettingsModal'));

<Suspense fallback={<Loading />}>
  <SettingsModal {...props} />
</Suspense>
```

### Caching

```javascript
// Cache API responses
const cache = new Map();

async function generateResponse(message) {
  const cacheKey = `${this.provider}-${message}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await this.api.generate(message);
  cache.set(cacheKey, response);
  
  return response;
}
```

---

## 📈 Monitoring

### Error Tracking

```javascript
// Add Sentry
<script src="https://js.sentry-cdn.com/..."></script>
<script>
  Sentry.init({
    dsn: 'YOUR_DSN',
    environment: 'production'
  });
</script>

// Track errors in app.js
try {
  await aiService.generateResponse(input);
} catch (error) {
  Sentry.captureException(error);
  // ... show error to user
}
```

---

## ✅ Launch Checklist

### Pre-Launch
- [ ] Test all 3 AI providers
- [ ] Upload different file formats
- [ ] Test bilingual (AR/EN)
- [ ] Check mobile responsive
- [ ] Verify API keys work
- [ ] Test error handling
- [ ] Review security headers
- [ ] Setup analytics
- [ ] Add meta tags/SEO

### Post-Launch
- [ ] Monitor API costs
- [ ] Check error rates
- [ ] Review user feedback
- [ ] Update documentation
- [ ] Plan feature updates

---

## 📞 Support

### Resources
- Landing Page: `index.html`
- Demo App: `demo/demo.html`
- API Docs: `README.md`

### Contact
- Email: support@brainsait.com
- Web: https://brainsait.com

---

**Made with ❤️ by BrainSAIT**

🇸🇦 نقود ثورة الذكاء الاصطناعي في العالم العربي
