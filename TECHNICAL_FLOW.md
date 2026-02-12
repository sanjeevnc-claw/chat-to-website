# Chat Website Builder - End-to-End Technical Flow

> **Key Principle**: User never touches GitHub, Vercel, or DNS. They just chat. We own and manage all infrastructure.

---

## 🏗️ Infrastructure We Own

```
┌─────────────────────────────────────────────────────────────────┐
│                    STITCHFLOW INFRASTRUCTURE                     │
│                                                                  │
│  GitHub Organization: stitchflow-sites                          │
│  ├── user-abc123-morning-brew/                                  │
│  ├── user-def456-janes-bakery/                                  │
│  └── user-xyz789-acme-consulting/                               │
│                                                                  │
│  Vercel Team: stitchflow-hosted                                 │
│  ├── morning-brew.vercel.app                                    │
│  ├── janes-bakery.vercel.app                                    │
│  └── acme-consulting.vercel.app                                 │
│                                                                  │
│  Domain Registrar (Primary): Cloudflare Registrar               │
│  └── At-cost pricing, integrated DNS, most TLDs                 │
│                                                                  │
│  Domain Registrar (Backup): Namecheap                           │
│  └── Fallback for TLDs Cloudflare doesn't support (.io, .ai)    │
│                                                                  │
│  DNS Management: Cloudflare                                      │
│  └── All domains managed in Cloudflare (even Namecheap ones)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 End-to-End Flow

### Step 1: User Signs Up & Starts Chat

```
USER ACTION:
  └── Signs up with email/Google (Clerk auth)
  └── Starts new chat: "I want a website for my bakery"

SYSTEM FLOW:
  1. Create User record in our database
     └── user_id: "usr_abc123"
     └── email: "jane@email.com"
     
  2. Create Project record
     └── project_id: "prj_xyz789"
     └── user_id: "usr_abc123"
     └── status: GATHERING
     
  3. Create Conversation record
     └── Linked to project
     └── Store all messages for context
```

### Step 2: AI Gathers Requirements

```
CONVERSATION:
  AI: "What's your bakery called?"
  User: "Jane's Sweet Treats"
  
  AI: "Do you have any websites you like the style of?"
  User: "I like magnolia bakery's website"
  
  AI: "What pages do you need?"
  User: "Home, menu, about us, contact"
  
  AI: "Do you have a logo?"
  User: [uploads logo.png]

SYSTEM FLOW:
  1. Each message → stored in Message table
  
  2. File upload:
     └── Upload to Cloudflare R2: /assets/prj_xyz789/logo.png
     └── Create Asset record with URL
     
  3. Reference site analysis:
     └── Screenshot magnolia bakery via Microlink API
     └── Claude analyzes: colors, layout, typography
     └── Store design preferences in project.siteConfig
     
  4. Update project.siteConfig:
     {
       "businessName": "Jane's Sweet Treats",
       "businessType": "bakery",
       "pages": ["home", "menu", "about", "contact"],
       "style": {
         "colors": { "primary": "#8B4513", "secondary": "#FFF8DC" },
         "fonts": { "heading": "Playfair Display", "body": "Open Sans" },
         "layout": "classic",
         "inspiration": "magnolia bakery - warm, inviting, elegant"
       },
       "assets": {
         "logo": "https://r2.stitchflow.com/assets/prj_xyz789/logo.png"
       }
     }
```

### Step 3: Generate Website Code

```
AI MESSAGE: "I'm building your website now..."

SYSTEM FLOW:
  1. Code Generation (Claude API):
     └── System prompt includes:
         - Our Next.js template structure
         - Tailwind CSS conventions
         - Component library available
         - User's siteConfig
         
     └── Generate files:
         /app/page.tsx           (Homepage)
         /app/menu/page.tsx      (Menu)
         /app/about/page.tsx     (About)
         /app/contact/page.tsx   (Contact)
         /components/Header.tsx
         /components/Footer.tsx
         /styles/globals.css
         /public/logo.png        (from uploads)
         
  2. Store generated code:
     └── Save to temporary storage (Redis or S3)
     └── Key: preview:prj_xyz789
     └── TTL: 24 hours
```

### Step 4: Create Preview (Before GitHub)

```
AI MESSAGE: "Here's your preview!"

