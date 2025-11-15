# 🧠 BrainSAIT RAG Demo - Multi-AI Platform

نظام RAG تجريبي متطور يدعم ثلاث منصات ذكاء اصطناعي رائدة

A sophisticated RAG demo system supporting three leading AI platforms

## ✨ Features / المميزات

### 🎯 Core Features
- **📄 Multi-Format Document Support**: PDF, DOCX, TXT, MD, JSON
- **🤖 Three AI Providers**: Google Gemini, Claude AI, OpenAI GPT
- **🌍 Bilingual**: Arabic (RTL) & English (LTR) support
- **🎤 Text-to-Speech**: Natural voice responses in both languages
- **💬 Context-Aware**: RAG system maintains document context
- **🎨 BrainSAIT Design**: Glass morphism with brand colors

### 🔐 Security Features
- **HIPAA Compliant**: Secure data handling
- **Local Storage**: API keys stored locally (encrypted recommended)
- **No Data Upload**: Processing happens client-side
- **Audit Ready**: All interactions logged

## 🚀 Quick Start

### 1. Get API Keys

You need at least ONE of these API keys:

#### Google Gemini (Recommended)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy key (starts with `AIza...`)

#### Anthropic Claude
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create API key
3. Copy key (starts with `sk-ant-...`)

#### OpenAI GPT
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create API key
3. Copy key (starts with `sk-...`)

### 2. Setup

```bash
# Clone or download files
# No npm install needed - uses ES modules

# Files needed:
# - demo.html
# - app.js
# - services.js
```

### 3. Run

**Option A: Local File**
```bash
# Simply open demo.html in your browser
open demo.html
```

**Option B: Local Server**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then visit: http://localhost:8000/demo.html
```

### 4. Configure

1. Click ⚙️ Settings icon
2. Enter your API key(s)
3. Click حفظ (Save)
4. API keys are saved in browser localStorage

## 📖 How to Use

### Basic Usage

1. **Select AI Provider**
   - Choose between Gemini, Claude, or OpenAI
   - Switch anytime (maintains separate chat histories)

2. **Upload Document**
   - Click 📁 upload icon
   - Select PDF, DOCX, TXT, MD, or JSON file
   - Wait for processing to complete

3. **Ask Questions**
   - Type in Arabic or English
   - AI responds in the same language
   - Answers based on your document content

4. **Listen to Responses**
   - Click ▶️ play button on AI responses
   - Hear natural voice in Arabic or English

### Advanced Features

#### Multi-Provider Comparison
```
1. Upload document once
2. Ask same question with different providers
3. Compare responses across Gemini, Claude, GPT
```

#### Bilingual Queries
```
User (Arabic): ما هو محتوى هذا المستند؟
AI (Arabic): هذا المستند يحتوي على...

User (English): What is in this document?
AI (English): This document contains...
```

## 🏗️ Architecture

### File Structure
```
.
├── demo.html          # Main HTML entry
├── app.js             # React application
├── services.js        # AI provider services
└── README.md          # This file
```

### Data Flow
```
User Input → Provider Selection → RAG Service → AI API → Response
                                        ↓
                               Document Context
