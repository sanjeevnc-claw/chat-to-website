# Chat Website Builder - Project Plan

> **Vision**: A conversational AI that builds, deploys, and maintains websites for non-technical users through natural language chat.

## 🎯 Core Value Proposition

"Describe your business, get a website. No coding. No design skills. Just chat."

Users can:
- Describe what they want in plain English
- Share reference websites for inspiration
- Upload logos, images, content
- Get a live website deployed in minutes
- Purchase and configure custom domains
- Make ongoing updates through chat

---

## 📋 Project Phases

### Phase 1: Web Chat MVP (This Document)
- Chat interface for website building
- AI-powered design and code generation
- GitHub repo creation and deployment
- Vercel deployment with preview URLs
- Basic template system

### Phase 2: Domain & Payments
- Domain availability search
- Domain cost comparison
- Stripe payment integration
- Domain purchase flow
- DNS configuration automation

### Phase 3: Multi-Channel
- Telegram bot interface
- WhatsApp Business API integration
- Unified conversation history

### Phase 4: Maintenance & Growth
- Ongoing site updates via chat
- Analytics integration
- SEO optimization suggestions
- Content management

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Web Chat   │  │  Telegram   │  │  WhatsApp   │  (Phase 3)   │
│  │  (Next.js)  │  │    Bot      │  │    Bot      │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│                     (Next.js API Routes)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   /chat     │  │  /deploy    │  │  /domain    │              │
│  │   /upload   │  │  /preview   │  │  /payment   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CORE SERVICES                               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 AI ORCHESTRATOR                          │    │
│  │  • Conversation Management                               │    │
│  │  • Intent Detection (build/update/deploy/domain)         │    │
│  │  • Context Tracking (project state, user preferences)    │    │
│  │  • Multi-turn Planning                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐     │
│  │   DESIGN    │      │    CODE     │      │   DEPLOY    │     │
│  │   ENGINE    │      │  GENERATOR  │      │   SERVICE   │     │
│  │             │      │             │      │             │     │
│  │ • Layout    │      │ • Next.js   │      │ • GitHub    │     │
│  │ • Colors    │      │ • Tailwind  │      │ • Vercel    │     │
│  │ • Typography│      │ • Components│      │ • Domain    │     │
│  │ • Reference │      │ • Pages     │      │ • DNS       │     │
│  │   Analysis  │      │ • Assets    │      │             │     │
│  └─────────────┘      └─────────────┘      └─────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                         │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │ GitHub  │  │ Vercel  │  │ Stripe  │  │ Domain  │  │ Claude│ │
│  │   API   │  │   API   │  │   API   │  │   APIs  │  │  API  │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └───────┘ │
│                                          │                       │
│                            ┌─────────────┴─────────────┐        │
│                            │ Namecheap / GoDaddy /     │        │
│                            │ Cloudflare / Google       │        │
│                            └───────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Postgres   │  │    Redis    │  │     S3      │              │
│  │  (Supabase) │  │  (Sessions) │  │  (Assets)   │              │
│  │             │  │             │  │             │              │
│  │ • Users     │  │ • Chat Ctx  │  │ • Images    │              │
│  │ • Projects  │  │ • Preview   │  │ • Uploads   │              │
│  │ • Deploys   │  │ • Cache     │  │ • Generated │              │
│  │ • Payments  │  │             │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | **Next.js 14** (App Router) | Full-stack, SSR, API routes |
| Styling | **Tailwind CSS** | Same stack we generate for users |
| Chat UI | **Custom** + shadcn/ui | Clean, accessible components |
| State | **Zustand** | Simple, performant |
| Real-time | **Server-Sent Events** | Stream AI responses |

### Backend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| API | **Next.js API Routes** | Unified deployment |
| AI | **Claude API** (Anthropic) | Best for code generation |
| Queue | **Inngest** or **Trigger.dev** | Background jobs (deploy, domain) |
| Auth | **Clerk** or **NextAuth** | Simple, secure |

