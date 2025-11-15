// ==================================================
// BRAINSAIT: Multi-AI Provider Service - Production
// Powered by BrainSAIT | برينسايت
// Uses Cloudflare Workers API proxy for secure backend
// ==================================================

// API endpoint configuration
const API_BASE_URL = 'https://rag-api.brainsait.io'; // Worker endpoint

// --- Gemini Service ---
class GeminiService {
  constructor() {
    this.model = 'gemini-2.5-flash-lite';
    this.chatHistory = [];
    this.fileContext = '';
  }

  setFileContext(context) {
    this.fileContext = context;
    this.chatHistory = [];
  }

  async generateResponse(userMessage) {
    const systemInstruction = `You are an expert assistant for Saudi businesses, specialized in providing clear and professional communication. Your primary goal is to answer questions based strictly on the provided document context. Respond ONLY in the language of the user's question (either English or modern, formal Arabic). Do not provide bilingual answers unless the user explicitly asks for a translation. If the answer is not found in the document, state that clearly in the user's language.

Powered by BrainSAIT | برينسايت

CONTEXT: """${this.fileContext}"""`;

    const response = await fetch(`${API_BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateContent',
        data: {
          model: this.model,
          contents: [
            {
              parts: [{ text: systemInstruction }]
            },
            ...this.chatHistory,
            {
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error || response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    // Update chat history
    this.chatHistory.push(
      { parts: [{ text: userMessage }] },
      { parts: [{ text: aiText }] }
    );

    return aiText;
  }

  async generateSpeech(text) {
    // Detect language for voice selection
    const arabicRegex = /[\u0600-\u06FF]/;
    const isArabic = arabicRegex.test(text);
    const voiceName = isArabic ? 'Zephyr' : 'Kore';

    const response = await fetch(`${API_BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateSpeech',
        data: {
          model: 'gemini-2.5-flash-preview-tts',
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        }
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }
}

// --- Claude Service ---
class ClaudeService {
  constructor() {
    this.model = 'claude-sonnet-4-20250514';
    this.chatHistory = [];
    this.fileContext = '';
  }

  setFileContext(context) {
    this.fileContext = context;
    this.chatHistory = [];
  }

  async generateResponse(userMessage) {
    const systemPrompt = `You are an expert assistant for Saudi businesses, specialized in providing clear and professional communication in both Arabic and English.

IMPORTANT INSTRUCTIONS:
- Answer questions based STRICTLY on the provided document context
- Respond ONLY in the language of the user's question (Arabic or English)
- Do NOT provide bilingual answers unless explicitly requested
- If the answer is not in the document, clearly state this in the user's language
- Use modern, formal Arabic appropriate for business contexts
- Maintain professional tone throughout

Powered by BrainSAIT | برينسايت

DOCUMENT CONTEXT:
"""
${this.fileContext}
"""`;

    const messages = [
      ...this.chatHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${API_BASE_URL}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        system: systemPrompt,
        messages: messages,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Claude API error: ${error.error?.message || response.status}`);
    }

    const data = await response.json();
    const aiText = data.content?.[0]?.text || 'No response generated';

    // Update chat history
    this.chatHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiText }
    );

    return aiText;
  }

  async generateSpeech(text) {
    // Claude doesn't have built-in TTS
    return null;
  }
}

// --- OpenAI Service ---
class OpenAIService {
  constructor() {
    this.model = 'gpt-4-turbo-preview';
    this.chatHistory = [];
    this.fileContext = '';
  }

  setFileContext(context) {
    this.fileContext = context;
    this.chatHistory = [];
  }

  async generateResponse(userMessage) {
    const systemMessage = {
      role: 'system',
      content: `You are an expert assistant for Saudi businesses, specialized in providing clear and professional communication in both Arabic and English.

IMPORTANT INSTRUCTIONS:
- Answer questions based STRICTLY on the provided document context
- Respond ONLY in the language of the user's question (Arabic or English)
- Do NOT provide bilingual answers unless explicitly requested
- If the answer is not in the document, clearly state this in the user's language
- Use modern, formal Arabic appropriate for business contexts
- Maintain professional tone throughout

Powered by BrainSAIT | برينسايت

DOCUMENT CONTEXT:
"""
${this.fileContext}
"""`
    };

    const messages = [
      systemMessage,
      ...this.chatHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${API_BASE_URL}/api/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'chat',
        data: {
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || 'No response generated';

    // Update chat history
    this.chatHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiText }
    );

    return aiText;
  }

  async generateSpeech(text) {
    // Detect language
    const arabicRegex = /[\u0600-\u06FF]/;
    const isArabic = arabicRegex.test(text);

    const response = await fetch(`${API_BASE_URL}/api/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'tts',
        data: {
          model: 'tts-1',
          input: text,
          voice: isArabic ? 'nova' : 'alloy'
        }
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.audio; // Already base64 encoded
  }
}

// --- Service Manager ---
export class AIServiceManager {
  constructor() {
    this.services = {
      gemini: new GeminiService(),
      claude: new ClaudeService(),
      openai: new OpenAIService()
    };
    this.currentProvider = 'gemini';
  }

  initialize() {
    // No API keys needed on client side in production
    // All handled by Workers
  }

  setProvider(provider) {
    if (!this.services[provider]) {
      throw new Error(`${provider} service not available`);
    }
    this.currentProvider = provider;
  }

  setFileContext(context) {
    Object.values(this.services).forEach(service => {
      if (service) service.setFileContext(context);
    });
  }

  async generateResponse(userMessage) {
    const service = this.services[this.currentProvider];
    if (!service) {
      throw new Error(`${this.currentProvider} service not initialized`);
    }
    return await service.generateResponse(userMessage);
  }

  async generateSpeech(text) {
    const service = this.services[this.currentProvider];
    if (!service) return null;
    return await service.generateSpeech(text);
  }
}

// --- Audio Utilities ---
export function decode(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

let audioContext = null;

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
}

export async function decodeAudioData(data, ctx, sampleRate, numChannels) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Export singleton instance ---
export const aiService = new AIServiceManager();
