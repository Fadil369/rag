import React, { useState, useRef, useEffect, useCallback } from 'react';
import { aiService, getAudioContext, decode, decodeAudioData } from './services.js';

// --- Type Definitions ---
const Author = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system'
};

const AIProvider = {
  GEMINI: 'gemini',
  CLAUDE: 'claude',
  OPENAI: 'openai'
};

// --- Helper Components ---
const FileUploadIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 13v4h-2v-4H8l4-4 4 4h-3zm-1-9V3.5L18.5 9H12z" })
  )
);

const SendIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" })
  )
);

const PlayIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M8 5v14l11-7z" })
  )
);

const SettingsIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" })
  )
);

// Header Component
const Header = ({ fileName, provider, onProviderChange, onSettings }) => {
  const providerLabels = {
    [AIProvider.GEMINI]: 'Google Gemini',
    [AIProvider.CLAUDE]: 'Claude AI',
    [AIProvider.OPENAI]: 'OpenAI GPT'
  };

  return React.createElement('header', { className: "glass-header p-4 fixed top-0 left-0 right-0 z-10" },
    React.createElement('div', { className: "container mx-auto" },
      React.createElement('div', { className: "flex justify-between items-center mb-3" },
        React.createElement('div', { className: "text-white text-lg md:text-xl font-bold" },
          React.createElement('span', { className: "text-cyan-400" }, "BrainSAIT"),
          ' RAG Demo 🇸🇦'
        ),
        React.createElement('button', {
          onClick: onSettings,
          className: "p-2 rounded-full hover:bg-cyan-500/20 transition-colors"
        },
          React.createElement(SettingsIcon, { className: "w-6 h-6 text-cyan-400" })
        )
      ),
      React.createElement('div', { className: "flex flex-col md:flex-row gap-3 items-center" },
        React.createElement('div', { className: "api-selector flex-1" },
          Object.values(AIProvider).map(p =>
            React.createElement('div', {
              key: p,
              className: `api-option ${provider === p ? 'active' : ''}`,
              onClick: () => onProviderChange(p)
            }, providerLabels[p])
          )
        ),
        fileName && React.createElement('div', {
          className: "text-sm text-gray-300 flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-cyan-500/30"
        },
          React.createElement(FileUploadIcon, { className: "w-4 h-4 text-cyan-400" }),
          React.createElement('span', null, fileName)
        )
      )
    )
  );
};