### Database & Storage
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Database | **Supabase** (Postgres) | Free tier, real-time, auth |
| Cache | **Upstash Redis** | Session state, rate limiting |
| Storage | **Cloudflare R2** or **S3** | User uploads, generated assets |

### External APIs
| Service | API | Purpose |
|---------|-----|---------|
| AI | Claude API | Conversation + code generation |
| Git | GitHub API | Repo creation, commits, deploys |
| Hosting | Vercel API | Project creation, deployments |
| Domains (Primary) | **Cloudflare Registrar** | Purchase at-cost, DNS, SSL |
| Domains (Backup) | Namecheap API | Exotic TLDs (.io, .ai) not on Cloudflare |
| DNS | Cloudflare | All DNS managed here (even Namecheap domains) |
| Payments (Global) | **Stripe** | Domain purchases, subscriptions |
| Payments (India) | **Dodo Payments** | Indian users (UPI, cards, etc.) |
| Screenshots | Microlink / Browserless | Reference site analysis |

---

## 💬 Conversation Design

### User Intents
```
INTENTS:
├── CREATE_NEW          "I want to build a website for my bakery"
├── PROVIDE_REFERENCE   "Make it look like apple.com but simpler"
├── UPLOAD_CONTENT      [uploads logo/images/text]
├── SPECIFY_STYLE       "Use blue colors and a modern look"
├── ADD_PAGE           "Add an About page"
├── MODIFY_CONTENT     "Change the headline to..."
├── REQUEST_PREVIEW    "Show me what you have"
├── APPROVE_DEPLOY     "Looks good, deploy it"
├── DOMAIN_SEARCH      "What domains are available?"
├── DOMAIN_PURCHASE    "Buy mybakery.com"
├── GENERAL_QUESTION   "How do I add a contact form?"
└── HELP               "What can you do?"
```

### Conversation State Machine
```
                    ┌──────────────┐
                    │   ONBOARD    │
                    │  (new user)  │
                    └──────┬───────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                        GATHERING                              │
│  Collecting: business type, style preferences, content        │
│                                                               │
│  "What kind of website do you need?"                         │
│  "Do you have any reference sites you like?"                 │
│  "What's your business name?"                                │
└──────────────────────┬───────────────────────────────────────┘
                       │ (enough context)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                        DESIGNING                              │
│  AI generates initial design/code                            │
│                                                               │
│  "I'm creating your website now..."                          │
│  "Here's a preview: [link]"                                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                        REFINING                               │
│  User requests changes, AI iterates                          │
│                                                               │
│  "Change the header color to navy blue"                      │
│  "Add a testimonials section"                                │
│  "Make the text bigger"                                      │
└──────────────────────┬───────────────────────────────────────┘
                       │ (user approves)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                       DEPLOYING                               │
│  Push to GitHub → Deploy to Vercel                           │
│                                                               │
│  "Deploying your site now..."                                │
│  "Your site is live at: yoursite.vercel.app"                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ (optional)
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                     DOMAIN_FLOW                               │
│  Search → Select → Payment → Configure                       │
│                                                               │
│  "mybakery.com is available for $12/year"                    │
│  "Enter your card details to purchase"                       │
│  "Domain configured! Live at mybakery.com"                   │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                      MAINTENANCE                              │
│  Ongoing updates, content changes                            │
│                                                               │
│  "Update the opening hours on the contact page"              │
│  "Add this new product to the menu"                          │
└──────────────────────────────────────────────────────────────┘
```

### Sample Conversation Flow

