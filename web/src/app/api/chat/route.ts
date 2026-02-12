import { NextRequest } from 'next/server';

const BASE_SYSTEM_PROMPT = `You help people build websites through chat. Be direct and concise.

RULES:
- Don't be chatty. Get to the point.
- Ask only what you need. 1-2 questions max before building something.
- Once you have a basic idea, BUILD IT. Don't ask more questions.
- NEVER show code to the user. They don't want to see it.
- When you're ready to build, say something brief like "Building your website now..." then output the HTML.
- Iterate based on their feedback, not hypotheticals.

FIRST MESSAGE FLOW:
1. User describes what they want
2. Ask 1 clarifying question if truly needed (or skip if clear enough)
3. Say "Building your website..." then generate it

OUTPUT FORMAT:
When generating a website, output the full HTML in a code block. The user won't see this — it gets auto-deployed:

\`\`\`html
<!DOCTYPE html>
<html>
...complete working website...
</html>
\`\`\`

IMPORTANT: Before the code block, write a SHORT message like "Building your site now..." or "Here's your updated website:". After the code block, DO NOT add anything. The system will auto-deploy and show the link.`;

const ITERATION_CONTEXT = `

ITERATION:
The user already has a live website. They want changes to it. The current HTML is provided below.
- When the user asks for changes, output the FULL updated HTML (not a diff).
- Keep everything from the current version unless the user explicitly asks to change it.
- Always output the complete HTML in a \`\`\`html code block.

CURRENT WEBSITE HTML:
\`\`\`html
{{CURRENT_HTML}}
\`\`\``;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentHtml } = await request.json();

    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (currentHtml) {
      systemPrompt += ITERATION_CONTEXT.replace('{{CURRENT_HTML}}', currentHtml);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8096,
        system: systemPrompt,
        stream: true,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return new Response(JSON.stringify({ error: 'API request failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
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
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`)
                    );
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