SYSTEM FLOW:
  1. Deploy to Vercel Preview (no Git):
     └── Use Vercel API: POST /v13/deployments
     └── Upload files directly (no GitHub needed for preview)
     └── Get preview URL: prj-xyz789-preview.vercel.app
     
  2. Alternatively: Use our preview server
     └── Spin up temporary Next.js instance
     └── URL: preview.stitchflow.com/prj_xyz789
     └── Auto-expires after 24 hours
     
  3. Update project:
     └── previewUrl: "https://prj-xyz789-preview.vercel.app"
     └── status: PREVIEW
```

### Step 5: User Requests Changes

```
USER: "Make the header background navy blue"

SYSTEM FLOW:
  1. AI understands intent: MODIFY_STYLE
  
  2. Generate code diff:
     └── Only regenerate affected files (Header.tsx, globals.css)
     └── Apply changes to stored code
     
  3. Redeploy preview:
     └── New Vercel preview deployment
     └── Same preview URL pattern
     
  4. AI shows: "Updated! Take a look: [preview link]"
```

### Step 6: User Approves → Deploy to Production

```
USER: "Looks great, make it live!"

SYSTEM FLOW:
  1. Create GitHub Repository:
     └── GitHub API: POST /orgs/stitchflow-sites/repos
     └── Repo name: "user-abc123-janes-bakery"
     └── Private repo (we own it)
     
  2. Push generated code:
     └── GitHub API: Create tree, create commit, update ref
     └── All files from our stored code
     
  3. Connect to Vercel:
     └── Vercel API: POST /v10/projects
     └── Project name: "janes-bakery"
     └── Connect to GitHub repo
     └── Team: stitchflow-hosted
     
  4. Trigger deployment:
     └── Vercel auto-deploys from GitHub
     └── Webhook notifies us when ready
     
  5. Update project:
     └── githubRepo: "stitchflow-sites/user-abc123-janes-bakery"
     └── vercelProject: "janes-bakery"
     └── vercelUrl: "janes-bakery.vercel.app"
     └── status: DEPLOYED
     
  6. AI shows: "🎉 Your site is live at janes-bakery.vercel.app!"
```

### Step 7: Custom Domain Flow

```
USER: "I want my own domain"

SYSTEM FLOW:
  1. AI asks: "What domain name are you thinking?"
  
  2. User: "janessweettreats.com"
  
  3. Domain Search:
     └── Namecheap API: GET /domains/check
     └── Check multiple TLDs: .com, .co, .shop, .bakery
     └── Get pricing for each
     
  4. AI shows:
     "Here's what's available:
      ✅ janessweettreats.com - $12/year
      ✅ janessweettreats.co - $28/year  
      ❌ janes.com - taken
      ✅ janestreats.shop - $15/year"
```

### Step 8: Domain Purchase

```
USER: "Buy janessweettreats.com"

SYSTEM FLOW:
  1. Create Stripe Checkout Session:
     └── Amount: $10.00 (at-cost, user sees clean price)
     └── Product: "Domain: janessweettreats.com (1 year)"
     └── Metadata: { projectId, domain, years: 1 }
     └── (Registrar choice is internal, user never knows)
     
  2. Show payment UI:
     └── Stripe Elements embedded in chat
     └── User enters card details
     └── Stripe handles PCI compliance
     
  3. Payment succeeds → Stripe webhook fires
  
  4. Purchase domain (CLOUDFLARE FIRST):
     ┌─────────────────────────────────────────────────────────┐
     │ TRY CLOUDFLARE:                                         │
     │ POST /accounts/{id}/registrar/domains                   │
     │ {                                                       │
     │   "name": "janessweettreats.com",                       │
     │   "auto_renew": true                                    │
     │ }                                                       │
     │                                                         │
     │ SUCCESS → Domain registered + DNS auto-configured!      │
     │ FAIL (TLD not supported) → Fall back to Namecheap      │
     └─────────────────────────────────────────────────────────┘
     
     ┌─────────────────────────────────────────────────────────┐
     │ FALLBACK TO NAMECHEAP (if .io, .ai, etc):              │
     │ POST namecheap.domains.create                           │
     │ • Register domain via Namecheap                         │
     │ • Point nameservers to Cloudflare                       │
     │ • Add zone to Cloudflare                                │
     │ • Configure DNS records there                           │
     └─────────────────────────────────────────────────────────┘
     
  5. DNS Configuration (in Cloudflare):
     └── DNS records auto-created:
         A     @    76.76.21.21 (Vercel)
         CNAME www  cname.vercel-dns.com
     └── Proxy enabled (CDN + DDoS protection)
     └── SSL mode: Full (strict)
         
  6. Add domain to Vercel:
     └── Vercel API: POST /v10/projects/{id}/domains
     └── Domain: janessweettreats.com
     └── Vercel provisions SSL automatically
     
  7. Update project (internal):
     └── customDomain: "janessweettreats.com"
     └── registrar: "cloudflare" (internal tracking only)
     └── status: LIVE
     
  8. AI shows (user-facing, no technical details):
     "🎉 Your site is now live at janessweettreats.com!
      
      Everything is set up - your domain is connected 
      and SSL is active. You're all set!"
