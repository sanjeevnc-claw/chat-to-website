'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageBubble, Message } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { PreviewCard } from './PreviewCard';
import { Sparkles, ArrowLeft, Eye, MessageCircle, CheckCircle } from 'lucide-react';
import { 
  AgentRole, 
  AgentState, 
  AGENT_INFO, 
  parseRequirements, 
  parseDesignSpec, 
  parseWebsiteCode 
} from '@/lib/agents';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: `👋 Hi! I'm **Alex**, your Product Manager.

I'll be working with a team to build your perfect website:

📋 **Alex (PM)** — I'll gather your requirements
🎨 **Maya (Designer)** — She'll craft the visual design  
💻 **Sam (Engineer)** — He'll build the code

Let's start! **What kind of website do you need?**

*Tell me about your business or project.*`,
  timestamp: new Date(),
  agent: 'product_manager',
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [agentState, setAgentState] = useState<AgentState>({
    currentAgent: 'product_manager',
    stage: 'requirements',
    requirements: null,
    designSpec: null,
    websiteCode: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      agent: agentState.currentAgent,
    };
    
    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Build message history for API (exclude initial greeting)
      const chatHistory: ChatMessage[] = messages
        .filter(m => m.id !== '1')
        .map(m => ({
          role: m.role,
          content: m.content,
        }));
      
      chatHistory.push({ role: 'user', content });

      // Call API with agent state
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: chatHistory, 
          agentState 
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let currentAgent = agentState.currentAgent;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              
              // Handle agent info
              if (parsed.agentInfo) {
                currentAgent = parsed.agentInfo.agent;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, agent: currentAgent }
                      : m
                  )
                );
              }
              
              // Handle text
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages(prev => 
                  prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      // Check for stage transitions
      let newState = { ...agentState };

      // Check for requirements handoff
      const requirements = parseRequirements(fullContent);
      if (requirements) {
        newState = {
          ...newState,
          requirements,
          currentAgent: 'designer',
          stage: 'design',
        };
        
        // Add handoff message
        setTimeout(() => {
          const handoffMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `🎨 **Maya here!** I'm the Designer.

I've reviewed Alex's requirements brief. Let me create a beautiful design for your ${requirements.businessType || 'website'}.

${requirements.referenceUrls?.length ? `I'll analyze your reference sites for inspiration.` : `Do you have any websites you like the style of? If not, I'll propose a modern design based on your brand.`}

Give me a moment to think about the best approach...`,
            timestamp: new Date(),
            agent: 'designer',
          };
          setMessages(prev => [...prev, handoffMessage]);
        }, 1000);
      }

      // Check for design handoff
      const designSpec = parseDesignSpec(fullContent);
      if (designSpec) {
        newState = {
          ...newState,
          designSpec,
          currentAgent: 'engineer',
          stage: 'build',
        };
        
        // Add handoff message
        setTimeout(() => {
          const handoffMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `💻 **Sam here!** I'm the Engineer.

I've got the requirements and design spec. Time to build!

I'll create a modern, responsive website with:
- Next.js 14 & Tailwind CSS
- Mobile-first design
- SEO optimization
- Clean, production-ready code

Building now... ⚡`,
            timestamp: new Date(),
            agent: 'engineer',
          };
          setMessages(prev => [...prev, handoffMessage]);
        }, 1000);
      }

      // Check for website code
      const websiteCode = parseWebsiteCode(fullContent);
      if (websiteCode) {
        newState = {
          ...newState,
          websiteCode,
          stage: 'review',
        };
      }

      setAgentState(newState);

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
  }, [messages, agentState]);

  const currentAgentInfo = AGENT_INFO[agentState.currentAgent];

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
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
              {currentAgentInfo.emoji}
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">{currentAgentInfo.name}</h1>
              <p className="text-xs text-muted-foreground">{currentAgentInfo.title}</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <StageIndicator 
            stage="requirements" 
            current={agentState.stage} 
            completed={!!agentState.requirements}
            label="PM"
          />
          <div className="w-4 h-px bg-border" />
          <StageIndicator 
            stage="design" 
            current={agentState.stage} 
            completed={!!agentState.designSpec}
            label="Design"
          />
          <div className="w-4 h-px bg-border" />
          <StageIndicator 
            stage="build" 
            current={agentState.stage} 
            completed={!!agentState.websiteCode}
            label="Build"
          />
        </div>

        {/* Mobile: Toggle between chat and preview */}
        {agentState.websiteCode && (
          <div className="flex lg:hidden items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMobileView('chat')}
              className={`p-2 rounded-md transition-colors touch-manipulation ${
                mobileView === 'chat' ? 'bg-background shadow-sm' : ''
              }`}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`p-2 rounded-md transition-colors touch-manipulation ${
                mobileView === 'preview' ? 'bg-background shadow-sm' : ''
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${agentState.websiteCode ? 'lg:max-w-xl' : ''} ${
          agentState.websiteCode && mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
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
                <span className="text-sm">{currentAgentInfo.name} is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>

        {/* Preview panel */}
        {agentState.websiteCode && (
          <div className={`flex-1 border-l bg-muted/30 p-3 sm:p-4 ${
            mobileView === 'preview' ? 'flex flex-col' : 'hidden'
          } lg:flex lg:flex-col`}>
            <PreviewCard 
              url="preview-ready"
              code={agentState.websiteCode}
            />
          </div>
        )}
      </div>

      {/* Mobile: Floating preview button */}
      {agentState.websiteCode && mobileView === 'chat' && (
        <button
          onClick={() => setMobileView('preview')}
          className="lg:hidden fixed bottom-24 right-4 p-4 bg-primary text-primary-foreground rounded-full shadow-lg touch-manipulation active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function StageIndicator({ 
  stage, 
  current, 
  completed, 
  label 
}: { 
  stage: string; 
  current: string; 
  completed: boolean;
  label: string;
}) {
  const isActive = current === stage;
  const isPast = completed;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
      isPast 
        ? 'bg-green-500/10 text-green-600' 
        : isActive 
          ? 'bg-primary/10 text-primary' 
          : 'bg-muted text-muted-foreground'
    }`}>
      {isPast ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
      )}
      {label}
    </div>
  );
}
