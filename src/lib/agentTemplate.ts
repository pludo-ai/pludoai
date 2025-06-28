interface AgentConfig {
  name: string;
  brandName: string;
  websiteName: string;
  agentType: string;
  roleDescription: string;
  services: string[];
  faqs: { question: string; answer: string }[];
  primaryColor: string;
  tone: string;
  avatarUrl?: string;
  subdomain: string;
  officeHours?: string;
  knowledge: string;
  vercelUrl?: string; // Add vercelUrl to config
}

export function generateAgentFiles(config: AgentConfig, vercelUrl?: string): { path: string; content: string }[] {
  const files = [
    {
      path: 'package.json',
      content: JSON.stringify({
        name: config.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-ai-agent',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.344.0',
          'framer-motion': '^10.18.0'
        },
        devDependencies: {
          '@types/react': '^18.3.5',
          '@types/react-dom': '^18.3.0',
          '@vitejs/plugin-react': '^4.3.1',
          'autoprefixer': '^10.4.18',
          'postcss': '^8.4.35',
          'tailwindcss': '^3.4.1',
          'typescript': '^5.5.3',
          'vite': '^5.4.2'
        }
      }, null, 2)
    },
    {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        widget: 'widget.html'
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  }
});`
    },
    {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './widget.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${hexToHsl(config.primaryColor, 95)}',
          100: '${hexToHsl(config.primaryColor, 90)}',
          200: '${hexToHsl(config.primaryColor, 80)}',
          300: '${hexToHsl(config.primaryColor, 70)}',
          400: '${hexToHsl(config.primaryColor, 60)}',
          500: '${config.primaryColor}',
          600: '${hexToHsl(config.primaryColor, 40)}',
          700: '${hexToHsl(config.primaryColor, 30)}',
          800: '${hexToHsl(config.primaryColor, 20)}',
          900: '${hexToHsl(config.primaryColor, 10)}',
        },
      },
    },
  },
  plugins: [],
};`
    },
    {
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`
    },
    {
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name} - AI Assistant for ${config.brandName}</title>
    <meta name="description" content="Meet ${config.name}, your intelligent AI assistant for ${config.brandName}. ${config.roleDescription}">
    <meta name="keywords" content="AI assistant, chatbot, ${config.brandName}, customer support, ${config.agentType}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { 
        margin: 0; 
        padding: 0; 
        font-family: 'Inter', system-ui, sans-serif;
        background: linear-gradient(135deg, ${config.primaryColor}10 0%, ${config.primaryColor}05 100%);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
    },
    {
      path: 'widget.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name} - Chat Widget</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      html, body {
        width: 100%;
        height: 100%;
        font-family: 'Inter', system-ui, sans-serif;
        background: transparent;
        overflow: hidden;
      }
      
      #widget-root {
        width: 100%;
        height: 100%;
        position: relative;
      }
    </style>
  </head>
  <body>
    <div id="widget-root"></div>
    <script type="module" src="/src/widget.tsx"></script>
  </body>
</html>`
    },
    {
      path: 'src/main.tsx',
      content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`
    },
    {
      path: 'src/widget.tsx',
      content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FloatingWidget from './FloatingWidget.tsx';
import './index.css';

createRoot(document.getElementById('widget-root')!).render(
  <StrictMode>
    <FloatingWidget />
  </StrictMode>
);`
    },
    {
      path: 'src/index.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, sans-serif;
}
      /* Ensure floating widget is always clickable */
#widget-root {
  position: relative;
  z-index: 2147483647;
}

#widget-root * {
  box-sizing: border-box;
}