```

### Domain Pricing Display

```
USER: "Find domains for janes bakery"

SYSTEM FLOW:
  1. Generate domain suggestions
  2. Check BOTH registrars in parallel:
  
     Cloudflare Check:
     └── janesbakery.com → $9.15/yr ✓
     └── janesbakery.co → $9.93/yr ✓
     └── janesbakery.io → NOT SUPPORTED
     
     Namecheap Check (for unsupported TLDs):
     └── janesbakery.io → $32.98/yr ✓
     └── janesbakery.ai → $69.00/yr ✓
     
  3. Merge results, show ONLY domain + price (registrar hidden):
  
     AI SHOWS TO USER:
     ┌─────────────────────────────────────┐
     │ 🌐 Available Domains                │
     ├─────────────────────────────────────┤
     │ janesbakery.com      $9/year   ⭐   │
     │ janesbakery.co       $10/year       │
     │ janesbakery.shop     $11/year       │
     │ janesbakery.io       $33/year       │
     │ janesbakery.ai       $69/year       │
     └─────────────────────────────────────┘
     
     💡 Recommended: janesbakery.com
        Most trusted TLD, best price!
     
     INTERNALLY WE TRACK (user never sees):
     {
       "janesbakery.com": { registrar: "cloudflare", cost: 9.15 },
       "janesbakery.io": { registrar: "namecheap", cost: 32.98 }
     }
```

---

## 🔐 Security Architecture

### 1. API Key Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECRET MANAGEMENT                           │
│                                                                  │
│  Production Environment (Vercel):                               │
│  ├── GITHUB_TOKEN          (org-level, repo:write)             │
│  ├── VERCEL_TOKEN          (team-level, full access)           │
│  ├── NAMECHEAP_API_KEY     (our account)                       │
│  ├── CLOUDFLARE_API_TOKEN  (our account)                       │
│  ├── STRIPE_SECRET_KEY     (our account)                       │
│  └── ANTHROPIC_API_KEY     (our account)                       │
│                                                                  │
│  NEVER EXPOSED TO:                                              │
│  ├── Client-side JavaScript                                     │
│  ├── User-visible logs                                          │
│  ├── Error messages                                             │
│  └── Chat responses                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. User Data Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ISOLATION                              │
│                                                                  │
│  Database (Row-Level Security):                                 │
│  ├── Every query filtered by user_id                           │
│  ├── Users can ONLY see their own projects                     │
│  └── Supabase RLS policies enforce this                        │
│                                                                  │
│  File Storage:                                                  │
│  ├── Path structure: /assets/{user_id}/{project_id}/           │
│  ├── Signed URLs for access (expire in 1 hour)                 │
│  └── No public buckets                                          │
│                                                                  │
│  GitHub Repos:                                                  │
│  ├── All repos are PRIVATE                                      │
│  ├── Naming: user-{id}-{project-slug}                          │
│  ├── Users cannot access GitHub directly                       │
│  └── We manage all code changes                                 │
│                                                                  │
│  Vercel Projects:                                               │
│  ├── Under our team account                                     │
│  ├── Users see only their URLs                                  │
│  └── No Vercel dashboard access for users                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Payment Security (Stripe + Dodo Payments)

```
┌─────────────────────────────────────────────────────────────────┐
│                 PAYMENT PROVIDER ROUTING                         │
│                                                                  │
│  User location detected (IP geolocation or phone/address):      │
│                                                                  │
│  ┌─────────────────────┐      ┌─────────────────────────────┐   │
│  │   USER IN INDIA     │      │    USER EVERYWHERE ELSE     │   │
│  │                     │      │                             │   │
│  │   → Dodo Payments   │      │   → Stripe                  │   │
│  │   • UPI             │      │   • Cards                   │   │
│  │   • Indian Cards    │      │   • Apple Pay               │   │
│  │   • Net Banking     │      │   • Google Pay              │   │
│  │   • Wallets         │      │   • Local methods           │   │
│  └─────────────────────┘      └─────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PAYMENT FLOW                                 │
│                                                                  │
│  1. User clicks "Buy domain"                                    │
│     └── Detect user region (IP / phone number)                  │
│     └── India? → Dodo Payments                                  │
│     └── Else? → Stripe                                          │
│                                                                  │
│  2. Backend creates checkout session:                           │
│     └── POST /api/checkout                                      │
│     └── Route to appropriate provider                           │
│     └── Returns session/payment link                            │
│                                                                  │
│  3. Frontend shows payment UI:                                  │
│     └── Stripe: Checkout or Elements                            │
│     └── Dodo: Embedded checkout or redirect                     │
│     └── WE NEVER SEE CARD/UPI DETAILS                          │
│                                                                  │
│  4. Payment completes:                                          │
│     └── Webhook from Stripe: /api/webhook/stripe               │
│     └── Webhook from Dodo: /api/webhook/dodo                   │
│     └── Verify signatures, then purchase domain                 │
│                                                                  │
│  5. Unified order handling:                                     │
│     └── Store payment in DB with provider field                │
│     └── Same domain purchase flow regardless of provider        │
│                                                                  │
│  PCI COMPLIANCE:                                                │
│  ├── We are SAQ-A (simplest level)                             │
│  ├── No card/UPI data touches our servers                      │
│  ├── Stripe handles global card processing                      │
│  └── Dodo handles Indian payment processing                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Payment Provider Code Example

