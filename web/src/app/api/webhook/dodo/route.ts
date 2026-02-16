import { NextRequest, NextResponse } from "next/server";
import { handleDodoWebhook } from "@/lib/payments";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // TODO: Verify webhook signature from Dodo
    // const signature = request.headers.get("x-dodo-signature");

    const result = await handleDodoWebhook(payload);

    if (!result.success) {
      console.error("Dodo webhook error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Dodo webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
