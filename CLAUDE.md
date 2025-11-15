# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-only RAG (Retrieval-Augmented Generation) demo system supporting three AI providers (Google Gemini, Anthropic Claude, OpenAI GPT) with bilingual Arabic/English support. The entire application runs client-side without server dependencies.

## Development Commands

### Running the Application Locally
```bash
# Option 1: Open directly in browser (simplest)
open files/demo.html

# Option 2: Local HTTP server (recommended for testing ES modules)
python -m http.server 8000
# Then visit: http://localhost:8000/files/demo.html

# Option 3: Node-based server
npx serve files
# Then visit: http://localhost:3000/demo.html
```

### Cloudflare Deployment (Production)
```bash
# Deploy Worker (API backend)
wrangler deploy

# Deploy Pages (frontend)
wrangler pages deploy files --project-name=brainsait-rag

# Monitor Worker logs
wrangler tail
```

**Production URLs:**
- Frontend: https://rag.brainsait.io
- API: https://rag-api.brainsait.io

See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for complete deployment guide.

### Testing
There are no automated tests. Manual testing workflow:
```bash
# 1. Open demo.html in Chrome/Firefox/Safari
# 2. Click Settings ⚙️ and enter at least one API key
# 3. Upload a test PDF/DOCX document
# 4. Send bilingual queries (Arabic & English)
# 5. Test TTS playback with play button
# 6. Switch providers and verify context persistence
```

## Architecture

### Core Structure

**Development (Local):**
- **`files/demo.html`** - Single-page HTML entrypoint with React/library imports
- **`files/app.js`** - Main React application (UI components, state management, file handling)
- **`files/app-complete.js`** - Complete implementation reference (rename to app.js if needed)
- **`files/services-dev.js`** - AI provider service layer (direct API calls)

**Production (Cloudflare):**
- **`worker/index.js`** - Cloudflare Worker API proxy (secures API keys, rate limiting)
- **`files/services.js`** (production) - Modified services that call Worker endpoints
- **`wrangler.toml`** - Worker configuration
- **`files/_headers`** - Security headers for Pages
- **`files/_redirects`** - Routing configuration

### Key Architectural Patterns

**Provider Abstraction**
All three AI providers implement a common interface via `AIServiceManager`:
```javascript
interface AIProvider {
  setFileContext(context: string): void
  generateResponse(message: string): Promise<string>
  generateSpeech(text: string): Promise<string | null>
}
```

**State Flow**

Development:
```
User Upload → Document Processing (client-side) → Context Storage
User Message → Provider Selection → Direct API Call → Response + TTS → UI Update
```

Production:
```
User Upload → Document Processing (client-side) → Context Storage
User Message → Provider Selection → Worker API Proxy → AI Provider → Response + TTS → UI Update
                                     ↓
                               API Key Security
                               Rate Limiting
```

**Provider Management**
- Each provider maintains independent chat history
- Context is shared across all providers when set via `setFileContext()`
- API keys stored in browser localStorage under `brainsait_api_keys`
- Current provider switched via `AIServiceManager.setProvider()`

**Bilingual Support**
- Language detection via Unicode regex: `/[\u0600-\u06FF]/` for Arabic
- System prompts instruct AI to respond in the same language as the query
- RTL/LTR handled via `dir="auto"` on message elements
- TTS voice selection: Gemini (Zephyr/Kore), OpenAI (Nova/Alloy)

### Document Processing Pipeline
1. File upload via `<input type="file">`
2. Client-side parsing:
   - PDF: `pdf.js` library extracts text from all pages
   - DOCX: `mammoth.js` converts to plain text
   - TXT/MD/JSON: Direct text read via FileReader
3. Context injection into all provider instances
4. Chat history reset to ensure clean RAG context

## Provider-Specific Details

### Google Gemini
- Model: `gemini-2.5-flash-lite` (configurable in services.js:11)
- TTS Model: `gemini-2.5-flash-preview-tts` (services.js:74)
- Returns base64-encoded audio in response
- System instructions via `contents[0]` in request body

### Anthropic Claude
- Model: `claude-sonnet-4-20250514` (services.js:104)
- No built-in TTS (returns null from generateSpeech)
- System prompt sent via `system` parameter
- Messages format: `{role: 'user'|'assistant', content: string}`

### OpenAI
- Model: `gpt-4-turbo-preview` (services.js:179)
- TTS Model: `tts-1` with voice selection (services.js:258)
- System message prepended to chat history
- Audio returned as ArrayBuffer, converted to base64

## Configuration & Settings

### API Key Management
Keys stored in localStorage, accessed via Settings modal:
```javascript
localStorage.getItem('brainsait_api_keys')
// Returns: {"gemini": "AIza...", "claude": "sk-ant-...", "openai": "sk-..."}
```

### Model Configuration
Edit `services.js` to change models:
```javascript
// Gemini
this.model = 'gemini-2.5-flash-lite';  // Line 11

// Claude
this.model = 'claude-sonnet-4-20250514';  // Line 104

// OpenAI
this.model = 'gpt-4-turbo-preview';  // Line 179
```

## Branding & Customization

