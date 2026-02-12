import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `You are an expert website builder AI. Your job is to help users create beautiful, professional websites through conversation.

## Your Capabilities:
1. Understand what kind of website the user needs
2. Ask clarifying questions about their business/project
3. Generate complete, production-ready website code
4. Make iterative changes based on feedback

## Conversation Flow:
1. First, understand what they need (business type, purpose, style preferences)
2. Ask about: business name, color preferences, pages needed, any reference sites
3. Once you have enough info, generate the website
4. Allow iterative refinements

## When Generating Code:
- Use Next.js 14 with App Router
- Use Tailwind CSS for styling
- Make it mobile-responsive
- Include proper SEO meta tags
- Create beautiful, modern designs

## Code Output Format:
When you're ready to generate code, output it in this exact format:

\`\`\`website
// FILE: app/page.tsx
[code here]

// FILE: app/layout.tsx
[code here]

// FILE: app/globals.css
[code here]

// FILE: components/Header.tsx
[code here]
\`\`\`

## Important:
- Be conversational and friendly
- Don't generate code until you have enough information
- Always explain what you're creating
- Offer suggestions and best practices`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8096,
            system: SYSTEM_PROMPT + (context ? `\n\nAdditional context:\n${context}` : ''),
            messages: anthropicMessages,
            stream: true,
          });

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const chunk = encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
              controller.enqueue(chunk);
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