```typescript
// lib/payments/router.ts

type PaymentProvider = 'stripe' | 'dodo';

function getPaymentProvider(userCountry: string): PaymentProvider {
  return userCountry === 'IN' ? 'dodo' : 'stripe';
}

async function createCheckout(params: {
  userId: string;
  amount: number;      // in smallest unit (cents/paise)
  currency: string;    // 'usd' or 'inr'
  domain: string;
  country: string;
}) {
  const provider = getPaymentProvider(params.country);
  
  if (provider === 'dodo') {
    // Dodo Payments (India)
    const session = await dodo.checkout.create({
      amount: params.amount,
      currency: 'INR',
      description: `Domain: ${params.domain} (1 year)`,
      metadata: { userId: params.userId, domain: params.domain },
      success_url: `${APP_URL}/payment/success`,
      cancel_url: `${APP_URL}/payment/cancel`,
    });
    return { provider: 'dodo', checkoutUrl: session.url };
    
  } else {
    // Stripe (Global)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: `Domain: ${params.domain}` },
          unit_amount: params.amount,
        },
        quantity: 1,
      }],
      metadata: { userId: params.userId, domain: params.domain },
      success_url: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/payment/cancel`,
    });
    return { provider: 'stripe', checkoutUrl: session.url };
  }
}

// Webhook handlers
// POST /api/webhook/stripe → handleStripeWebhook()
// POST /api/webhook/dodo → handleDodoWebhook()
// Both call → completeDomainPurchase(userId, domain)
```
```

### 4. Domain Ownership

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOMAIN OWNERSHIP MODEL                        │
│                                                                  │
│  Legal Owner: Stitchflow Inc                                    │
│  ├── All domains registered under our Namecheap account        │
│  ├── Required for: unified DNS, SSL, management                │
│  └── User has LICENSE to use, not ownership                    │
│                                                                  │
│  Terms of Service must state:                                   │
│  ├── Domain registered on user's behalf                        │
│  ├── User pays for domain, we manage it                        │
│  ├── Transfer available upon request (manual process)          │
│  └── Domain expires if subscription lapses                      │
│                                                                  │
│  ALTERNATIVE MODEL (more complex):                              │
│  ├── User creates own Namecheap/Cloudflare account            │
│  ├── OAuth flow to connect their account                       │
│  ├── They own domain directly                                   │
│  └── We just configure DNS via their token                      │
│  │                                                              │
│  └── Recommendation: Start with "we own" model, simpler        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Generated Code Security

