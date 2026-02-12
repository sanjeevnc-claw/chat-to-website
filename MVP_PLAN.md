# Chat Website Builder - MVP Plan

## 🎯 MVP Scope (Phase 1)

**Goal**: User chats → Gets a live website with custom domain

**Timeline**: 4 weeks

---

## What MVP Includes

### ✅ In MVP

| Feature | Description |
|---------|-------------|
| **Web chat interface** | Clean chat UI, streaming responses |
| **AI conversation** | Claude-powered, understands context |
| **File uploads** | Logo, images via drag & drop |
| **Reference site analysis** | "Make it like apple.com" |
| **Website generation** | 3 templates (landing, business, portfolio) |
| **Live preview** | Instant preview URL |
| **Iterative edits** | "Change the header color" |
| **GitHub deployment** | Auto-create private repo |
| **Vercel deployment** | Auto-deploy, get .vercel.app URL |
| **Domain search** | Check availability, show prices |
| **Domain purchase** | Stripe checkout, we handle registration |
| **DNS auto-config** | Domain works automatically |
| **User accounts** | Sign up, login, see my projects |

### ❌ NOT in MVP (Later Phases)

- Telegram bot
- WhatsApp bot
- iOS/Android apps
- Custom code editing
- E-commerce / complex features
- Team collaboration
- Analytics dashboard
- SEO tools

---

## Tech Stack (Confirmed)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| Database | Supabase (Postgres) |
| Storage | Cloudflare R2 |
| AI | Claude API (Anthropic) |
| Git | GitHub API (our org) |
| Hosting | Vercel API (our team) |
| Domains (Primary) | Cloudflare Registrar |
| Domains (Backup) | Namecheap (for .io, .ai) |
| DNS | Cloudflare |
| Payments (Global) | Stripe |
| Payments (India) | Dodo Payments |

---

## User Flow (MVP)

```
1. SIGN UP
   User creates account (email or Google)
   
2. START CHAT
   "I want a website for my coffee shop"
   
3. AI GATHERS INFO
   - Business name?
   - Any reference sites?
   - What pages do you need?
   - Upload your logo?
   
4. AI GENERATES WEBSITE
   "Building your site..."
   → Preview URL in 30 seconds
   
5. USER REQUESTS CHANGES
   "Make the header darker"
   "Add a contact form"
   → Updated preview
   
6. USER APPROVES
   "Looks good, deploy it!"
   
7. DEPLOY
   → Creates GitHub repo (private, we own)
   → Deploys to Vercel
   → "Live at: coffee-shop.vercel.app"
   
8. CUSTOM DOMAIN (Optional)
   "I want my own domain"
   → Shows available domains + prices
   → User picks one
   → Stripe payment
   → Domain registered + configured
   → "Live at: mycoffeeshop.com"
   
9. ONGOING
   User can return anytime to make updates
   "Change our hours on the contact page"
```

---

## Infrastructure We Own

```
GitHub Org:        stitchflow-sites (private repos)
Vercel Team:       stitchflow-hosted
Cloudflare:        Domain registration + DNS
Namecheap:         Backup for exotic TLDs
Stripe:            Our account, user pays us
```

**User owns nothing** - they just chat and get a website.

---

## 4-Week Timeline

### Week 1: Foundation
```
□ Project setup (Next.js, Tailwind, shadcn)
□ Database setup (Supabase)
□ Auth setup (Clerk)
□ Basic chat UI (messages, input, streaming)
□ Claude API integration
□ Conversation storage
```

### Week 2: Website Generation
```
□ Design prompt engineering
□ Code generation prompts
□ 3 base templates (landing, business, portfolio)
□ File upload (R2 storage)
□ Reference site analysis (screenshots)
□ Preview generation
```

### Week 3: Deployment Pipeline
```
□ GitHub API - create repos, push code
□ Vercel API - create projects, deploy
□ Webhook handling (deploy status)
□ Preview → Production flow
□ Edit and redeploy flow
```

### Week 4: Domains + Polish
```
□ Cloudflare Registrar API - search, buy
□ Namecheap API - fallback for exotic TLDs
□ Stripe checkout integration
□ DNS auto-configuration
□ Error handling, rate limiting
□ Testing, bug fixes
```

---

## API Keys Needed to Start

```env
# AI
ANTHROPIC_API_KEY=

# Auth
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Database
DATABASE_URL= (Supabase)

# Storage
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_BUCKET=

# GitHub (create org token)
GITHUB_TOKEN=

# Vercel (create team token)
VERCEL_TOKEN=
VERCEL_TEAM_ID=

# Domains
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
NAMECHEAP_API_USER=
NAMECHEAP_API_KEY=

# Payments - Global (Stripe)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Payments - India (Dodo Payments)
DODO_API_KEY=
DODO_PUBLISHABLE_KEY=
DODO_WEBHOOK_SECRET=
```

---

## Cost Estimate (MVP)

### Development Costs
| Item | Cost |
|------|------|
| Vercel (hosting) | Free tier |
| Supabase (database) | Free tier |
| Cloudflare R2 (storage) | Free tier (10GB) |
| Clerk (auth) | Free tier (5k MAU) |
| Claude API (development) | ~$50 |
| Domain for app | ~$12 |
| **Total MVP dev cost** | **~$62** |

### Per-User Costs (Ongoing)
| Item | Cost per site |
|------|---------------|
| Claude API (~10 turns) | ~$0.30-0.50 |
| Vercel hosting | Free (hobby) |
| GitHub storage | Free |
| **Total per site** | **~$0.50** |

### Domain Purchases
- We charge user exact cost (pass-through)
- Cloudflare .com = ~$9/year
- User pays via Stripe, we buy domain

---

## Security (Confirmed)

| Concern | Solution |
|---------|----------|
| API keys | Server-side only, env vars |
| User data isolation | Supabase RLS policies |
| Payment card data | Stripe handles (PCI compliant) |
| Domain ownership | We own, user licenses (in ToS) |
| Generated code | Validated, sandboxed builds |
| Rate limiting | Per-user limits on all endpoints |

---

## Success Criteria

MVP is successful if:

- [ ] User can describe a website and get a working preview
- [ ] Preview deploys in < 2 minutes
- [ ] User can make 3+ edits via chat
- [ ] Site deploys to custom .vercel.app URL
- [ ] Domain purchase works end-to-end
- [ ] Domain is live within 1 hour of purchase
- [ ] 80%+ satisfaction in initial testing

---

## What I Need From You

1. **Approval** to start building
2. **GitHub org** - create `stitchflow-sites` org (or name preference)
3. **Vercel team** - create team for hosting user sites
4. **Cloudflare account** - for domains + DNS + R2 storage
5. **Namecheap account** - backup registrar (optional, can add later)
6. **Stripe account** - for payments
7. **API keys** - provide when ready, or I'll note where they're needed

---

## Deliverable

**End of Week 4**: 

Working web app at `builder.stitchflow.com` (or your preferred domain) where:

1. Anyone can sign up
2. Chat to describe their website
3. Upload logo/images
4. Get instant preview
5. Request changes via chat
6. Deploy to production
7. Buy custom domain
8. Site goes live

---

## Ready?

**Approve to start building Phase 1 (Web MVP)** ✅

After MVP:
- Phase 2: Polish + more templates
- Phase 3: Telegram + WhatsApp bots
- Phase 4: iOS + Android apps

---

*4 weeks to a working product. Let's build.* 🚀
