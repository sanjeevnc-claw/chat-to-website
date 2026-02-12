'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble, Message } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { PreviewCard } from './PreviewCard';
import { Sparkles, ArrowLeft, Eye, MessageCircle, X } from 'lucide-react';

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: `Hi! I'm here to help you build a website. 🎨

Just tell me about your business and what kind of website you need. For example:

• "I need a website for my coffee shop"
• "Build me a portfolio site for my photography"
• "I want a landing page for my consulting business"

You can also share websites you like for inspiration, or upload your logo!`,
  timestamp: new Date(),
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments?.map(f => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Call AI API
      // For now, simulate response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(content, messages.length),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Simulate preview after a few messages
      if (messages.length >= 4 && !previewUrl) {
        setPreviewUrl('https://example-preview.vercel.app');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-3 sm:px-4 py-3 flex items-center justify-between bg-card safe-area-top">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-muted rounded-lg transition-colors touch-manipulation"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">Website Builder</h1>
              <p className="text-xs text-muted-foreground">AI-powered</p>
            </div>
          </div>
        </div>
        
        {/* Desktop: View Preview link */}
        {previewUrl && (
          <a 
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-sm text-primary hover:underline"
          >
            View Preview →
          </a>
        )}

        {/* Mobile: Toggle between chat and preview */}
        {previewUrl && (
          <div className="flex lg:hidden items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMobileView('chat')}
              className={`p-2 rounded-md transition-colors touch-manipulation ${
                mobileView === 'chat' ? 'bg-background shadow-sm' : ''
              }`}
              aria-label="Show chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`p-2 rounded-md transition-colors touch-manipulation ${
                mobileView === 'preview' ? 'bg-background shadow-sm' : ''
              }`}
              aria-label="Show preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area - hidden on mobile when preview is shown */}
        <div className={`flex-1 flex flex-col ${previewUrl ? 'lg:max-w-xl' : ''} ${
          previewUrl && mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 overscroll-contain">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>

        {/* Preview panel - Desktop: side panel, Mobile: full screen when toggled */}
        {previewUrl && (
          <div className={`flex-1 border-l bg-muted/30 p-3 sm:p-4 ${
            mobileView === 'preview' ? 'flex flex-col' : 'hidden'
          } lg:flex lg:flex-col`}>
            <PreviewCard url={previewUrl} />
          </div>
        )}
      </div>

      {/* Mobile: Floating preview button when no preview yet */}
      {previewUrl && mobileView === 'chat' && (
        <button
          onClick={() => setMobileView('preview')}
          className="lg:hidden fixed bottom-24 right-4 p-4 bg-primary text-primary-foreground rounded-full shadow-lg touch-manipulation active:scale-95 transition-transform"
          aria-label="View preview"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Simulated responses for demo (will be replaced with real AI)
function getSimulatedResponse(userMessage: string, messageCount: number): string {
  const lower = userMessage.toLowerCase();
  
  if (messageCount <= 2) {
    if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('bakery') || lower.includes('restaurant')) {
      return `A ${lower.includes('coffee') ? 'coffee shop' : lower.includes('bakery') ? 'bakery' : 'restaurant'} website! Love it. ☕

To create the perfect site, I need a few details:

1. **What's your business name?**
2. **Do you have any websites you like the style of?** (Share links if you have them)
3. **What pages do you need?** (Menu, About, Contact, etc.)

Also, feel free to upload your logo if you have one!`;
    }
    
    return `Great! I'd love to help you build that.

To get started, could you tell me:

1. **What's your business/project called?**
2. **What's the main purpose of the site?** (Showcase work, get customers, sell products, etc.)
3. **Any websites you like the style of?**

The more details you share, the better I can design something perfect for you!`;
  }
  
  if (messageCount <= 4) {
    return `Perfect, I have a good picture now! 🎨

I'm going to create a modern, clean website with:
• A welcoming hero section
• Information about your business
• Easy-to-find contact details
• Mobile-friendly design

**Building your preview now...** This will take about 30 seconds.`;
  }
  
  return `I've made that change! Your preview has been updated.

Here's what we have so far. What would you like to adjust?

You can ask me to:
• Change colors or fonts
• Add or remove sections
• Update any text
• Add new pages

When you're happy with it, just say **"deploy"** and I'll make it live!`;
}
