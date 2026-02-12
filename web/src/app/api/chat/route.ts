import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { 
  AGENT_PROMPTS, 
  AgentRole, 
  buildAgentContext,
  Requirements,
  DesignSpec 
} from '@/lib/agents';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { messages, agentState } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Determine current agent based on state
    const currentAgent: AgentRole = agentState?.currentAgent || 'product_manager';
    
    // Build system prompt with agent personality + context
    let systemPrompt = AGENT_PROMPTS[currentAgent];
    
    // Add context from previous agents
    const context = buildAgentContext(agentState || {});
    if (context) {
      systemPrompt += `\n\n## Context from Previous Stages:\n${context}`;
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
          // Send agent info first
          const agentInfo = { agent: currentAgent };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ agentInfo })}\n\n`)
          );

          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8096,
            system: systemPrompt,
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
