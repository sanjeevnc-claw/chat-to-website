import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

/**
 * Dodo Payments Webhook Handler
 * 
 * Handles payment.succeeded events to add credits to user sessions.
 * 
 * Required environment variables:
 * - DODO_PAYMENTS_API_KEY: Dodo API key
 * - DODO_WEBHOOK_SECRET: Webhook signing secret (if applicable)
 * - UPSTASH_REDIS_REST_URL: Redis URL
 * - UPSTASH_REDIS_REST_TOKEN: Redis token
 * 
 * Setup:
 * 1. In Dodo Dashboard → Settings → Webhooks → Add endpoint
 * 2. URL: https://your-domain.com/api/webhook/dodo
 * 3. Events: payment.succeeded, checkout.completed
 */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Credit packages (must match checkout route)
const PACKAGES: Record<string, number> = {
  starter: 50,
  builder: 200,
  pro: 500,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log for debugging
    console.log('Dodo webhook received:', JSON.stringify(body, null, 2));

    if (!process.env.DODO_PAYMENTS_API_KEY) {
      console.error('DODO_PAYMENTS_API_KEY not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Verify webhook signature if Dodo provides one
    // const signature = request.headers.get('x-dodo-signature');
    // TODO: Verify signature when Dodo provides verification method

    // Handle different event types
    const eventType = body.event_type || body.type;
    
    if (eventType === 'payment.succeeded' || eventType === 'checkout.completed') {
      const metadata = body.metadata || body.data?.metadata || {};
      const { sessionId, credits, packageId } = metadata;

      // Determine credits from packageId if not directly provided
      const creditAmount = credits 
        ? parseInt(credits, 10) 
        : (packageId && PACKAGES[packageId]) || 0;

      if (sessionId && creditAmount > 0) {
        const sessionKey = `web:session:${sessionId}`;
        const userSession = await redis.get(sessionKey);

        if (userSession && typeof userSession === 'object') {
          const currentCredits = (userSession as any).credits || 0;
          const newCredits = currentCredits + creditAmount;
          
          await redis.set(sessionKey, {
            ...userSession,
            credits: newCredits,
          }, { ex: 86400 * 30 }); // 30 day TTL after purchase

          console.log(`[Dodo] Added ${creditAmount} credits to session ${sessionId}. New total: ${newCredits}`);
        } else {
          // Create new session if it doesn't exist
          await redis.set(sessionKey, {
            credits: creditAmount,
            messages: [],
            createdAt: Date.now(),
          }, { ex: 86400 * 30 });
          
          console.log(`[Dodo] Created new session ${sessionId} with ${creditAmount} credits`);
        }

        return NextResponse.json({ 
          received: true, 
          creditsAdded: creditAmount,
          sessionId,
        });
      } else {
        console.warn('[Dodo] Missing sessionId or credits in metadata:', metadata);
      }
    }

    // Acknowledge receipt for other events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Dodo webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle GET for webhook verification if needed
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    webhook: 'dodo-payments',
    configured: !!process.env.DODO_PAYMENTS_API_KEY,
  });
}
