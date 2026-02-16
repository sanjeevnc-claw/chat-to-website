import Stripe from "stripe";
import {
  createPayment,
  completePayment,
  addCredits,
  getPaymentByProviderId,
} from "./supabase";

// ============================================
// CREDIT PACKAGES
// ============================================

export const CREDIT_PACKAGES = {
  starter: {
    id: "starter",
    name: "Starter",
    credits: 50,
    usd: { amount: 500, display: "$5" }, // cents
    inr: { amount: 40000, display: "₹400" }, // paise
  },
  builder: {
    id: "builder",
    name: "Builder",
    credits: 200,
    usd: { amount: 1500, display: "$15" },
    inr: { amount: 120000, display: "₹1,200" },
  },
  pro: {
    id: "pro",
    name: "Pro",
    credits: 500,
    usd: { amount: 3000, display: "$30" },
    inr: { amount: 240000, display: "₹2,400" },
  },
} as const;

export type PackageId = keyof typeof CREDIT_PACKAGES;

// ============================================
// STRIPE (lazy init)
// ============================================

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export async function createStripeCheckout(
  userId: string,
  packageId: PackageId,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const pkg = CREDIT_PACKAGES[packageId];
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${pkg.name} - ${pkg.credits} Credits`,
            description: `${pkg.credits} website generation credits`,
          },
          unit_amount: pkg.usd.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      packageId,
      credits: pkg.credits.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  // Create pending payment record
  await createPayment(
    userId,
    "stripe",
    session.id,
    pkg.usd.amount,
    "USD",
    pkg.credits,
    { sessionId: session.id }
  );

  return session.url!;
}

export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Find payment record
      const payment = await getPaymentByProviderId("stripe", session.id);
      if (!payment) {
        return { success: false, error: "Payment not found" };
      }

      // Complete payment and add credits
      await completePayment(payment.id);
      await addCredits(
        payment.user_id,
        payment.credits_purchased,
        payment.id,
        `Purchased ${payment.credits_purchased} credits via Stripe`
      );

      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ============================================
// DODO PAYMENTS (for India)
// ============================================

const DODO_API_URL = "https://api.dodopayments.com";
const DODO_API_KEY = process.env.DODO_API_KEY!;

interface DodoCheckoutResponse {
  payment_link: string;
  payment_id: string;
}

export async function createDodoCheckout(
  userId: string,
  packageId: PackageId,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const pkg = CREDIT_PACKAGES[packageId];

  const response = await fetch(`${DODO_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DODO_API_KEY}`,
    },
    body: JSON.stringify({
      billing: {
        city: "Mumbai",
        country: "IN",
        state: "MH",
        street: "N/A",
        zipcode: "400001",
      },
      customer: {
        email: `user-${userId}@chat-to-website.app`,
        name: "Customer",
      },
      payment_link: true,
      product_cart: [
        {
          name: `${pkg.name} - ${pkg.credits} Credits`,
          quantity: 1,
          amount: pkg.inr.amount / 100, // Dodo uses rupees, not paise
        },
      ],
      return_url: successUrl,
      metadata: {
        userId,
        packageId,
        credits: pkg.credits.toString(),
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Dodo API error: ${error}`);
  }

  const data = (await response.json()) as DodoCheckoutResponse;

  // Create pending payment record
  await createPayment(
    userId,
    "dodo",
    data.payment_id,
    pkg.inr.amount,
    "INR",
    pkg.credits,
    { paymentId: data.payment_id }
  );

  return data.payment_link;
}

export async function handleDodoWebhook(
  payload: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const paymentId = payload.payment_id as string;
    const status = payload.status as string;

    if (status !== "succeeded" && status !== "completed") {
      return { success: true }; // Ignore other statuses
    }

    // Find payment record
    const payment = await getPaymentByProviderId("dodo", paymentId);
    if (!payment) {
      return { success: false, error: "Payment not found" };
    }

    if (payment.status === "completed") {
      return { success: true }; // Already processed
    }

    // Complete payment and add credits
    await completePayment(payment.id);
    await addCredits(
      payment.user_id,
      payment.credits_purchased,
      payment.id,
      `Purchased ${payment.credits_purchased} credits via Dodo`
    );

    return { success: true };
  } catch (err) {
    console.error("Dodo webhook error:", err);
    return { success: false, error: (err as Error).message };
  }
}

// ============================================
// GEO DETECTION
// ============================================

export async function detectCountry(
  ip: string
): Promise<{ country: string; isIndia: boolean }> {
  try {
    // Use ip-api.com (free, no API key needed)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    const data = await response.json();
    const country = data.countryCode || "US";
    return { country, isIndia: country === "IN" };
  } catch {
    return { country: "US", isIndia: false };
  }
}