```
┌─────────────────────────────────────────────────────────────────┐
│                  CODE GENERATION SAFETY                          │
│                                                                  │
│  Claude generates code, but we VALIDATE:                        │
│                                                                  │
│  1. Template Constraints:                                       │
│     └── Only generate within our template structure             │
│     └── No arbitrary file paths (../../../etc/passwd)          │
│     └── Whitelist of allowed file extensions                   │
│                                                                  │
│  2. Content Sanitization:                                       │
│     └── No <script> tags in user content                       │
│     └── No external script sources                              │
│     └── Escape all user-provided text                          │
│                                                                  │
│  3. Dependency Lockdown:                                        │
│     └── package.json is fixed (not AI-generated)               │
│     └── No npm install of arbitrary packages                   │
│     └── Use our vetted component library only                  │
│                                                                  │
│  4. Build Isolation:                                            │
│     └── Vercel builds in sandboxed containers                  │
│     └── No access to our production secrets                    │
│     └── Build failures don't expose internal data               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Rate Limiting & Abuse Prevention

```
┌─────────────────────────────────────────────────────────────────┐
│                    RATE LIMITING                                 │
│                                                                  │
│  Per User:                                                      │
│  ├── 100 chat messages per hour                                │
│  ├── 10 deployments per day                                    │
│  ├── 5 projects max (free tier)                                │
│  └── 3 domain searches per minute                              │
│                                                                  │
│  Per IP (unauthenticated):                                      │
│  ├── 10 requests per minute                                    │
│  └── Block after 5 failed auth attempts                        │
│                                                                  │
│  AI Cost Controls:                                              │
│  ├── Max tokens per request: 4000                              │
│  ├── Max requests per conversation: 50                         │
│  └── Alert if user exceeds $5 AI cost                          │
│                                                                  │
│  Abuse Detection:                                               │
│  ├── Flag accounts creating many sites rapidly                 │
│  ├── Block known spam domains                                   │
│  └── Manual review queue for suspicious activity                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────┐      ┌─────────────┐      ┌─────────────────────────────┐
│   USER   │      │  FRONTEND   │      │          BACKEND            │
│ (Browser)│      │  (Next.js)  │      │      (API Routes)           │
└────┬─────┘      └──────┬──────┘      └─────────────┬───────────────┘
     │                   │                           │
     │  1. "Build me a   │                           │
     │     website"      │                           │
     │──────────────────>│                           │
     │                   │  2. POST /api/chat        │
     │                   │      { message, convId }  │
     │                   │──────────────────────────>│
     │                   │                           │
     │                   │                           │  3. Claude API
     │                   │                           │     (generate response)
     │                   │                           │────────────────────>
     │                   │                           │<───────────────────
     │                   │                           │
     │                   │  4. Stream response       │
     │                   │<──────────────────────────│
     │  5. Show typing   │                           │
     │<──────────────────│                           │
     │                   │                           │
     │  6. User uploads  │                           │
     │     logo.png      │                           │
     │──────────────────>│                           │
     │                   │  7. POST /api/upload      │
     │                   │──────────────────────────>│
     │                   │                           │  8. Upload to R2
     │                   │                           │────────────────>
     │                   │  9. Return asset URL      │
     │                   │<──────────────────────────│
     │                   │                           │
     │  10. "Deploy it"  │                           │
     │──────────────────>│                           │
     │                   │  11. POST /api/deploy     │
     │                   │──────────────────────────>│
     │                   │                           │
     │                   │                           │  12. Create GitHub repo
     │                   │                           │──────────────────────>
     │                   │                           │                GitHub
     │                   │                           │  13. Push code
     │                   │                           │──────────────────────>
     │                   │                           │
     │                   │                           │  14. Create Vercel project
     │                   │                           │──────────────────────>
     │                   │                           │                Vercel
     │                   │                           │  15. Trigger deploy
     │                   │                           │──────────────────────>
     │                   │                           │
     │                   │  16. { status: deploying }│
     │                   │<──────────────────────────│
     │  17. Show progress│                           │
     │<──────────────────│                           │
     │                   │                           │
     │                   │      [Vercel Webhook]     │
     │                   │                           │<─────── 18. Deploy ready
     │                   │  19. WebSocket: deployed  │
     │                   │<──────────────────────────│
     │  20. "Site live   │                           │
     │      at xyz.      │                           │
     │      vercel.app"  │                           │
     │<──────────────────│                           │
     │                   │                           │
