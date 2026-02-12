import { NextResponse } from 'next/server';
import { setWebhook } from '@/lib/telegram';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL not set' }, { status: 500 });
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;
  const result = await setWebhook(webhookUrl);

  return NextResponse.json({ webhookUrl, result });
}