```
USER: I want to build a website for my coffee shop

AI: Great! I'd love to help you build a website for your coffee shop. ☕

Let me ask a few questions to get started:

1. **What's your coffee shop called?**
2. **Do you have any websites you like the style of?** (You can share links)
3. **What should visitors be able to do?** (e.g., see the menu, find your location, order online)

───────────────────────────────────────

USER: It's called "Morning Brew". I like the style of bluebottlecoffee.com. 
      Visitors should see our menu and find our location.

AI: Perfect! "Morning Brew" ☕ with a clean, minimal style like Blue Bottle.

I'm analyzing bluebottlecoffee.com for inspiration...

**What I'll include:**
• Clean, image-focused homepage
• Coffee menu with descriptions
• Location section with map
• Contact information

Do you have:
- A logo? (you can upload it)
- Photos of your shop or coffee?
- Your address?

Or I can create placeholder content and you can update later!

───────────────────────────────────────

USER: [Uploads logo.png]
      Address is 123 Main St, Brooklyn NY
      No photos yet, use placeholders

AI: Got your logo! 🎨 Building your site now...

[Progress indicator: Designing layout... Generating code... Creating preview...]

**Here's your preview:** 
🔗 https://morning-brew-preview.vercel.app

**What I created:**
✅ Homepage with hero section
✅ Menu page with coffee categories
✅ Location page with embedded map
✅ Your logo in the header
✅ Contact info in footer

Take a look and let me know what changes you'd like!

───────────────────────────────────────

USER: Love it! Can you make the header background darker?

AI: Done! I've changed the header to a rich dark brown.

🔗 **Updated preview:** https://morning-brew-preview.vercel.app

Anything else, or ready to make it live?

───────────────────────────────────────

USER: Make it live!

AI: 🚀 Deploying now...

**Your website is live!**
🌐 https://morning-brew.vercel.app

**Want a custom domain?** I can help you:
- Search for available domains
- Compare prices
- Purchase and set it up automatically

Just say something like "find domains for morning brew coffee"

───────────────────────────────────────

USER: Find domains for morning brew

AI: Here are available domains for "Morning Brew":

| Domain | Price/year | Registrar |
|--------|------------|-----------|
| morningbrew.coffee | $32 | Namecheap |
| morningbrewcafe.com | $12 | Namecheap |
| getmorningbrew.com | $12 | Namecheap |
| morning-brew.co | $28 | Namecheap |

💡 **My recommendation:** `morningbrewcafe.com` - memorable, affordable, .com TLD

Would you like to purchase one? I'll handle the setup automatically.

───────────────────────────────────────

USER: Buy morningbrewcafe.com

AI: Great choice! 🎯

**Order Summary:**
- Domain: morningbrewcafe.com
- Price: $12.00/year
- Auto-renewal: Yes

To complete the purchase, I need your payment details.

[Stripe Payment Element appears]

───────────────────────────────────────

USER: [Completes payment]

AI: ✅ **Payment successful!**

Setting up your domain...
• Registering morningbrewcafe.com ✓
• Configuring DNS records ✓
• Connecting to Vercel ✓
• SSL certificate provisioning ✓

🎉 **Your site is now live at:**
🌐 **https://morningbrewcafe.com**

DNS propagation may take up to 24 hours, but it usually works within minutes.

Need anything else? I'm here to help with updates anytime!
```

---

## 📁 Project Structure

