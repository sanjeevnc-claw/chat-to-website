'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  deployStatus?: 'deploying' | 'done' | 'error';
  deployUrl?: string;
  repoUrl?: string;
  deployError?: string;
}

function extractHtml(content: string): string | null {
  const match = content.match(/```html\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function getDisplayText(raw: string): string {
  // If we're mid-stream and a code block has started but not closed, hide everything from ```html onward
  const codeStart = raw.indexOf('```html');
  if (codeStart === -1) return raw.trim();
  
  const before = raw.slice(0, codeStart).trim();
  
  // Check if the code block is closed
  const afterStart = raw.slice(codeStart + 7);
  const codeEnd = afterStart.indexOf('```');
  
  if (codeEnd === -1) {
    // Still streaming code — show text before + building message
    return before || '🔨 Building your website...';
  }
  
  // Code block is complete — show text before + text after
  const after = afterStart.slice(codeEnd + 3).trim();
  return (before + (after ? '\n' + after : '')).trim() || '🔨 Your website is ready!';
}

function DeployStatus({ message }: { message: Message }) {
  if (message.deployStatus === 'deploying') {
    return (
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm flex items-center gap-2">
        <span className="animate-spin">⏳</span>
        <span className="text-blue-800">Deploying your website...</span>
      </div>
    );
  }

  if (message.deployStatus === 'done') {
    return (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
        <p className="font-medium text-green-800">✅ Your website is live!</p>
        <a href={message.deployUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline block mt-1 font-medium">
          {message.deployUrl} →
        </a>
        <a href={message.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline block mt-1 text-xs">
          View source on GitHub
        </a>
      </div>
    );
  }

  if (message.deployStatus === 'error') {
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
        <p className="text-red-700">❌ Deploy failed: {message.deployError}</p>
      </div>
    );
  }

  return null;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "What do you want to build?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRepoName, setCurrentRepoName] = useState<string | null>(null);
  const [currentHtml, setCurrentHtml] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const deployedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const autoDeploy = useCallback(async (messageIndex: number, html: string) => {
    if (deployedRef.current.has(messageIndex)) return;
    deployedRef.current.add(messageIndex);

    const projectName = `site-${Date.now().toString(36)}`;

    setMessages(prev => {
      const updated = [...prev];
      updated[messageIndex] = { ...updated[messageIndex], deployStatus: 'deploying' };
      return updated;
    });

    try {
      const body: Record<string, string> = { html };
      if (currentRepoName) {
        body.existingRepo = currentRepoName;
      } else {
        body.projectName = projectName;
      }

      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deploy failed');

      // Store repo name for subsequent deploys
      if (data.repoName) {
        setCurrentRepoName(data.repoName);
      }
      setCurrentHtml(html);

      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          deployStatus: 'done',
          deployUrl: data.deployUrl,
          repoUrl: data.repoUrl,
        };
        return updated;
      });
    } catch (err: unknown) {
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = {
          ...updated[messageIndex],
          deployStatus: 'error',
          deployError: err instanceof Error ? err.message : 'Deploy failed',
        };
        return updated;
      });
    }
  }, [currentRepoName]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          ...(currentHtml ? { currentHtml } : {}),
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let rawContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '🔨 Building your website...' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                rawContent += parsed.content;
                const display = getDisplayText(rawContent);
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: display,
                  };
                  return newMessages;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Streaming done — check for HTML and auto-deploy
      const html = extractHtml(rawContent);
      const finalDisplay = getDisplayText(rawContent);

      setMessages(prev => {
        const updated = [...prev];
        const idx = updated.length - 1;
        updated[idx] = { ...updated[idx], content: finalDisplay };
        return updated;
      });

      if (html) {
        const idx = messages.length + 1; // user msg + assistant msg
        setTimeout(() => autoDeploy(idx, html), 100);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div key={i} className={`${message.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'assistant' && <DeployStatus message={message} />}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your website..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
