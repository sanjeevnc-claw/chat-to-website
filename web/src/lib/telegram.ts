const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramVoice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
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
    voice?: TelegramVoice;
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

/**
 * Download voice file from Telegram and transcribe using OpenAI Whisper API
 */
export async function transcribeVoice(fileId: string): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Download voice file from Telegram
  const { buffer, extension } = await downloadFile(fileId);
  
  // Telegram voice messages are typically in .oga (Opus) format
  // Whisper accepts: mp3, mp4, mpeg, mpga, m4a, wav, webm, ogg
  const mimeType = extension === 'oga' || extension === 'ogg' ? 'audio/ogg' : `audio/${extension}`;
  
  // Create form data for Whisper API
  const formData = new FormData();
  const audioBlob = new Blob([buffer], { type: mimeType });
  formData.append('file', audioBlob, `voice.${extension === 'oga' ? 'ogg' : extension}`);
  formData.append('model', 'whisper-1');
  formData.append('language', 'en'); // Can be auto-detected, but explicit is faster
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Whisper API error:', errorText);
    throw new Error(`Whisper transcription failed: ${response.status}`);
  }
  
  const data = await response.json();
  return data.text || '';
}
