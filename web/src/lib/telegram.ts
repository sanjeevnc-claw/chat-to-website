const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: { id: number; first_name: string; username?: string };
    chat: { id: number; type: string };
    text?: string;
    caption?: string;
    photo?: TelegramPhotoSize[];
    date: number;
    successful_payment?: {
      currency: string;
      total_amount: number;
      invoice_payload: string;
      telegram_payment_charge_id: string;
      provider_payment_charge_id: string;
    };
  };
  pre_checkout_query?: {
    id: string;
    from: { id: number; first_name: string; username?: string };
    currency: string;
    total_amount: number;
    invoice_payload: string;
  };
}

export async function sendMessage(chatId: number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
  const res = await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });
  if (!res.ok) {
    console.error('Telegram sendMessage failed:', await res.text());
  }
  return res;
}

export async function sendChatAction(chatId: number, action: string = 'typing') {
  await fetch(`${API}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action }),
  });
}

export async function sendInvoice(
  chatId: number,
  title: string,
  description: string,
  payload: string,
  prices: { label: string; amount: number }[]
) {
  const res = await fetch(`${API}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      title,
      description,
      payload,
      provider_token: '', // empty for Telegram Stars
      currency: 'XTR',
      prices,
    }),
  });
  if (!res.ok) {
    console.error('Telegram sendInvoice failed:', await res.text());
  }
  return res;
}

export async function answerPreCheckoutQuery(queryId: string, ok: boolean, errorMessage?: string) {
  const body: Record<string, unknown> = {
    pre_checkout_query_id: queryId,
    ok,
  };
  if (!ok && errorMessage) {
    body.error_message = errorMessage;
  }
  const res = await fetch(`${API}/answerPreCheckoutQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error('Telegram answerPreCheckoutQuery failed:', await res.text());
  }
  return res;
}

export async function getFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`${API}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`getFile failed: ${JSON.stringify(data)}`);
  return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
}

export async function downloadFile(fileId: string): Promise<{ buffer: Buffer; extension: string }> {
  const res = await fetch(`${API}/getFile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`getFile failed: ${JSON.stringify(data)}`);
  const filePath: string = data.result.file_path;
  const ext = filePath.split('.').pop() || 'jpg';
  const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  const fileRes = await fetch(fileUrl);
  const arrayBuffer = await fileRes.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), extension: ext };
}

export async function setWebhook(url: string) {
  const res = await fetch(`${API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return res.json();
}