/* Force pointer events for floating button */
#widget-root button[style*="cursor: pointer"] {
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Ensure proper stacking context */
#widget-root > div {
  position: relative;
  z-index: 2147483647;
}`
    },
    {
      path: 'src/App.tsx',
      content: generateAppComponent(config)
    },
    {
      path: 'src/FloatingWidget.tsx',
      content: generateFloatingWidget(config)
    },
    {
      path: 'src/components/ChatWidget.tsx',
      content: generateChatWidget(config)
    },
    {
      path: 'src/components/FloatingButton.tsx',
      content: generateFloatingButton(config)
    },
    {
      path: 'src/lib/ai.ts',
      content: generateAIService(config)
    },
    {
      path: 'src/lib/config.ts',
      content: generateConfigFile(config)
    },
    {
      path: 'public/widget.js',
      content: generateWidgetScript(config, vercelUrl)
    },
    {
      path: 'public/vite.svg',
      content: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`
    },
    {
      path: 'knowledge.txt',
      content: config.knowledge || `This is the knowledge base for ${config.name}, an AI assistant for ${config.brandName}.

Role: ${config.roleDescription}

Services offered:
${config.services.map(service => `- ${service}`).join('\n')}

Frequently Asked Questions:
${config.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

${config.officeHours ? `Office Hours: ${config.officeHours}` : ''}

Additional Information:
${config.knowledge || 'No additional information provided.'}`
    },
    {
      path: 'README.md',
      content: generateReadme(config)
    },
    {
      path: 'vercel.json',
      content: JSON.stringify({
        "buildCommand": "npm run build",
        "outputDirectory": "dist",
        "installCommand": "npm install",
        "framework": "vite",
        "headers": [
          {
            "source": "/widget.js",
            "headers": [
              {
                "key": "Cross-Origin-Resource-Policy",
                "value": "cross-origin"
              },
              {
                "key": "Access-Control-Allow-Origin",
                "value": "*"
              },
              {
                "key": "Content-Type",
                "value": "application/javascript"
              }
            ]
          },
          {
            "source": "/widget.html",
            "headers": [
              {
                "key": "Cross-Origin-Embedder-Policy",
                "value": "unsafe-none"
              },
              {
                "key": "Cross-Origin-Resource-Policy",
                "value": "cross-origin"
              }
            ]
          }
        ],
        "rewrites": [
          {
            "source": "/widget.js",
            "destination": "/widget.js"
          },
          {
            "source": "/widget",
            "destination": "/widget.html"
          },
          {
            "source": "/widget.html",
            "destination": "/widget.html"
          },
          {
            "source": "/(.*)",
            "destination": "/index.html"
          }
        ]
      }, null, 2)
    },
    {
      path: '_headers',
      content: `# Headers for Netlify deployment
/widget.js
  Cross-Origin-Resource-Policy: cross-origin
  Access-Control-Allow-Origin: *
  Content-Type: application/javascript

/widget.html
  Cross-Origin-Embedder-Policy: unsafe-none
  Cross-Origin-Resource-Policy: cross-origin

/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff`
    }
  ];

  // Add avatar image file if provided
  if (config.avatarUrl) {
    files.push({
      path: 'public/avatar.jpg',
      content: `# Avatar image will be downloaded from: ${config.avatarUrl}
# This file serves as a placeholder for the avatar image.
# The actual image will be included in the repository during deployment.`
    });
  }

  return files;
}

function generateAppComponent(config: AgentConfig): string {
  return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatWidget } from './components/ChatWidget';