// Message Bubble Component
const MessageBubble = ({ message, onPlayAudio }) => {
  const isUser = message.author === Author.USER;
  const isSystem = message.author === Author.SYSTEM;

  if (isSystem) {
    return React.createElement('div', {
      className: "text-center text-sm text-cyan-300 py-4 px-2 bg-gray-800/30 rounded-lg my-2 max-w-xl mx-auto"
    }, message.text);
  }

  const bubbleClasses = isUser
    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white self-end rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 self-start rounded-tr-2xl rounded-tl-2xl rounded-br-2xl border border-cyan-500/20';

  return React.createElement('div', {
    className: `w-full max-w-xl md:max-w-2xl p-4 my-2 flex flex-col ${bubbleClasses} shadow-lg`
  },
    React.createElement('p', { className: "whitespace-pre-wrap", dir: "auto" }, message.text),
    !isUser && message.audioBase64 && React.createElement('button', {
      onClick: () => onPlayAudio(message.audioBase64),
      className: "mt-3 self-start bg-cyan-500/20 hover:bg-cyan-500/40 p-2 rounded-full transition-colors duration-200",
      'aria-label': "Play audio response"
    },
      React.createElement(PlayIcon, { className: "w-5 h-5 text-cyan-300" })
    )
  );
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, apiKeys, onSaveKeys }) => {
  const [keys, setKeys] = useState(apiKeys);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys(keys);
    onClose();
  };

  return React.createElement('div', {
    className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4",
    onClick: onClose
  },
    React.createElement('div', {
      className: "bg-gray-900 rounded-2xl p-6 max-w-md w-full border-2 border-cyan-500/30 shadow-2xl",
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('h2', { className: "text-2xl font-bold text-white mb-6" },
        '⚙️ ',
        React.createElement('span', null, 'API Settings / إعدادات API')
      ),
      React.createElement('div', { className: "space-y-4" },
        React.createElement('div', null,
          React.createElement('label', { className: "block text-sm font-semibold text-cyan-400 mb-2" }, 'Google Gemini API Key'),
          React.createElement('input', {
            type: "password",
            value: keys.gemini,
            onChange: (e) => setKeys({ ...keys, gemini: e.target.value }),
            className: "w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500",
            placeholder: "AIza..."
          }),
          React.createElement('p', { className: "text-xs text-gray-400 mt-1" }, 
            'Get from: ',
            React.createElement('a', { href: "https://makersuite.google.com/app/apikey", target: "_blank", className: "text-cyan-400 hover:underline" }, 'Google AI Studio')
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: "block text-sm font-semibold text-purple-400 mb-2" }, 'Anthropic Claude API Key'),
          React.createElement('input', {
            type: "password",
            value: keys.claude,
            onChange: (e) => setKeys({ ...keys, claude: e.target.value }),
            className: "w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500",
            placeholder: "sk-ant-..."
          }),
          React.createElement('p', { className: "text-xs text-gray-400 mt-1" }, 
            'Get from: ',
            React.createElement('a', { href: "https://console.anthropic.com/", target: "_blank", className: "text-purple-400 hover:underline" }, 'Anthropic Console')
          )
        ),
        React.createElement('div', null,
          React.createElement('label', { className: "block text-sm font-semibold text-green-400 mb-2" }, 'OpenAI API Key'),
          React.createElement('input', {
            type: "password",
            value: keys.openai,
            onChange: (e) => setKeys({ ...keys, openai: e.target.value }),
            className: "w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500",
            placeholder: "sk-..."
          }),
          React.createElement('p', { className: "text-xs text-gray-400 mt-1" }, 
            'Get from: ',
            React.createElement('a', { href: "https://platform.openai.com/api-keys", target: "_blank", className: "text-green-400 hover:underline" }, 'OpenAI Platform')
          )
        )
      ),
      React.createElement('div', { className: "flex gap-3 mt-6" },
        React.createElement('button', {
          onClick: handleSave,
          className: "flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        }, 'حفظ / Save'),
        React.createElement('button', {
          onClick: onClose,
          className: "flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
        }, 'إلغاء / Cancel')
      )
    )
  );
};

// --- Main App Component ---
export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', author: Author.SYSTEM, text: 'Please upload a document to begin. قم بتحميل مستند للبدء' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [provider, setProvider] = useState(AIProvider.GEMINI);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    claude: '',
    openai: ''
  });

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  // Load API keys from localStorage
  useEffect(() => {
    const savedKeys = localStorage.getItem('brainsait_api_keys');
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      setApiKeys(keys);
      aiService.initialize(keys);
    }
  }, []);

  const handleSaveKeys = (keys) => {
    setApiKeys(keys);
    localStorage.setItem('brainsait_api_keys', JSON.stringify(keys));
    aiService.initialize(keys);
  };

  const handleProviderChange = (newProvider) => {
    if (!apiKeys[newProvider]) {
      alert(`Please set your ${newProvider.toUpperCase()} API key in settings first!`);
      setShowSettings(true);
      return;
    }
    setProvider(newProvider);
    aiService.setProvider(newProvider);
  };

  const playAudio = useCallback(async (audioBase64) => {
    try {
      const audioContext = getAudioContext();
      const decodedData = decode(audioBase64);
      const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);
    setUploadProgress(0);
    setMessages(prev => [...prev, { id: 'upload-status', author: Author.SYSTEM, text: `Uploading "${file.name}"...` }]);

    const reader = new FileReader();

    reader.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 90);
        setUploadProgress(percentLoaded);
      }
    };

    reader.onload = async (e) => {
      try {
        setUploadProgress(95);
        const fileContentBuffer = e.target?.result;
        if (!fileContentBuffer) throw new Error("File content is empty.");

        let text = '';
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'pdf') {
          const pdf = await window.pdfjsLib.getDocument({ data: fileContentBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          text = fullText;
        } else if (fileExtension === 'docx') {
          const result = await window.mammoth.extractRawText({ arrayBuffer: fileContentBuffer });
          text = result.value;
        } else {
          text = fileContentBuffer;
        }

        setUploadProgress(100);
        setFileContent(text);
        
        // Initialize AI service with document context
        aiService.setFileContext(text);
        
        setMessages(prev => prev.filter(m => m.id !== 'upload-status').concat([
          { id: '1', author: Author.SYSTEM, text: `✅ Document "${file.name}" loaded! Ask questions. تم تحميل "${file.name}"! اطرح أسئلة` }
        ]));
      } catch (error) {
        console.error("Error processing file:", error);
        setMessages(prev => prev.filter(m => m.id !== 'upload-status').concat([
          { id: 'error', author: Author.SYSTEM, text: `❌ Failed to process "${file.name}". فشل معالجة "${file.name}"` }
        ]));
        setFileName(null);
        setFileContent(null);
      } finally {
        setTimeout(() => setIsUploading(false), 500);
      }
    };

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (['pdf', 'docx'].includes(fileExtension || '')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !fileContent) return;

    if (!apiKeys[provider]) {
      alert(`Please set your ${provider.toUpperCase()} API key in settings first!`);
      setShowSettings(true);
      return;
    }

    const userMessage = { id: Date.now().toString(), author: Author.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Generate text response
      const aiText = await aiService.generateResponse(input);
      
      // Generate speech (optional, may not be available for all providers)
      let audioBase64 = null;
      try {
        audioBase64 = await aiService.generateSpeech(aiText);
      } catch (error) {
        console.log('TTS not available for this provider');
      }

      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        author: Author.AI, 
        text: aiText,
        audioBase64 
      };
      setMessages(prev => [...prev, aiMessage]);

      // Auto-play audio if available
      if (audioBase64) {
        playAudio(audioBase64);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        author: Author.AI, 
        text: `❌ Error: ${error.message}. Please check your API key and try again.` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white h-screen w-screen flex flex-col" },
    React.createElement(Header, {
      fileName,
      provider,
      onProviderChange: handleProviderChange,
      onSettings: () => setShowSettings(true)
    }),
    React.createElement('main', {
      ref: chatContainerRef,
      className: "flex-1 overflow-y-auto p-4 pt-32 pb-28 flex flex-col items-center"
    },
      messages.map((msg) =>
        React.createElement(MessageBubble, { key: msg.id, message: msg, onPlayAudio: playAudio })
      ),
      isLoading && React.createElement('div', { className: "self-start flex items-center gap-3 p-4 bg-gray-700/50 rounded-2xl border border-cyan-500/30" },
        React.createElement('div', { className: "w-2 h-2 bg-cyan-400 rounded-full dot-pulse" }),
        React.createElement('div', { className: "w-2 h-2 bg-cyan-400 rounded-full dot-pulse delay-150" }),
        React.createElement('div', { className: "w-2 h-2 bg-cyan-400 rounded-full dot-pulse delay-300" })
      )
    ),
    React.createElement('footer', { className: "glass-footer p-4 fixed bottom-0 left-0 right-0" },
      isUploading ? React.createElement('div', { className: "container mx-auto flex flex-col items-center justify-center h-full px-4" },
        React.createElement('p', { className: "text-sm text-gray-300 mb-2" }, `Uploading... ${uploadProgress}%`),
        React.createElement('div', { className: "w-full bg-gray-700 rounded-full h-2.5" },
          React.createElement('div', {
            className: "bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 animate-pulse-glow",
            style: { width: `${uploadProgress}%` }
          })
        )
      ) : React.createElement('form', { onSubmit: handleSubmit, className: "container mx-auto flex items-center gap-2 md:gap-4" },
        React.createElement('label', {
          htmlFor: "file-upload",
          className: `p-3 rounded-full cursor-pointer transition-colors duration-200 ${fileContent ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`
        },
          React.createElement(FileUploadIcon, { className: "w-6 h-6 text-white" })
        ),
        React.createElement('input', {
          id: "file-upload",
          type: "file",
          className: "hidden",
          onChange: handleFileChange,
          accept: ".txt,.md,.json,.pdf,.docx"
        }),
        React.createElement('input', {
          type: "text",
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: !fileContent ? "Upload document first... حمّل مستند أولاً" : "اكتب سؤالك... Type your question...",
          className: "flex-1 bg-gray-800/80 border border-cyan-500/30 rounded-full py-3 px-5 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all",
          disabled: !fileContent || isLoading,
          dir: "auto"
        }),
        React.createElement('button', {
          type: "submit",
          disabled: !input.trim() || isLoading || !fileContent,
          className: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-200 glow-teal"
        },
          React.createElement(SendIcon, { className: "w-6 h-6 text-white" })
        )
      )
    ),
    React.createElement(SettingsModal, {
      isOpen: showSettings,
      onClose: () => setShowSettings(false),
      apiKeys,
      onSaveKeys: handleSaveKeys
    })
  );
}