### Current Identity: BrainSAIT
The demo currently uses BrainSAIT branding. Key customization points:

**Visual Identity (demo.html)**
- Line 6: Page title
- Line 65: Header logo text (`<span className="text-cyan-400">BrainSAIT</span>`)
- Colors defined in CSS (lines 13-105): midnight blue (#1a365d), medical blue (#2b6cb8), teal (#0ea5e9)

**Typography**
- Arabic: 'IBM Plex Sans Arabic'
- English: 'Inter'
- Loaded from Google Fonts (demo.html:9-11)

**RTL Support**
- `<html lang="ar" dir="rtl">` in demo.html:2
- Individual message bubbles use `dir="auto"` for mixed content

## Compliance & Security Notes

### HIPAA Considerations
From README.md security section:
- Client-side processing ensures no PHI upload
- API keys never committed (managed at runtime)
- Optional audit logging can be added
- Encryption recommended for localStorage in production

### PDPL (Saudi Data Protection)
- All processing happens in-browser
- No server-side data collection by default
- User consent via Settings modal
- Bilingual privacy notices recommended

### NPHIES/OID Conventions
- OID reference: 1.3.6.1.4.1.61026 (from README.md:335)
- Medical terminology support via bilingual prompts
- FHIR R4 validation mentioned in comments (services.js:219)

## Implementation Plan for صاغ Rebrand

Based on the command requirements, the following updates are needed:

### Phase 1: UI/UX Updates (files/demo.html, files/app.js)
1. Hero section: Update line 65 in app.js to replace "BrainSAIT" with "صاغ"
2. Settings modal: Add provider toggles and PDPL compliance tips (new component in app.js)
3. RTL refinements: Ensure all Arabic text renders with proper directionality
4. Typography: Consider custom Arabic font for صاغ brand identity

### Phase 2: Services Layer (files/services.js)
1. Tag requests with صاغ identifier (add to system prompts)
2. Maintain modular provider architecture (no changes needed to structure)
3. Ensure encrypted key storage (add encryption layer to localStorage access)

### Phase 3: Documentation (files/README.md, AGENTS.md)
1. Update branding references from BrainSAIT to صاغ
2. Add صاغ-specific testing steps
3. Document PDPL compliance features
4. Add contributor guide with Arabic-first conventions

### Phase 4: Validation
1. Test in Chrome/Firefox/Safari
2. Exercise provider switching with all three APIs
3. Upload test documents and verify RAG context
4. Test TTS in both Arabic and English
5. Verify settings persistence across sessions

## Code Style Guidelines

From AGENTS.md:
- ES module syntax (import/export)
- 2-space indentation
- camelCase for functions
- Descriptive variable names
- Comments in English for technical details
- Arabic labels for user-facing strings
- Follow BrainSAIT standards (glass morphism, HIPAA awareness)
- Bilingual support is core requirement

## Important File Locations

- Entry point: `files/demo.html`
- Main app logic: `files/app.js` or `files/app-complete.js`
- Provider services: `files/services.js`
- Usage guide: `files/README.md`
- Deployment guide: `files/DEPLOYMENT.md`
- Project summary: `files/PROJECT_SUMMARY.md`
- Agent guidelines: `AGENTS.md` (repository root)

## Common Gotchas

1. **File Paths**: ES module imports are relative to demo.html location
2. **API Keys**:
   - Development: Must be set via Settings modal
   - Production: Set as Worker secrets via `wrangler secret put`
3. **Context Sharing**: Uploading new document resets all provider chat histories
4. **TTS Support**: Claude returns null (no built-in TTS), requires external integration
5. **CORS**:
   - Development: APIs must be called from HTTP server context, not file:// protocol
   - Production: CORS handled by Worker
6. **Provider State**: Each provider maintains separate conversation history even when sharing document context
7. **Language Detection**: Based on first Arabic character found, not percentage analysis
8. **Services File**:
   - `services-dev.js` - Direct API calls (development)
   - `services.js` - Worker proxy calls (production)

## BrainSAIT Branding

The application includes "Powered by BrainSAIT | برينسايت" branding:

- Footer component in app.js (lines 125-138)
- Meta description in demo.html
- System prompts in all AI providers include branding
- Link to https://brainsait.io

### Customization Points
To update branding:
1. `files/app.js` - BrainSAITFooter component
2. `files/demo.html` - Meta tags and header logo
3. `worker/index.js` - API response headers
4. All service classes - System prompts

## Production Deployment Notes

### Security Features (Production Only)
1. **API Key Protection**: Keys stored as Worker secrets, never exposed to client
2. **Rate Limiting**: 20 requests/minute per IP (configurable in worker/index.js)
3. **CORS Control**: Configurable allowed origins
4. **Security Headers**: CSP, X-Frame-Options, etc. via _headers file

### Performance
- Worker: < 10ms overhead for API proxying
- Pages: Global CDN with automatic caching
- SSL: Free certificates auto-provisioned
- HTTP/3: Enabled by default

### Cost (Cloudflare Free Tier)
- Workers: 100k requests/day free
- Pages: Unlimited bandwidth/requests free
- Typical usage: $0/month
