'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageBubble, Message } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { PreviewCard } from './PreviewCard';
import { Sparkles, ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import { streamChat, extractWebsiteCode, hasWebsiteCode, ChatMessage } from '@/lib/chat';

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: `Hi! I'm here to help you build a website. 🎨

Tell me about your business or project, and I'll create a beautiful website for you.

**Some examples:**
• "I need a website for my coffee shop called Bean & Brew"
• "Build me a portfolio site for my photography work"
• "I want a landing page for my SaaS product"

What would you like to build?`,
  timestamp: new Date(),
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<Map<string, string> | null>(null);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (content: string, attachments?: File[]) => {
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

    // Prepare context from attachments
    let context = '';
    if (attachments?.length) {
      context = `User uploaded ${attachments.length} file(s): ${attachments.map(f => f.name).join(', ')}`;
    }

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Build message history for API
      const chatHistory: ChatMessage[] = messages
        .filter(m => m.id !== '1') // Exclude initial greeting
        .map(m => ({
          role: m.role,
          content: m.content,
        }));
      
      chatHistory.push({ role: 'user', content });

      // Stream the response
      let fullContent = '';
      
      for await (const chunk of streamChat(chatHistory, context)) {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(m => 
            m.id === assistantMessageId 
              ? { ...m, content: fullContent }
              : m
          )
        );
      }

      // Check if response contains website code
      if (hasWebsiteCode(fullContent)) {
        const code = extractWebsiteCode(fullContent);
        if (code) {
          setGeneratedCode(code);
          // In a real implementation, we'd deploy this to a preview
          setPreviewUrl('preview-ready');
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(m => 
          m.id === assistantMessageId 
            ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

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
        {generatedCode && (
          <span className="hidden sm:inline-flex text-sm text-green-500 font-medium">
            ✓ Website Generated
          </span>
        )}

        {/* Mobile: Toggle between chat and preview */}
        {generatedCode && (
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
        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${generatedCode ? 'lg:max-w-xl' : ''} ${
          generatedCode && mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 overscroll-contain">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && messages[messages.length - 1]?.content === '' && (
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

        {/* Preview panel */}
        {generatedCode && (
          <div className={`flex-1 border-l bg-muted/30 p-3 sm:p-4 ${
            mobileView === 'preview' ? 'flex flex-col' : 'hidden'
          } lg:flex lg:flex-col`}>
            <PreviewCard 
              url={previewUrl || ''} 
              code={generatedCode}
            />
          </div>
        )}
      </div>

      {/* Mobile: Floating preview button */}
      {generatedCode && mobileView === 'chat' && (
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
