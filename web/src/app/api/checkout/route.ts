import { NextRequest, NextResponse } from "next/server";
import {
  createStripeCheckout,
  createDodoCheckout,
  PackageId,
} from "@/lib/payments";
import { getOrCreateWebUser } from "@/lib/supabase";

interface CheckoutRequest {
  sessionId: string;
  packageId: string;
  provider: "stripe" | "dodo";
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { sessionId, packageId, provider } = body;

    if (!sessionId || !packageId || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate package ID
    if (!["starter", "builder", "pro"].includes(packageId)) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Get base URL for redirects
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://web-chi-puce-42.vercel.app";
    const successUrl = `${baseUrl}/try?success=true`;
    const cancelUrl = `${baseUrl}/try?canceled=true`;

    // Get or create user from session ID
    const countryCode = provider === "dodo" ? "IN" : undefined;
    const user = await getOrCreateWebUser(sessionId, countryCode);

    // Create checkout session
    let checkoutUrl: string;

    if (provider === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { error: "Stripe is not configured" },
          { status: 500 }
        );
      }
      checkoutUrl = await createStripeCheckout(
        user.id,
        packageId as PackageId,
        successUrl,
        cancelUrl
      );
    } else if (provider === "dodo") {
      if (!process.env.DODO_API_KEY) {
        return NextResponse.json(
          { error: "Dodo Payments is not configured" },
          { status: 500 }
        );
      }
      checkoutUrl = await createDodoCheckout(
        user.id,
        packageId as PackageId,
        successUrl,
        cancelUrl
      );
    } else {
      return NextResponse.json(
        { error: "Invalid payment provider" },
        { status: 400 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
