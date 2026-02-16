import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface WebSession {
  credits: number;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  projectId?: string;
  createdAt: number;
}

const SYSTEM_PROMPT = `You are Chat to Website, an AI assistant that helps users build websites through conversation.

Your job is to:
1. Understand what kind of website the user wants
2. Ask clarifying questions if needed (business name, style preferences, pages needed)
3. Generate and deploy the website
4. Help them make changes

Keep responses concise and friendly. When you're ready to build, say "Building your website now..." 

For this web demo, simulate the website creation process since we're not connected to the full deployment system yet. Describe what the website would look like and what pages it would have.`;

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing sessionId or message' },
        { status: 400 }
      );
    }

    // Get or create session
    const sessionKey = `web:session:${sessionId}`;
    let session: WebSession | null = await redis.get(sessionKey);

    if (!session) {
      session = {
        credits: 5, // Free trial credits
        messages: [],
        createdAt: Date.now(),
      };
    }

    // Check credits
    if (session.credits <= 0) {
      return NextResponse.json({
        error: 'No credits remaining. Please purchase more credits.',
        creditsRemaining: 0,
      });
    }

    // Add user message to history
    session.messages.push({ role: 'user', content: message });

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: session.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract assistant response
    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Add assistant message to history
    session.messages.push({ role: 'assistant', content: assistantMessage });

    // Deduct credit
    session.credits -= 1;

    // Keep only last 20 messages to manage context size
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    // Save session (24 hour TTL)
    await redis.set(sessionKey, session, { ex: 86400 });

    return NextResponse.json({
      response: assistantMessage,
      creditsRemaining: session.credits,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
