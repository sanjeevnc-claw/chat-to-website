# Telegram & WhatsApp Integration

## Architecture: Unified Backend, Multiple Frontends

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHAT CHANNELS                               │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Web Chat  │  │  Telegram   │  │  WhatsApp   │              │
│  │  (Next.js)  │  │    Bot      │  │  Business   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         │    ┌───────────┴───────────┐    │                      │
│         │    │   Message Adapter     │    │                      │
│         │    │   (normalize format)  │    │                      │
│         │    └───────────┬───────────┘    │                      │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│              ┌───────────────────────┐                          │
│              │    UNIFIED BACKEND    │                          │
│              │   (Same AI + Logic)   │                          │
│              └───────────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle**: Same conversation logic, different delivery mechanisms.

---

## Telegram Bot Approach

### Setup
```
1. Create bot via @BotFather
2. Get bot token
3. Set webhook: POST /api/webhook/telegram
4. Bot handles all messages
```

### Webhook Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Telegram   │     │   Webhook   │     │   Backend   │
│   Server    │────▶│  /telegram  │────▶│   Process   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐            │
                    │  Send Reply │◀───────────┘
                    │  (Bot API)  │
                    └─────────────┘
```

### Message Handling

```typescript
// /api/webhook/telegram/route.ts

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    from: { id: number; username?: string };
    text?: string;
    photo?: Array<{ file_id: string }>;
    document?: { file_id: string; file_name: string };
  };
}

export async function POST(req: Request) {
  const update: TelegramUpdate = await req.json();
  const chatId = update.message?.chat.id;
  const userId = update.message?.from.id;
  
  // 1. Get or create user by Telegram ID
  const user = await getOrCreateUser({ telegramId: userId });
  
  // 2. Handle message type
  if (update.message?.text) {
    // Text message → process with AI
    const response = await processMessage(user.id, update.message.text);
    await sendTelegramMessage(chatId, response);
  }
  
  if (update.message?.photo) {
    // Photo upload → download and store
    const fileId = update.message.photo[update.message.photo.length - 1].file_id;
    const fileUrl = await downloadTelegramFile(fileId);
    const assetUrl = await uploadToStorage(fileUrl);
    
    // Acknowledge and process
    await sendTelegramMessage(chatId, "Got your image! 📸");
    await processMessage(user.id, `[USER UPLOADED IMAGE: ${assetUrl}]`);
  }
  
  return Response.json({ ok: true });
}
```

### Telegram-Specific Features

```typescript
// Rich formatting for domain results
function formatDomainResults(domains: Domain[]): string {
  let msg = "🌐 *Available Domains*\n\n";
  
  for (const d of domains) {
    const emoji = d.source === 'cloudflare' ? '⭐' : '💰';
    msg += `${emoji} \`${d.name}\` - $${d.price}/yr\n`;
  }
  
  msg += "\n_Reply with the domain you want to buy_";
  return msg;
}

// Inline keyboards for quick actions
function createActionButtons() {
  return {
    inline_keyboard: [
      [
        { text: "✅ Deploy Now", callback_data: "deploy" },
        { text: "✏️ Make Changes", callback_data: "edit" }
      ],
      [
        { text: "🌐 Get Domain", callback_data: "domain" }
      ]
    ]
  };
}

// Send with buttons
await sendTelegramMessage(chatId, "Your preview is ready!", {
  reply_markup: createActionButtons()
});
```

### File Handling in Telegram

```typescript
// Download file from Telegram servers
async function downloadTelegramFile(fileId: string): Promise<string> {
  // 1. Get file path
  const fileInfo = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
  ).then(r => r.json());
  
  // 2. Download file
  const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
  
  // 3. Upload to our storage (R2/S3)
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const storageUrl = await uploadToR2(buffer, fileInfo.result.file_path);
  
  return storageUrl;
}
```

---

## WhatsApp Business Approach

### Options

| Provider | Pros | Cons |
|----------|------|------|
| **Meta Cloud API** (Direct) | Official, free tier | Complex setup, approval needed |
| **Twilio** | Easy integration | $0.005-0.05 per message |
| **MessageBird** | Good API | Pricing |
| **360dialog** | Cheaper | Less docs |

**Recommendation**: Start with **Twilio** for speed, migrate to Meta direct later.

### Setup (Twilio)

```
1. Create Twilio account
2. Get WhatsApp-enabled number (or use sandbox)
3. Configure webhook: POST /api/webhook/whatsapp
4. Handle incoming messages
```

### Webhook Flow

```typescript
// /api/webhook/whatsapp/route.ts

