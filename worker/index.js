/**
 * BrainSAIT RAG API Proxy - Cloudflare Worker
 * Securely proxies requests to AI providers (Gemini, Claude, OpenAI)
 * Keeps API keys server-side for security
 *
 * Powered by BrainSAIT | برينسايت
 * https://brainsait.io
 */

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Rate limiting configuration (per IP)
const RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 20,  // 20 requests per minute
};

// Rate limit store (in production, use Durable Objects or KV)
const rateLimitStore = new Map();

/**
 * Handle incoming requests
 */
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return jsonResponse({ status: 'ok', service: 'BrainSAIT RAG API' });
    }

    // Route API requests
    try {
      // Apply rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      if (!checkRateLimit(clientIP)) {
        return jsonResponse(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      // Route to appropriate handler
      if (url.pathname === '/api/gemini') {
        return await handleGemini(request, env);
      } else if (url.pathname === '/api/claude') {
        return await handleClaude(request, env);
      } else if (url.pathname === '/api/openai') {
        return await handleOpenAI(request, env);
      } else {
        return jsonResponse(
          { error: 'Endpoint not found' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse(
        { error: 'Internal server error', message: error.message },
        { status: 500 }
      );
    }
  },
};

/**
 * Handle Google Gemini API requests
 */
async function handleGemini(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const { action, data } = await request.json();
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonResponse({ error: 'Gemini API key not configured' }, { status: 500 });
  }

  if (action === 'generateContent') {
    const { model, contents, generationConfig } = data;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig }),
      }
    );

    const result = await response.json();
    return jsonResponse(result, { status: response.status });
  } else if (action === 'generateSpeech') {
    const { model, contents, generationConfig } = data;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig }),
      }
    );

    const result = await response.json();
    return jsonResponse(result, { status: response.status });
  }

  return jsonResponse({ error: 'Invalid action' }, { status: 400 });
}

/**
 * Handle Anthropic Claude API requests
 */
async function handleClaude(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const { model, system, messages, max_tokens } = await request.json();
  const apiKey = env.CLAUDE_API_KEY;

  if (!apiKey) {
    return jsonResponse({ error: 'Claude API key not configured' }, { status: 500 });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      system,
      messages,
      max_tokens: max_tokens || 2048,
    }),
  });

  const result = await response.json();
  return jsonResponse(result, { status: response.status });
}

/**
 * Handle OpenAI API requests
 */
async function handleOpenAI(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
  }

  const { action, data } = await request.json();
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  if (action === 'chat') {
    const { model, messages, temperature, max_tokens } = data;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2048,
      }),
    });

    const result = await response.json();
    return jsonResponse(result, { status: response.status });
  } else if (action === 'tts') {
    const { model, input, voice } = data;
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'tts-1',
        input,
        voice,
        response_format: 'mp3',
      }),
    });

    // Convert to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return jsonResponse({ audio: base64 }, { status: response.status });
  }

  return jsonResponse({ error: 'Invalid action' }, { status: 400 });
}

/**
 * Simple rate limiting check
 */
function checkRateLimit(clientIP) {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };

  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_LIMIT.windowMs;
  }

  // Check limit
  if (record.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  // Increment and store
  record.count++;
  rateLimitStore.set(clientIP, record);

  return true;
}

/**
 * Helper to create JSON responses with CORS headers
 */
function jsonResponse(data, options = {}) {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...options.headers,
    },
  });
}
