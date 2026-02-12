export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  context?: string
): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, context }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            yield parsed.text;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

export function extractWebsiteCode(content: string): Map<string, string> | null {
  const websiteMatch = content.match(/```website\n([\s\S]*?)```/);
  if (!websiteMatch) return null;

  const files = new Map<string, string>();
  const codeContent = websiteMatch[1];
  
  // Split by FILE: markers
  const fileRegex = /\/\/ FILE: (.+?)\n([\s\S]*?)(?=\/\/ FILE:|$)/g;
  let match;
  
  while ((match = fileRegex.exec(codeContent)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2].trim();
    files.set(filePath, fileContent);
  }

  return files.size > 0 ? files : null;
}

export function hasWebsiteCode(content: string): boolean {
  return content.includes('```website');
}