```
chat-website-builder/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── chat/
│   │   │   └── page.tsx              # Main chat interface
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts          # Chat endpoint (streaming)
│   │   │   ├── upload/
│   │   │   │   └── route.ts          # File upload handling
│   │   │   ├── preview/
│   │   │   │   └── route.ts          # Generate preview
│   │   │   ├── deploy/
│   │   │   │   └── route.ts          # Deploy to Vercel
│   │   │   ├── domain/
│   │   │   │   ├── search/route.ts   # Domain availability
│   │   │   │   ├── purchase/route.ts # Buy domain
│   │   │   │   └── configure/route.ts# DNS setup
│   │   │   └── webhook/
│   │   │       ├── stripe/route.ts   # Payment webhooks
│   │   │       └── vercel/route.ts   # Deploy webhooks
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx        # Main chat container
│   │   │   ├── MessageBubble.tsx     # Individual message
│   │   │   ├── InputBar.tsx          # Text input + upload
│   │   │   ├── FileUpload.tsx        # Drag & drop uploads
│   │   │   ├── PreviewCard.tsx       # Website preview embed
│   │   │   ├── DomainResults.tsx     # Domain search results
│   │   │   └── PaymentModal.tsx      # Stripe payment form
│   │   └── ui/                       # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── orchestrator.ts       # Main AI coordinator
│   │   │   ├── intents.ts            # Intent classification
│   │   │   ├── prompts.ts            # System prompts
│   │   │   └── context.ts            # Conversation context
│   │   │
│   │   ├── generator/
│   │   │   ├── designer.ts           # Design decisions
│   │   │   ├── codeGen.ts            # Code generation
│   │   │   ├── templates/            # Base templates
│   │   │   │   ├── landing.tsx
│   │   │   │   ├── portfolio.tsx
│   │   │   │   └── business.tsx
│   │   │   └── components/           # Reusable generated components
│   │   │
│   │   ├── deploy/
│   │   │   ├── github.ts             # GitHub API wrapper
│   │   │   ├── vercel.ts             # Vercel API wrapper
│   │   │   └── preview.ts            # Preview generation
│   │   │
│   │   ├── domain/
│   │   │   ├── search.ts             # Domain availability
│   │   │   ├── pricing.ts            # Price comparison
│   │   │   ├── purchase.ts           # Domain registration
│   │   │   └── dns.ts                # DNS configuration
│   │   │
│   │   ├── payments/
│   │   │   └── stripe.ts             # Stripe integration
│   │   │
│   │   └── db/
│   │       ├── schema.ts             # Database schema
│   │       └── queries.ts            # Database queries
│   │
│   └── types/
│       └── index.ts                  # TypeScript types
│
├── public/
│   └── ...
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── .env.example
├── package.json
└── README.md
```

---

## 🗃️ Database Schema

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  createdAt     DateTime  @default(now())
  
  projects      Project[]
  conversations Conversation[]
  payments      Payment[]
}

model Project {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  name          String
  description   String?
  status        ProjectStatus @default(DRAFT)
  
  // Generated site config
  siteConfig    Json?     // { colors, fonts, layout, pages }
  
  // Deployment info
  githubRepo    String?
  vercelProject String?
  vercelUrl     String?
  customDomain  String?
  
  // Assets
  assets        Asset[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  deployments   Deployment[]
}

enum ProjectStatus {
  DRAFT
  PREVIEW
  DEPLOYED
  DOMAIN_PENDING
  LIVE
}

model Conversation {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  projectId     String?
  
  messages      Message[]
  context       Json?     // AI context state
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Message {
  id              String    @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id])
  
  role            MessageRole
  content         String
  metadata        Json?     // { intent, tokens, model, etc. }
  
  createdAt       DateTime  @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

model Asset {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  
  type          AssetType
  filename      String
  url           String
  mimeType      String
  size          Int
  
  createdAt     DateTime  @default(now())
}

enum AssetType {
  LOGO
  IMAGE
  DOCUMENT
  GENERATED
}

model Deployment {
  id            String    @id @default(cuid())
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id])
  
  vercelId      String?
  url           String
  status        DeployStatus
  commitSha     String?
  
  createdAt     DateTime  @default(now())
}

enum DeployStatus {
  QUEUED
  BUILDING
  READY
  ERROR
}

model Payment {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  stripeId      String    @unique
  amount        Int
  currency      String    @default("usd")
  status        PaymentStatus
  type          PaymentType
  metadata      Json?     // { domain, years, etc. }
  
  createdAt     DateTime  @default(now())
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
}

enum PaymentType {
  DOMAIN_PURCHASE
  DOMAIN_RENEWAL
  SUBSCRIPTION
}
```

---

## 🔐 API Keys Required

```env
# .env.example

# AI
ANTHROPIC_API_KEY=sk-ant-...