```

---

## 🎯 Key Technical Decisions

### 1. Why We Own GitHub/Vercel Accounts

| Approach | Pros | Cons |
|----------|------|------|
| **We own accounts** | Simple for users, unified management, consistent setup | We're responsible, storage costs |
| User owns accounts | User has full control, easy transfer | Complex OAuth, support burden, user confusion |

**Decision**: We own accounts. Users don't need to understand Git or deployments.

### 2. Domain Purchase Strategy: Cloudflare First, Namecheap Backup

```
┌─────────────────────────────────────────────────────────────────┐
│                 DOMAIN PURCHASE FLOW                             │
│                                                                  │
│  User wants: "example.com"                                       │
│                                                                  │
│  Step 1: Check Cloudflare Registrar                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ GET /accounts/{id}/registrar/domains/check?name=example │    │
│  │                                                         │    │
│  │ Response: { available: true, price: 9.15 }             │    │
│  │        OR { available: false }                          │    │
│  │        OR { supported: false } ← TLD not on Cloudflare  │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                              │                       │
│           ▼ (available)                  ▼ (not supported)       │
│  ┌─────────────────────┐      ┌─────────────────────────────┐   │
│  │ BUY VIA CLOUDFLARE  │      │ FALLBACK TO NAMECHEAP       │   │
│  │ • At-cost pricing   │      │ • Supports .io, .ai, .dev   │   │
│  │ • DNS auto-config   │      │ • Higher prices             │   │
│  │ • SSL automatic     │      │ • Transfer DNS to Cloudflare│   │
│  └─────────────────────┘      └─────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

INTERNAL ROUTING (user never sees this):
├── Primary registrar handles: .com, .net, .org, .co, .app, .dev, etc.
└── Backup registrar handles: .io, .ai, .gg, and exotic TLDs

User just sees: "janesbakery.io - $33/year" 
Not: "janesbakery.io - $33/year via Namecheap"
```

**Decision**: Cloudflare primary (cheapest, integrated), Namecheap backup (more TLDs).

### 3. Why Cloudflare for DNS (not Vercel)

| Approach | Pros | Cons |
|----------|------|------|
| **Cloudflare DNS** | Free, fast, proxy/CDN, DDoS protection | Extra integration |
| Vercel DNS | Simpler setup | Limited features, no proxy |

**Decision**: Cloudflare. Free, adds security layer, better performance.

### 3. Preview Strategy

| Approach | Pros | Cons |
|----------|------|------|
| **Vercel Preview Deployments** | Real environment, same as prod | Uses deployment quota |
| Self-hosted preview server | Full control, cheaper | Maintenance, scaling |

**Decision**: Vercel previews for simplicity. Monitor usage.

### 4. Domain Ownership Model

| Approach | Pros | Cons |
|----------|------|------|
| **We own domains** | Simpler, unified management | Legal complexity, transfers |
| User owns domains | Clear ownership | OAuth flows, support |

**Decision**: We own, with clear ToS about licensing. Offer transfers on request.

---

## 📅 Implementation Priority

### Week 1-2: Core Chat + Generation
```
Priority 1 (Must Have):
├── Auth (Clerk)
├── Chat UI (streaming responses)
├── Claude integration
├── Basic code generation (1 template)
└── Preview deployment (Vercel API direct upload)
```

### Week 3: GitHub + Production Deploys
```
Priority 2 (Must Have):
├── GitHub repo creation
├── Code push via API
├── Vercel project creation
├── Vercel ↔ GitHub connection
└── Deploy webhooks
```

### Week 4: Polish + Testing
```
Priority 3 (Should Have):
├── File uploads (R2)
├── Multiple templates
├── Edit/update flow
├── Error handling
└── Rate limiting
```

### Week 5-6: Domains + Payments
```
Priority 4 (Phase 2):
├── Namecheap API integration
├── Domain search
├── Stripe payments
├── Domain purchase automation
└── Cloudflare DNS setup
```

---

## ✅ Security Checklist

Before launch:

- [ ] All API keys in environment variables only
- [ ] Row-level security enabled in Supabase
- [ ] Stripe webhook signature verification
- [ ] Rate limiting on all endpoints
- [ ] Input sanitization on user content
- [ ] No secrets in client-side code
- [ ] Error messages don't leak internal info
- [ ] GitHub repos are private
- [ ] File uploads validated (type, size)
- [ ] Generated code validated before deploy
- [ ] Terms of Service covers domain ownership
- [ ] Privacy policy for data handling
- [ ] HTTPS everywhere
- [ ] Auth tokens expire appropriately

---

*Document created: 2026-02-12*
*Author: StitchClaw 🧵*