import { FloatingButton } from './components/FloatingButton';
import { Bot, Star, MessageCircle, Sparkles } from 'lucide-react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            ${config.avatarUrl ? `<img src="${config.avatarUrl}" alt="${config.name}" className="w-10 h-10 rounded-full" />` : `<div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center"><Bot className="w-6 h-6 text-white" /></div>`}
            <div>
              <h1 className="text-xl font-bold text-gray-900">${config.name}</h1>
              <p className="text-sm text-gray-600">${config.brandName}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Now</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              ${config.avatarUrl ? `<img src="${config.avatarUrl}" alt="${config.name}" className="w-32 h-32 rounded-full mx-auto mb-6 shadow-2xl" />` : `<div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"><Bot className="w-16 h-16 text-white" /></div>`}
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Hi! I'm ${config.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                ${config.roleDescription}
              </p>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Conversation</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services & FAQ Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 text-primary-600 mr-2" />
                What I Can Help With
              </h3>
              <ul className="space-y-4">
                ${config.services.map(service => `<li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">${service}</span>
                </li>`).join('\n                ')}
              </ul>
            </motion.div>

            {/* Quick Questions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 text-primary-600 mr-2" />
                Quick Questions
              </h3>
              <div className="space-y-3">
                ${config.faqs.slice(0, 4).map(faq => `<button 
                  onClick={() => setIsOpen(true)}
                  className="block w-full text-left p-4 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-primary-600 transition-colors border border-gray-100 hover:border-primary-200"
                >
                  ${faq.question}
                </button>`).join('\n                ')}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            ${config.avatarUrl ? `<img src="${config.avatarUrl}" alt="${config.name}" className="w-8 h-8 rounded-full" />` : `<div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>`}
            <span className="text-lg font-semibold">${config.name}</span>
          </div>
          <p className="text-gray-400 mb-4">
            AI Assistant for ${config.brandName}
          </p>
          ${config.officeHours ? `<p className="text-sm text-gray-500">Office Hours: ${config.officeHours}</p>` : ''}
          <p className="text-xs text-gray-500 mt-4">
            Powered by PLUDO.AI
          </p>
        </div>
      </footer>

      {/* Chat Components */}
      <FloatingButton onClick={() => setIsOpen(true)} />
      <ChatWidget 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        config={${JSON.stringify(config)}}
      />
    </div>
  );
}

export default App;`;
}

function generateFloatingWidget(config: AgentConfig): string {
  return `import React, { useState } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { FloatingButton } from './components/FloatingButton';

function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 2147483647,
      pointerEvents: 'none'
    }}>
      <FloatingButton onClick={() => setIsOpen(true)} />
      <ChatWidget 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        config={${JSON.stringify(config)}}
      />
    </div>
  );
}

export default FloatingWidget;`;
}

function generateChatWidget(config: AgentConfig): string {
  return `import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { sendMessage } from '../lib/ai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, config }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: \`Hello! I'm \${config.name}, your AI assistant for \${config.brandName}. How can I help you today?\`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue, messages, config);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        pointerEvents: 'auto', 
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '16px'
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            height: isMinimized ? 'auto' : '600px'
          }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            maxHeight: '90vh'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              ${config.avatarUrl ? `<img src="${config.avatarUrl}" alt="${config.name}" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />` : `<div style={{ width: '40px', height: '40px', background: 'linear-gradient(to right, #3b82f6, #1d4ed8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot style={{ width: '24px', height: '24px', color: 'white' }} /></div>`}
              <div>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>\${config.name}</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>AI Assistant</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#9ca3af', 
                  cursor: 'pointer', 
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <Minimize2 style={{ width: '16px', height: '16px' }} />
              </button>
              <button 
                onClick={onClose} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#9ca3af', 
                  cursor: 'pointer', 
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      maxWidth: '75%',
                      flexDirection: message.isUser ? 'row-reverse' : 'row'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: message.isUser ? '#3b82f6' : '#d1d5db'
                      }}>
                        {message.isUser ? (
                          <User style={{ width: '16px', height: '16px', color: 'white' }} />
                        ) : (
                          <Bot style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        )}
                      </div>
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: '16px',
                          backgroundColor: message.isUser ? '#3b82f6' : 'white',
                          color: message.isUser ? 'white' : '#111827',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          boxShadow: message.isUser ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                          border: message.isUser ? 'none' : '1px solid #e5e7eb',
                          borderBottomLeftRadius: message.isUser ? '16px' : '4px',
                          borderBottomRightRadius: message.isUser ? '4px' : '16px'
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '75%' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#d1d5db',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Bot style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      </div>
                      <div style={{
                        backgroundColor: 'white',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        borderBottomLeftRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></div>
                          <div style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '16px',
                borderTop: '1px solid #f3f4f6',
                backgroundColor: 'white'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      border: '1px solid #d1d5db',
                      borderRadius: '24px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                      opacity: inputValue.trim() && !isLoading ? 1 : 0.5
                    }}
                  >
                    <Send style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};`;
}

function generateFloatingButton(config: AgentConfig): string {
  return `import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bot } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1
      }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
        color: 'white',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        pointerEvents: 'auto'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse",
          delay: 2
        }}
      >
        ${config.avatarUrl ? `<img src="${config.avatarUrl}" alt="${config.name}" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />` : `<Bot style={{ width: '24px', height: '24px' }} />`}
      </motion.div>
      
      {/* Pulse animation */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: '#3b82f6'
        }}
      />
    </motion.button>
  );
};`;
}

function generateAIService(config: AgentConfig): string {
  return `interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const OPENROUTER_API_KEY = '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';

