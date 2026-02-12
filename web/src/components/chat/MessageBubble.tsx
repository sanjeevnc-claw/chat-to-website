'use client';

import { User, Image as ImageIcon, FileText } from 'lucide-react';
import { AgentRole, AGENT_INFO } from '@/lib/agents';

export interface Attachment {
  name: string;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  agent?: AgentRole;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const agentInfo = message.agent ? AGENT_INFO[message.agent] : null;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${
        isUser ? 'bg-primary' : 'bg-primary/10'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          agentInfo?.emoji || '🤖'
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        )}

        {/* Text */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
        }`}>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            <FormattedContent content={message.content} isUser={isUser} />
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  const isImage = attachment.type.startsWith('image/');

  if (isImage) {
    return (
      <div className="relative">
        <img 
          src={attachment.url} 
          alt={attachment.name}
          className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
      <FileText className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
    </div>
  );
}

function FormattedContent({ content, isUser }: { content: string; isUser: boolean }) {
  // Simple markdown-like formatting
  const parts = content.split(/(\*\*[^*]+\*\*|\n•|\n\d+\.)/);
  
  return (
    <>
      {parts.map((part, index) => {
        // Bold text
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        // Bullet point
        if (part === '\n•') {
          return <span key={index}><br />• </span>;
        }
        // Numbered list
        if (/^\n\d+\./.test(part)) {
          return <span key={index}><br />{part.slice(1)} </span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