# GitHub (OAuth App or Personal Access Token)
GITHUB_TOKEN=ghp_...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Vercel
VERCEL_TOKEN=...
VERCEL_TEAM_ID=...  # optional

# Domain Registrar - Primary (Cloudflare)
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...

# Domain Registrar - Backup (Namecheap for .io, .ai, etc)
NAMECHEAP_API_USER=...
NAMECHEAP_API_KEY=...
NAMECHEAP_CLIENT_IP=...  # Required for Namecheap API

# Payments - Global (Stripe)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Payments - India (Dodo Payments)
DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...
DODO_PUBLISHABLE_KEY=...

# Database
DATABASE_URL=postgresql://...

# Storage
S3_BUCKET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Auth
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Phase 1 Implementation Plan

### Week 1: Foundation
- [ ] Project setup (Next.js, Tailwind, shadcn/ui)
- [ ] Database setup (Supabase)
- [ ] Auth setup (Clerk)
- [ ] Basic chat UI component
- [ ] Claude API integration
- [ ] Conversation storage

### Week 2: Website Generation
- [ ] Design prompt engineering
- [ ] Code generation prompts
- [ ] Template system (3 base templates)
- [ ] Component library for generation
- [ ] Preview generation (local)

### Week 3: GitHub & Vercel
- [ ] GitHub API integration
- [ ] Repo creation flow
- [ ] Vercel API integration
- [ ] Automated deployment pipeline
- [ ] Deployment status webhooks

### Week 4: Polish & Testing
- [ ] File upload handling
- [ ] Reference site analysis
- [ ] Error handling
- [ ] Rate limiting
- [ ] User testing
- [ ] Bug fixes

### Week 5-6: Domain Flow (Phase 2 Start)
- [ ] Domain search API integration
- [ ] Price comparison logic
- [ ] Stripe payment integration
- [ ] Domain purchase automation
- [ ] DNS configuration

---

## 💰 Cost Estimates

### Per Website Build
| Service | Estimated Cost |
|---------|---------------|
| Claude API (~10 turns) | ~$0.30-0.50 |
| Vercel Deployment | Free (hobby) |
| GitHub Storage | Free |
| **Total per site** | **~$0.50** |

### Monthly Infrastructure
| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $20/mo |
| Supabase | 500MB DB | $25/mo |
| Cloudflare R2 | 10GB | $0.015/GB |
| Claude API | Pay per use | ~$50-200 |

### Domain Purchase (pass-through)
| TLD | Typical Cost | Our Markup |
|-----|--------------|------------|
| .com | $10-15/yr | $0 (pass-through) |
| .io | $30-40/yr | $0 |
| .co | $25-30/yr | $0 |

---

## 🔒 Security Considerations

1. **API Key Storage**
   - Use environment variables
   - Never expose in client-side code
   - Rotate regularly

2. **User Data**
   - Encrypt sensitive data at rest
   - HTTPS only
   - SOC 2 compliance path

3. **Payment Security**
   - Stripe handles PCI compliance
   - Never store card details
   - Webhook signature verification

4. **Generated Code**
   - Sandbox code generation
   - Validate outputs before deploy
   - No arbitrary code execution

5. **Rate Limiting**
   - Per-user request limits
   - AI API cost controls
   - Deployment frequency limits

---

## 📊 Success Metrics

### MVP Success Criteria
- [ ] User can describe a website and get a working preview
- [ ] Preview can be deployed to Vercel in <5 minutes
- [ ] User can make 3+ iterations through chat
- [ ] 80%+ user satisfaction in testing

### Phase 2 Success Criteria
- [ ] Domain search returns results in <3 seconds
- [ ] Domain purchase completes in <2 minutes
- [ ] DNS propagates in <1 hour
- [ ] Zero payment failures due to our code

---

## 🔍 QA Process (Codex Review)

Every generated site goes through AI-powered QA before deployment:

```
CODE GENERATION → CODEX QA → AUTO-TESTS → VISUAL QA → DEPLOY
```

### Automated Checks