export async function sendMessage(message: string, history: Message[], config: any): Promise<string> {
  const systemPrompt = await createSystemPrompt(config);
  const conversationHistory = history.slice(-10).map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text
  }));

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${OPENROUTER_API_KEY}\`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': \`\${config.brandName} AI Assistant\`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(\`API request failed: \${response.status}\`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'I apologize, but I\\'m having trouble connecting right now. Please try again in a moment.';
  }
}

async function createSystemPrompt(config: any): Promise<string> {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString();
  const dateString = currentTime.toLocaleDateString();
  
  let officeHoursNote = '';
  if (config.officeHours) {
    officeHoursNote = \`Our office hours are \${config.officeHours}. Current time is \${timeString} on \${dateString}.\`;
  }

  const faqsText = config.faqs.map((faq: any) => \`Q: \${faq.question}\\nA: \${faq.answer}\`).join('\\n\\n');
  const servicesText = config.services.join(', ');

  // Load knowledge from knowledge.txt if available
  let knowledgeContent = config.knowledge || '';
  try {
    const knowledgeResponse = await fetch('/knowledge.txt');
    if (knowledgeResponse.ok) {
      knowledgeContent = await knowledgeResponse.text();
    }
  } catch (error) {
    console.log('Could not load knowledge.txt, using config knowledge');
  }

  return \`You are \${config.name}, an AI assistant for \${config.brandName}. You are helpful, knowledgeable, and \${config.tone}.

IMPORTANT INSTRUCTIONS:
- Always stay in character as \${config.name}
- Be \${config.tone} in your communication style
- Focus on helping with \${config.brandName} related questions
- If asked about something outside your knowledge, politely redirect to contacting us directly
- Keep responses concise but informative (aim for 1-3 sentences unless more detail is specifically requested)
- Use the FAQ information when relevant questions are asked
- Be proactive in suggesting how you can help

YOUR ROLE: \${config.roleDescription}

SERVICES WE OFFER: \${servicesText}

FREQUENTLY ASKED QUESTIONS:
\${faqsText}

KNOWLEDGE BASE:
\${knowledgeContent}

\${officeHoursNote}

COMMUNICATION STYLE: \${config.tone}
- If friendly: Be warm, approachable, and use casual language
- If professional: Be formal, precise, and business-focused  
- If witty: Be clever, engaging, and use appropriate humor
- If minimal: Be concise, direct, and to-the-point

Remember: You represent \${config.brandName} and should always be helpful while staying within your knowledge domain.\`;
}`;
}

function generateConfigFile(config: AgentConfig): string {
  return `export const agentConfig = ${JSON.stringify(config, null, 2)};

export default agentConfig;`;
}