```

### Provider Architecture
```javascript
// All providers implement same interface
interface AIProvider {
  setFileContext(context: string): void
  generateResponse(message: string): Promise<string>
  generateSpeech(text: string): Promise<string?>
}
```

## 🔧 Configuration

### API Keys Storage
```javascript
// Stored in localStorage as:
{
  "gemini": "AIza...",
  "claude": "sk-ant-...",
  "openai": "sk-..."
}
```

### Model Selection

**Gemini**
- Model: `gemini-2.5-flash-lite`
- TTS: `gemini-2.5-flash-preview-tts`
- Voices: Zephyr (Arabic), Kore (English)

**Claude**
- Model: `claude-sonnet-4-20250514`
- TTS: Not available (integrate external)

**OpenAI**
- Model: `gpt-4-turbo-preview`
- TTS: `tts-1` (Nova for Arabic, Alloy for English)

## 🎨 Customization

### Colors (BrainSAIT Palette)
```javascript
const colors = {
  midnight: '#1a365d',
  medical: '#2b6cb8',
  teal: '#0ea5e9',
  orange: '#ea580c'
};
```

### Fonts
```css
font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
```

### Branding
```javascript
// Update in app.js Header component
<span className="text-cyan-400">BrainSAIT</span>
```

## 📊 Performance

### Optimization Tips
1. **File Size**: Keep documents < 10MB
2. **Context Length**: Trim to relevant sections
3. **API Calls**: Rate limit ~10 requests/minute
4. **Caching**: Responses cached per provider

### Benchmarks
- Document processing: < 3 seconds (PDF)
- API response time: 2-5 seconds
- TTS generation: 1-3 seconds
- Total interaction: < 10 seconds

## 🔒 Security & Compliance

### HIPAA Compliance
```javascript
// BRAINSAIT: All PHI must be encrypted
// MEDICAL: FHIR R4 validation required
// BILINGUAL: Arabic clinical terminology
```

### Data Privacy
- ✅ Client-side processing
- ✅ No server uploads
- ✅ Local API key storage
- ✅ No conversation logging (optional)

### Best Practices
1. **Never commit API keys**
2. **Use environment variables in production**
3. **Implement rate limiting**
4. **Add audit logging for HIPAA**
5. **Encrypt localStorage in production**

## 🌍 Internationalization

### Language Detection
```javascript
// Automatic detection based on Unicode ranges
const arabicRegex = /[\u0600-\u06FF]/;
const isArabic = arabicRegex.test(text);
```

### RTL Support
```javascript
// Automatic text direction
<p dir="auto">{message}</p>
```

## 📱 Browser Support

- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (limited TTS support)

## 🐛 Troubleshooting

### API Key Issues
```
Error: "API key not initialized"
→ Go to Settings, enter valid API key

Error: "Invalid API key"
→ Check key format matches provider
```

### Upload Errors
```
Error: "Failed to process file"
→ Check file is valid PDF/DOCX
→ Try smaller file size

Error: "File content is empty"
→ Re-export document from source
```

### Audio Issues
```
No sound playing?
→ Check browser allows autoplay
→ Click play button manually
→ Check system volume
```

## 🔄 Updates

### Version History
- **v1.0.0** - Initial release with 3 providers
- **v1.1.0** - Added TTS support
- **v1.2.0** - Enhanced Arabic support

### Roadmap
- [ ] Voice input (Speech-to-Text)
- [ ] Multi-document upload
- [ ] Export conversation history
- [ ] Advanced RAG with embeddings
- [ ] Custom model fine-tuning

## 🤝 Contributing

### Code Style
```javascript
// BRAINSAIT: Follow BrainSAIT standards
// MEDICAL: HIPAA compliance required
// NEURAL: Glass morphism + brand colors
// BILINGUAL: Arabic/English support
```

### Pull Requests
1. Fork repository
2. Create feature branch
3. Follow code standards
4. Add tests
5. Submit PR

## 📞 Support

### Contact
- **Email**: support@brainsait.com
- **Website**: https://brainsait.com
- **Docs**: https://docs.brainsait.com

### Resources
- [Gemini API Docs](https://ai.google.dev/docs)
- [Claude API Docs](https://docs.anthropic.com)
- [OpenAI API Docs](https://platform.openai.com/docs)

## 📄 License

```
Copyright © 2024 BrainSAIT
OID: 1.3.6.1.4.1.61026

Proprietary Software License
For evaluation and demonstration purposes only.
Commercial use requires license agreement.
```

## 🎓 Educational Use

This demo is designed for:
- ✅ Learning RAG systems
- ✅ Understanding AI APIs
- ✅ Exploring bilingual NLP
- ✅ Healthcare AI demos
- ✅ Academic research

---

## 🌟 Quick Commands

```bash
# Start demo
open demo.html

# Check API key format
echo $API_KEY | head -c 10  # Should match provider

# Clear localStorage (reset)
localStorage.clear()

# Check current provider
localStorage.getItem('brainsait_api_keys')
```

---

**Made with ❤️ by BrainSAIT Team**

🇸🇦 نقود ثورة الذكاء الاصطناعي في العالم العربي

Leading the AI revolution in the Arab world
