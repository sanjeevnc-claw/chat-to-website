# Migration Strategy (Post-MVP)

> For users who want to take control of their own infrastructure later.

---

## Why Migration?

Some users may eventually want to:
- Own their GitHub repo directly
- Use their own Vercel account
- Have full control over their code
- Leave our platform but keep their site

**We support this.** No lock-in.

---

## Migration Options

### Option 1: Self-Service Migration (Free)

**User provides their tokens → We migrate automatically**

```
USER PROVIDES:
├── GitHub Personal Access Token (repo scope)
├── Vercel Token
└── (Optional) Domain registrar access

WE DO:
├── Fork repo to their GitHub account
├── Transfer Vercel project to their account
├── Update DNS to point to their Vercel
├── Provide documentation for ongoing maintenance
└── Delete from our infrastructure

TIMELINE: Instant (< 5 minutes)
COST: Free
```

#### Technical Flow

```typescript
// /api/migrate/self-service

async function selfServiceMigration(userId: string, tokens: {
  githubToken: string;
  vercelToken: string;
}) {
  const project = await getProject(userId);
  
  // 1. Fork repo to user's GitHub
  const userGithub = new Octokit({ auth: tokens.githubToken });
  const forkedRepo = await userGithub.repos.createFork({
    owner: 'stitchflow-sites',
    repo: project.githubRepo,
  });
  
  // 2. Create project in user's Vercel
  const userVercel = new VercelClient(tokens.vercelToken);
  const newProject = await userVercel.projects.create({
    name: project.name,
    gitRepository: {
      type: 'github',
      repo: forkedRepo.full_name,
    },
  });
  
  // 3. Transfer domain (if custom domain)
  if (project.customDomain) {
    // Add domain to their Vercel project
    await userVercel.projects.addDomain(newProject.id, project.customDomain);
    
    // Update DNS (or provide instructions)
    // User may need to update nameservers if they want full control
  }
  
  // 4. Provide migration summary
  return {
    newGithubRepo: forkedRepo.html_url,
    newVercelProject: newProject.url,
    newLiveUrl: `https://${project.name}.vercel.app`,
    documentation: '/docs/self-hosted-maintenance',
    domainInstructions: project.customDomain ? getDomainTransferInstructions() : null,
  };
  
  // 5. Mark project as migrated (keep in our DB for reference)
  await markProjectMigrated(project.id);
  
  // 6. Schedule deletion from our infrastructure (30 days grace period)
  await scheduleCleanup(project.id, '30d');
}
```

#### User Experience

```
User: "I want to migrate to my own accounts"

AI: "Sure! I can transfer everything to your own GitHub and Vercel.

     You'll need:
     1. GitHub Personal Access Token (with 'repo' scope)
     2. Vercel Access Token
     
     Here's how to get them:
     • GitHub: Settings → Developer Settings → Personal Access Tokens
     • Vercel: Settings → Tokens → Create
     
     Paste them below when ready, and I'll migrate instantly."

User: [Provides tokens]

AI: "✅ Migration complete!
     
     Your new locations:
     • GitHub: github.com/yourname/janes-bakery
     • Vercel: vercel.com/yourname/janes-bakery
     • Live site: janes-bakery.vercel.app
     
     Your domain (janesbakery.com) is still working.
     See the attached guide for managing it yourself.
     
     Thanks for using us! Come back anytime."
```

---

### Option 2: Assisted Migration (Paid Service)

**We help manually via Zoom or by joining their team**

```
WE PROVIDE:
├── 1-hour Zoom call
├── Screen share walkthrough
├── Set up their GitHub + Vercel accounts
├── Transfer code and deployments
├── Configure domain in their registrar
├── Answer questions, provide documentation
└── 30-day email support after migration

TIMELINE: Scheduled call (1-2 hours)
COST: $149 one-time fee
```

#### Sub-Options

**2a. Zoom Walkthrough**
```
• User shares screen
• We guide them step-by-step
• They maintain control throughout
• Good for: Users who want to learn
```

**2b. Team Member Access**
```
• User adds us as collaborator on GitHub
• User adds us to their Vercel team
• We do the migration for them
• Remove our access when done
• Good for: Users who want hands-off
```

**2c. Full Handoff**
```
• Everything in 2b, plus:
• We set up their Cloudflare/registrar account
• We transfer domain ownership to them
• We provide custom documentation
• Good for: Enterprise / complex setups
```

#### Booking Flow

```
User: "I want help migrating"

AI: "Happy to help! We offer assisted migration for $149.

     This includes:
     ✓ 1-hour Zoom call
     ✓ Full setup in your own accounts
     ✓ Domain transfer assistance
     ✓ 30-day email support
     
     [Book Migration Call] ← Calendly link
     
     Or if you prefer, you can migrate yourself for free
     by providing your GitHub and Vercel tokens."
```

---

### Option 3: Domain-Only Transfer

**User wants to keep using us but own their domain**

```
WHAT HAPPENS:
├── We transfer domain to their registrar account
├── They own the domain directly
├── We update DNS to still point to our Vercel
├── Site keeps working, they just own the domain
└── They handle renewals themselves

TIMELINE: 1-5 days (registrar transfer process)
COST: Free (standard domain transfer)
```

#### Technical Notes

```
For Cloudflare-registered domains:
• Use Cloudflare's domain transfer-out process
• User needs destination registrar account
• We initiate transfer, they approve

For Namecheap-registered domains:
• Unlock domain, get auth code
• User initiates transfer at their registrar
• We approve transfer request
```

---

## Migration Pricing Summary

| Option | Price | Timeline | User Effort |
|--------|-------|----------|-------------|
| Self-service (tokens) | Free | Instant | Medium |
| Zoom walkthrough | $149 | 1-2 hours | Low |
| We join their team | $149 | 1-2 hours | Minimal |
| Full handoff + domain | $249 | 2-3 hours | None |
| Domain-only transfer | Free | 1-5 days | Low |

---

## What Users Keep After Migration

| Asset | Self-Service | Assisted |
|-------|--------------|----------|
| Full source code | ✅ | ✅ |
| Git history | ✅ | ✅ |
| All assets (images, etc.) | ✅ | ✅ |
| Vercel configuration | ✅ | ✅ |
| Domain (if purchased) | ✅ | ✅ |
| Conversation history | Export available | Export available |
| Future updates via chat | ❌ (self-managed) | ❌ (self-managed) |

---

## Post-Migration Support

### Documentation Provided
```
/docs/self-hosted/
├── making-changes.md      # How to edit code
├── deploying-updates.md   # Push to deploy
├── domain-management.md   # DNS, SSL, renewals
├── troubleshooting.md     # Common issues
└── coming-back.md         # How to return to our platform
```

### Return Policy

User can always come back:
```
User: "I want to use your platform again"

AI: "Welcome back! 

     I can import your existing site.
     Just give me your GitHub repo URL
     and I'll set everything up.
     
     [Paste GitHub URL]"
```

---

## Implementation Timeline

**Not in MVP.** Add in Phase 2 or later.

| Phase | Migration Features |
|-------|-------------------|
| MVP (Phase 1) | None - users stay on our platform |
| Phase 2 | Self-service migration (tokens) |
| Phase 3 | Assisted migration offering |
| Phase 4 | Full migration suite + enterprise |

---

## Why Offer Migration?

1. **No lock-in** → Builds trust
2. **Reduces support burden** → Power users self-manage
3. **Revenue opportunity** → Assisted migration is paid
4. **Good faith** → Users own their work
5. **Competitive advantage** → Unlike Wix/Squarespace

---

*"Build with us, leave when you want, take everything with you."*