function generateWidgetScript(config: AgentConfig, vercelUrl?: string): string {
  // Use the provided vercelUrl or fall back to a placeholder that will be replaced during deployment
  const baseUrl = vercelUrl || '{{VERCEL_URL}}';
  
  return `(function() {
  'use strict';
  
  // Prevent multiple instances
  if (window.pludoAILoaded) return;
  window.pludoAILoaded = true;

  // Configuration
  const config = ${JSON.stringify(config)};
  
  // Get the base URL for the widget
  const getWidgetBaseUrl = () => {
    // If we have a hardcoded vercel URL, use it
    const hardcodedUrl = '${baseUrl}';
    if (hardcodedUrl && hardcodedUrl !== '{{VERCEL_URL}}') {
      return hardcodedUrl;
    }
    
    // Fallback: try to determine from script src
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('widget.js')) {
        const url = new URL(script.src);
        return url.origin;
      }
    }
    
    // Last resort: use current origin (this will likely fail for embedded widgets)
    console.warn('Could not determine widget base URL, using current origin');
    return window.location.origin;
  };
  
  // Create iframe for floating widget
  function createFloatingWidget() {
    const iframe = document.createElement('iframe');
    iframe.id = 'pludo-ai-widget';
    iframe.src = getWidgetBaseUrl() + '/widget.html';
    iframe.style.cssText = \`
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      border: none !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
      background: transparent !important;
    \`;
    // Add event listener to handle pointer events intelligently
    iframe.addEventListener('load', function() {
      try {
        // Try to access iframe content to set up pointer events
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // Add CSS to ensure the floating button is always clickable
          const style = iframeDoc.createElement('style');
          style.textContent = `
            #widget-root {
              position: relative;
              z-index: 2147483647;
            }
            #widget-root * {
              box-sizing: border-box;
            }
            /* Ensure floating button container is always clickable */
            #widget-root > div:first-child {
              pointer-events: auto !important;
              cursor: pointer !important;
            }
            /* Make sure the button itself is clickable */
            #widget-root button, #widget-root [style*="cursor: pointer"] {
              pointer-events: auto !important;
              cursor: pointer !important;
            }
            /* Ensure proper stacking context */
            #widget-root > div {
              position: relative;
              z-index: 2147483647;
            }
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (e) {
        // Cross-origin restrictions might prevent this
        console.log('Widget iframe loaded (cross-origin restrictions may apply)');
      }
    });

    return iframe;
  }

  // Initialize when DOM is ready
  function init() {
    const widget = createFloatingWidget();
    document.body.appendChild(widget);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
}

function generateReadme(config: AgentConfig): string {
  return `# ${config.name} - AI Assistant for ${config.brandName}

${config.roleDescription}

## Features

- 🤖 Intelligent AI-powered conversations
- 💬 Real-time chat interface
- 📱 Mobile-responsive design
- 🎨 Custom branded experience
- ⚡ Fast and reliable responses

## Services

${config.services.map(service => `- ${service}`).join('\n')}

## Getting Started

This AI assistant is ready to deploy and can be embedded on any website.

### Embedding on Your Website

Add this script tag to your website:

\`\`\`html
<script src="https://your-domain.vercel.app/widget.js" defer></script>
\`\`\`

### Local Development

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Configuration

The AI assistant is configured with:

- **Name**: ${config.name}
- **Brand**: ${config.brandName}
- **Tone**: ${config.tone}
- **Primary Color**: ${config.primaryColor}
${config.officeHours ? `- **Office Hours**: ${config.officeHours}` : ''}

## Knowledge Base

The assistant's knowledge is stored in \`knowledge.txt\` and includes:

${config.faqs.map(faq => `- ${faq.question}`).join('\n')}

## Powered By

- **PLUDO.AI** - No-code AI agent generator
- **OpenRouter** - AI model API
- **Vercel** - Hosting and deployment
- **React** - Frontend framework
- **Tailwind CSS** - Styling

## Support

For support or questions about this AI assistant, please contact ${config.brandName}.

---

*Generated by [PLUDO.AI](https://pludo.ai) - Create your own AI assistant in minutes!*`;
}

// Helper function to convert hex to HSL for color variations
function hexToHsl(hex: string, lightness: number): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert to HSL string with custom lightness
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${lightness}%)`;
}