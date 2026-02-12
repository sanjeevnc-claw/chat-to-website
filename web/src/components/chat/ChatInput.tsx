'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, X, Image, FileText } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() || attachments.length > 0) {
      onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Accept images and common documents
      const validTypes = ['image/', 'application/pdf', 'text/'];
      return validTypes.some(type => file.type.startsWith(type));
    });
    
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="border-t bg-card p-3 sm:p-4 safe-area-bottom">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-muted rounded-lg group"
            >
              {file.type.startsWith('image/') ? (
                <Image className="w-4 h-4 text-muted-foreground" />
              ) : (
                <FileText className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-1 hover:bg-background rounded opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* File upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2.5 sm:p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 touch-manipulation shrink-0"
          title="Upload file"
          aria-label="Upload file"
        >
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text input */}
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your website..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-lg border bg-background px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="p-2.5 sm:p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shrink-0 active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Helper text - hidden on mobile */}
      <p className="hidden sm:block text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send • Shift+Enter for new line • Upload images or your logo
      </p>
    </div>
  );
}
