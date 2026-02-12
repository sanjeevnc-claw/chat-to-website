# Chat to Website 🚀

> Build websites by chatting. Describe your business, get a professional website.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

## ✨ Features

- **AI-Powered Design** - Describe what you want, get a beautiful website
- **Live Preview** - See changes in real-time as you chat
- **File Uploads** - Upload your logo and images
- **Reference Sites** - Share sites you like for inspiration
- **One-Click Deploy** - Deploy to Vercel with custom domain
- **Mobile Optimized** - Works great on phones and tablets

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| AI | Claude API |
| Auth | Clerk |
| Database | Supabase |
| Storage | Cloudflare R2 |
| Deploy | Vercel |
| Domains | Cloudflare + Namecheap |
| Payments | Stripe (Global) + Dodo (India) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/yenceesanjeev/chat-to-website.git
cd chat-to-website/web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```bash
# AI
ANTHROPIC_API_KEY=

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Payments
STRIPE_SECRET_KEY=
DODO_API_KEY=
```

See `web/.env.example` for full list.

## 📁 Project Structure

```
chat-to-website/
├── web/                      # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── page.tsx     # Landing + chat entry
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── globals.css  # Global styles
│   │   └── components/
│   │       └── chat/        # Chat UI components
│   │           ├── ChatWindow.tsx
│   │           ├── ChatInput.tsx
│   │           ├── MessageBubble.tsx
│   │           └── PreviewCard.tsx
│   ├── package.json
│   └── .env.example
├── PLAN.md                   # Full architecture
├── MVP_PLAN.md              # 4-week roadmap
├── QA_PROCESS.md            # Codex review pipeline
├── TECHNICAL_FLOW.md        # End-to-end flow
└── MIGRATION_STRATEGY.md    # User exit options
```

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-4)
- [x] Chat UI with streaming
- [x] File uploads
- [x] Mobile optimization
- [ ] Claude AI integration
- [ ] Template system (3 templates)
- [ ] GitHub + Vercel deployment
- [ ] Domain purchase flow

### Phase 2: Polish (Weeks 5-6)
- [ ] More templates
- [ ] Reference site analysis
- [ ] Iterative editing

### Phase 3: Messaging (Weeks 7-8)
- [ ] Telegram bot
- [ ] WhatsApp integration

### Phase 4: Mobile (Weeks 9-12)
- [ ] iOS app (React Native)
- [ ] Android app

## 🔒 Security

- All payments through Stripe/Dodo (PCI compliant)
- No card data touches our servers
- Clerk handles authentication
- Environment variables for all secrets

## 📄 License

MIT

## 🤝 Contributing

PRs welcome! Please read the contributing guidelines first.

---

Built with ❤️ by [Stitchflow](https://stitchflow.com)