export async function POST(req: Request) {
  const body = await req.formData();
  
  const from = body.get('From') as string;        // whatsapp:+1234567890
  const messageBody = body.get('Body') as string;
  const numMedia = parseInt(body.get('NumMedia') as string || '0');
  
  // Extract phone number
  const phoneNumber = from.replace('whatsapp:', '');
  
  // Get or create user
  const user = await getOrCreateUser({ whatsappNumber: phoneNumber });
  
  // Handle media attachments
  if (numMedia > 0) {
    for (let i = 0; i < numMedia; i++) {
      const mediaUrl = body.get(`MediaUrl${i}`) as string;
      const mediaType = body.get(`MediaContentType${i}`) as string;
      
      // Download and store
      const assetUrl = await downloadAndStore(mediaUrl);
      await processMessage(user.id, `[USER UPLOADED: ${assetUrl}]`);
    }
  }
  
  // Handle text
  if (messageBody) {
    const response = await processMessage(user.id, messageBody);
    await sendWhatsAppMessage(phoneNumber, response);
  }
  
  return new Response('OK');
}
```

### Sending Messages

```typescript
import twilio from 'twilio';

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

async function sendWhatsAppMessage(to: string, body: string) {
  await client.messages.create({
    from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body: body
  });
}

// Send with media (preview image)
async function sendWhatsAppWithImage(to: string, body: string, imageUrl: string) {
  await client.messages.create({
    from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body: body,
    mediaUrl: [imageUrl]
  });
}
```

### WhatsApp Message Templates

WhatsApp Business requires **pre-approved templates** for proactive messages:

```
Template: website_ready
"Hi {{1}}! Your website is now live at {{2}} 🎉"

Template: payment_link  
"To complete your domain purchase, please visit: {{1}}"

Template: preview_ready
"Your website preview is ready! Check it out: {{1}}"
```

---

## Unified Message Adapter

```typescript
// lib/channels/adapter.ts

interface NormalizedMessage {
  userId: string;
  channel: 'web' | 'telegram' | 'whatsapp';
  channelUserId: string;  // telegram ID, phone number, etc.
  text: string;
  attachments: Array<{
    type: 'image' | 'document';
    url: string;
    filename?: string;
  }>;
}

interface NormalizedResponse {
  text: string;
  markdown?: string;       // Rich formatting
  buttons?: Array<{        // Quick actions
    label: string;
    action: string;
  }>;
  media?: {
    type: 'image' | 'link';
    url: string;
  };
}

// Channel-specific formatters
function formatForChannel(response: NormalizedResponse, channel: string): any {
  switch (channel) {
    case 'telegram':
      return {
        text: response.markdown || response.text,
        parse_mode: 'Markdown',
        reply_markup: response.buttons ? {
          inline_keyboard: [response.buttons.map(b => ({
            text: b.label,
            callback_data: b.action
          }))]
        } : undefined
      };
      
    case 'whatsapp':
      // WhatsApp: simpler formatting, no inline buttons
      let text = response.text;
      if (response.buttons) {
        text += '\n\nReply with:\n';
        response.buttons.forEach((b, i) => {
          text += `${i + 1}. ${b.label}\n`;
        });
      }
      return { body: text };
      
    case 'web':
      return response; // Full rich format
  }
}
```

---

## Payment Flow on Telegram/WhatsApp

**Challenge**: Can't embed Stripe checkout in messaging apps.

**Solution**: Payment links

```typescript
// Generate Stripe Payment Link
async function createPaymentLink(domain: string, userId: string): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Domain: ${domain}`,
          description: '1 year registration'
        },
        unit_amount: 1200, // $12.00
      },
      quantity: 1
    }],
    success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/payment/cancel`,
    metadata: {
      userId,
      domain,
      channel: 'telegram' // or 'whatsapp'
    }
  });
  
  return session.url!;
}

// In conversation
if (intent === 'BUY_DOMAIN') {
  const paymentUrl = await createPaymentLink('example.com', user.id);
  
  await sendMessage(chatId, 
    `💳 To purchase *example.com*, complete payment here:\n\n${paymentUrl}\n\n` +
    `_I'll confirm once payment is received!_`
  );
}

