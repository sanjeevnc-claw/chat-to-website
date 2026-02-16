import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Download a file from Telegram servers
 */
export async function downloadTelegramFile(fileId: string): Promise<Buffer> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;

  // Get file path from Telegram
  const fileInfoResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
  );
  const fileInfo = await fileInfoResponse.json();

  if (!fileInfo.ok) {
    throw new Error(`Failed to get file info: ${fileInfo.description}`);
  }

  const filePath = fileInfo.result.file_path;

  // Download the actual file
  const fileResponse = await fetch(
    `https://api.telegram.org/file/bot${botToken}/${filePath}`
  );

  if (!fileResponse.ok) {
    throw new Error(`Failed to download file: ${fileResponse.statusText}`);
  }

  const arrayBuffer = await fileResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Transcribe audio using OpenAI Whisper
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string = "audio/ogg"
): Promise<string> {
  // Determine file extension from mime type
  const extensions: Record<string, string> = {
    "audio/ogg": "ogg",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/wav": "wav",
    "audio/webm": "webm",
  };
  const ext = extensions[mimeType] || "ogg";

  // Create a File object for the OpenAI API
  const file = new File([new Uint8Array(audioBuffer)], `audio.${ext}`, { type: mimeType });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "text",
  });

  return transcription.trim();
}

/**
 * Process a Telegram voice message
 * Downloads the file and transcribes it
 */
export async function processVoiceMessage(
  fileId: string,
  mimeType: string = "audio/ogg"
): Promise<string> {
  // Download the voice file from Telegram
  const audioBuffer = await downloadTelegramFile(fileId);

  // Transcribe using Whisper
  const transcription = await transcribeAudio(audioBuffer, mimeType);

  if (!transcription) {
    throw new Error("Could not transcribe audio - no speech detected");
  }

  return transcription;
}

/**
 * Check if OpenAI API is configured
 */
export function isVoiceEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