| Category | Checks | Auto-Fix |
|----------|--------|----------|
| **Security** | XSS, injection, exposed secrets | ❌ Block + flag |
| **Accessibility** | Alt text, ARIA, contrast, focus | ✅ Auto-fix |
| **Performance** | Bundle size, images, lazy load | ✅ Auto-fix |
| **SEO** | Meta tags, semantic HTML, headings | ✅ Auto-fix |
| **Best Practices** | React patterns, Next.js conventions | ⚠️ Suggest |

### QA Score

```
Overall: 87/100 ✅

Security:       ████████░░  95%
Accessibility:  ████████░░  88%
Performance:    ███████░░░  82%
Best Practices: ████████░░  85%
SEO:            █████████░  92%
```

### Deploy Gates

- **Blockers** (must pass): Security < 80%, build fails, critical vulnerabilities
- **Warnings** (deploy anyway): A11y < 90%, performance < 70%
- **Info**: Style suggestions, optimizations

*Cost: ~$0.18 per site (GPT-4 Turbo + Vision)*

*See QA_PROCESS.md for full details.*

---

## 🚚 Migration Strategy (Post-MVP)

For users who want to own their infrastructure later. **No lock-in.**

### Option 1: Self-Service Migration (Free)

User provides their tokens → We migrate instantly

```
USER PROVIDES:
├── GitHub Personal Access Token
└── Vercel Token

WE DO (automatically):
├── Fork repo to their GitHub
├── Transfer Vercel project to their account  
├── Update DNS pointers
├── Provide maintenance documentation
└── Delete from our infrastructure

TIMELINE: Instant (< 5 minutes)
COST: Free
```

### Option 2: Assisted Migration (Paid)

We help via Zoom or by joining their team

```
OPTIONS:
├── 2a. Zoom Walkthrough ($149)
│   └── We guide, user does actions
│
├── 2b. Team Member Access ($149)  
│   └── User adds us to GitHub/Vercel
│   └── We do migration for them
│
└── 2c. Full Handoff ($249)
    └── Everything above, plus
    └── Domain ownership transfer
    └── Custom documentation
```

### What Users Keep After Migration

| Asset | Included |
|-------|----------|
| Full source code | ✅ |
| Git history | ✅ |
| All images/assets | ✅ |
| Domain (if purchased) | ✅ |
| Vercel config | ✅ |
| Conversation export | ✅ |

### Implementation Timeline

| Phase | Migration Features |
|-------|-------------------|
| MVP | None (users on our platform) |
| Phase 2 | Self-service migration |
| Phase 3+ | Assisted migration offering |

*See MIGRATION_STRATEGY.md for full technical details.*

---

## ❓ Open Questions

1. **Template vs. Full Generation**
   - Start with templates and customize?
   - Or generate from scratch each time?
   - Recommendation: Hybrid - templates for structure, AI for content

2. **GitHub Account**
   - Use our org's repos?
   - Create user's own GitHub account?
   - Recommendation: Our org, transfer later if needed

3. **Vercel Account**
   - Deploy to our team?
   - Help user create Vercel account?
   - Recommendation: Our team initially, migrate to user's Vercel later

4. **Domain Registrar**
   - Which primary registrar?
   - Recommendation: Namecheap (best API, good prices) or Cloudflare (free DNS)

5. **Pricing Model**
   - Free tier? Pay per site? Subscription?
   - Recommendation: Free to build, pay for custom domains + premium features

---

## 🎯 Next Steps

1. **Review this plan** - confirm scope, priorities, tech choices
2. **Set up project** - create repo, initialize Next.js
3. **Get API keys** - Claude, GitHub, Vercel
4. **Build chat UI** - basic interface
5. **Implement AI orchestrator** - conversation handling
6. **Build first template** - landing page
7. **Connect deployment pipeline** - GitHub → Vercel

---

*Document created: 2026-02-12*
*Last updated: 2026-02-12*
*Author: StitchClaw 🧵*