// Webhook handles completion
// POST /api/webhook/stripe
// → Sees metadata.channel = 'telegram'
// → Sends confirmation via Telegram
```

---

## Preview Delivery

### Web: Embed iframe
```tsx
<iframe src={previewUrl} className="w-full h-96" />
```

### Telegram/WhatsApp: Screenshot + Link

```typescript
async function sendPreview(channel: string, chatId: string, previewUrl: string) {
  // 1. Generate screenshot of preview
  const screenshotUrl = await captureScreenshot(previewUrl);
  
  // 2. Send based on channel
  if (channel === 'telegram') {
    await sendTelegramPhoto(chatId, screenshotUrl, {
      caption: `🎨 *Here's your preview!*\n\n🔗 Live preview: ${previewUrl}\n\nReply with changes or say "deploy" to go live!`,
      parse_mode: 'Markdown'
    });
  }
  
  if (channel === 'whatsapp') {
    await sendWhatsAppWithImage(chatId, 
      `🎨 Here's your preview!\n\n🔗 ${previewUrl}\n\nReply with changes or say "deploy" to go live!`,
      screenshotUrl
    );
  }
}

// Screenshot service
async function captureScreenshot(url: string): Promise<string> {
  // Option 1: Microlink
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;
  
  // Option 2: Self-hosted Puppeteer/Playwright
  // const screenshot = await puppeteer.screenshot(url);
  // return uploadToStorage(screenshot);
  
  return screenshotUrl;
}
```

---

## User Identity Across Channels

```typescript
// User can link multiple channels

model User {
  id            String    @id
  email         String?   @unique
  
  // Channel identities (nullable, user may have one or more)
  telegramId    String?   @unique
  whatsappNumber String?  @unique
  
  // Projects are tied to user, not channel
  projects      Project[]
}

// When user chats on Telegram, we find/create by telegramId
// When same user later uses web with email, we can link accounts
// "Want to link your Telegram? Send /link to @OurBot"
```

---

## Channel-Specific Limitations

| Feature | Web | Telegram | WhatsApp |
|---------|-----|----------|----------|
| Real-time typing indicator | ✅ | ✅ | ❌ |
| Inline buttons | ✅ | ✅ | ❌ (use list messages) |
| Rich text formatting | ✅ Full HTML | ✅ Markdown | ⚠️ Basic |
| File upload | ✅ Any type | ✅ Any type | ✅ Images/docs |
| Embedded payment | ✅ Stripe Elements | ❌ Link only | ❌ Link only |
| Iframe preview | ✅ | ❌ Screenshot | ❌ Screenshot |
| Session persistence | ✅ Cookies | ✅ Chat ID | ✅ Phone number |

---

## Conversation Context Handling

```typescript
// Each channel maintains its own conversation thread

interface Conversation {
  id: string;
  userId: string;
  projectId?: string;
  
  // Channel info
  channel: 'web' | 'telegram' | 'whatsapp';
  channelChatId: string;  // Web session ID, Telegram chat ID, or phone number
  
  // AI context
  messages: Message[];
  state: ConversationState;
}

// Find or create conversation for channel
async function getConversation(channel: string, channelChatId: string) {
  let conv = await db.conversation.findFirst({
    where: { channel, channelChatId }
  });
  
  if (!conv) {
    conv = await db.conversation.create({
      data: { channel, channelChatId, state: 'ONBOARD' }
    });
  }
  
  return conv;
}
```

---

## Implementation Order

### Phase 1: Web Chat (Weeks 1-4)
- Full web experience
- All features working

### Phase 3a: Telegram Bot (Week 7)
```
Day 1: Bot setup, webhook handler
Day 2: Message adapter, text responses
Day 3: File uploads (photos)
Day 4: Inline buttons, payment links
Day 5: Testing, polish
```

### Phase 3b: WhatsApp (Week 8)
```
Day 1: Twilio setup, webhook handler
Day 2: Message adapter
Day 3: Media handling
Day 4: Payment links
Day 5: Message templates (for proactive messages)
```

---

## Environment Variables

```env
# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...  # Optional, for verification

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886  # Sandbox or purchased

# Shared
STRIPE_SECRET_KEY=...  # For payment links
MICROLINK_API_KEY=...  # For screenshots (optional)
```

---

*Ready to build the web version first, then layer on Telegram + WhatsApp!*
