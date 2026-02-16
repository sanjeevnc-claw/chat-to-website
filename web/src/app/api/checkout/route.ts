import { NextRequest, NextResponse } from 'next/server';

/**
 * Checkout API Route
 * 
 * Creates a checkout session with Stripe (global) or Dodo Payments (India)
 * 
 * PLACEHOLDER IMPLEMENTATION
 * 
 * Required environment variables:
 * - STRIPE_SECRET_KEY: Stripe API key
 * - STRIPE_PUBLISHABLE_KEY: Stripe publishable key (for client)
 * - DODO_PAYMENTS_API_KEY: Dodo Payments API key
 * - NEXT_PUBLIC_APP_URL: Your app URL for redirects
 */

interface CheckoutRequest {
  sessionId: string;
  packageId: string;
  credits: number;
  provider: 'stripe' | 'dodo';
  amount: number;
  currency: 'USD' | 'INR';
}

// Credit packages
const PACKAGES: Record<string, { credits: number; usd: number; inr: number }> = {
  starter: { credits: 50, usd: 199, inr: 9900 }, // cents/paise
  builder: { credits: 200, usd: 499, inr: 29900 },
  pro: { credits: 500, usd: 999, inr: 49900 },
};

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { sessionId, packageId, provider } = body;

    if (!sessionId || !packageId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json(
        { error: 'Invalid package' },
        { status: 400 }
      );
    }

    // Check if credentials are configured
    if (provider === 'stripe' && !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        message: '⚠️ Stripe is not configured yet. Please add STRIPE_SECRET_KEY to environment variables.',
        demo: true,
      });
    }

    if (provider === 'dodo' && !process.env.DODO_PAYMENTS_API_KEY) {
      return NextResponse.json({
        message: '⚠️ Dodo Payments is not configured yet. Please add DODO_PAYMENTS_API_KEY to environment variables.',
        demo: true,
      });
    }

    // === STRIPE CHECKOUT ===
    if (provider === 'stripe') {
      // Uncomment and use when STRIPE_SECRET_KEY is available:
      /*
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-12-18.acacia',
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${pkg.credits} Credits`,
                description: 'Chat to Website credits',
              },
              unit_amount: pkg.usd,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/try?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/try?canceled=true`,
        metadata: {
          sessionId,
          packageId,
          credits: pkg.credits.toString(),
        },
      });

      return NextResponse.json({ checkoutUrl: session.url });
      */

      return NextResponse.json({
        message: 'Stripe checkout session would be created here. Add STRIPE_SECRET_KEY to enable.',
        demo: true,
      });
    }

    // === DODO PAYMENTS CHECKOUT ===
    if (provider === 'dodo') {
      // Uncomment and use when DODO_PAYMENTS_API_KEY is available:
      /*
      const DodoPayments = (await import('dodopayments')).default;
      
      const client = new DodoPayments({
        bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
        environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
      });

      const checkoutSession = await client.checkoutSessions.create({
        product_cart: [{
          product_id: `credits_${packageId}`, // Pre-create in Dodo dashboard
          quantity: 1,
        }],
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/try?success=true`,
        metadata: {
          sessionId,
          credits: pkg.credits.toString(),
        },
      });

      return NextResponse.json({ checkoutUrl: checkoutSession.url });
      */

      return NextResponse.json({
        message: 'Dodo checkout session would be created here. Add DODO_PAYMENTS_API_KEY to enable.',
        demo: true,
      });
    }

    return NextResponse.json(
      { error: 'Invalid payment provider' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
