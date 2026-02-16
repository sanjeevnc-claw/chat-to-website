import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

/**
 * Stripe Webhook Handler
 * 
 * Handles checkout.session.completed events to add credits to user sessions.
 * 
 * Required environment variables:
 * - STRIPE_SECRET_KEY: Stripe API key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret
 * - UPSTASH_REDIS_REST_URL: Redis URL
 * - UPSTASH_REDIS_REST_TOKEN: Redis token
 * 
 * Setup:
 * 1. In Stripe Dashboard → Developers → Webhooks → Add endpoint
 * 2. URL: https://your-domain.com/api/webhook/stripe
 * 3. Events: checkout.session.completed
 * 4. Copy signing secret to STRIPE_WEBHOOK_SECRET
 */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    // Uncomment when Stripe is configured:
    /*
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { sessionId, credits } = session.metadata || {};

      if (sessionId && credits) {
        const sessionKey = `web:session:${sessionId}`;
        const userSession = await redis.get(sessionKey);

        if (userSession && typeof userSession === 'object') {
          const currentCredits = (userSession as any).credits || 0;
          const newCredits = currentCredits + parseInt(credits, 10);
          
          await redis.set(sessionKey, {
            ...userSession,
            credits: newCredits,
          }, { ex: 86400 * 30 }); // 30 day TTL after purchase

          console.log(`Added ${credits} credits to session ${sessionId}. New total: ${newCredits}`);
        }
      }
    }
    */

    // Placeholder response
    console.log('Stripe webhook received (not configured yet)');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
