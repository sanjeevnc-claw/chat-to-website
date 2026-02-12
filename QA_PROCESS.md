# QA Process - Automated Code Review with Codex

> Every generated website/app goes through AI-powered QA before deployment.

---

## 🔍 QA Pipeline

```
USER APPROVES DESIGN
        │
        ▼
┌───────────────────┐
│  CODE GENERATION  │  ← Claude generates code
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   CODEX QA PASS   │  ← OpenAI Codex reviews
└───────────────────┘
        │
        ├── ❌ Issues found → Auto-fix or flag
        │
        ▼
┌───────────────────┐
│  AUTOMATED TESTS  │  ← Lint, type-check, build
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  VISUAL PREVIEW   │  ← Screenshot comparison
└───────────────────┘
        │
        ▼
┌───────────────────┐
│     DEPLOY ✅     │
└───────────────────┘
```

---

## 🤖 Codex QA Checks

### 1. Code Quality Review

```typescript
// POST /api/qa/code-review
async function runCodexReview(code: string, context: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo', // or codex model
    messages: [
      {
        role: 'system',
        content: `You are a senior code reviewer. Review the following code for:
          1. Security vulnerabilities (XSS, injection, exposed secrets)
          2. Performance issues (N+1 queries, memory leaks, large bundles)
          3. Accessibility problems (missing alt tags, ARIA, contrast)
          4. Best practices (React patterns, Next.js conventions)
          5. Mobile responsiveness issues
          6. SEO problems (meta tags, semantic HTML)
          
          Return JSON with:
          {
            "passed": boolean,
            "score": 0-100,
            "issues": [{ "severity": "error|warning|info", "file": "", "line": 0, "message": "", "fix": "" }],
            "suggestions": []
          }`
      },
      {
        role: 'user',
        content: `Context: ${context}\n\nCode:\n${code}`
      }
    ],
    response_format: { type: 'json_object' }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

### 2. Security Scan

```typescript
const SECURITY_CHECKS = [
  'No hardcoded API keys or secrets',
  'No eval() or dangerouslySetInnerHTML without sanitization',
  'Proper CORS configuration',
  'Input validation on all forms',
  'SQL/NoSQL injection prevention',
  'XSS prevention in user-generated content',
  'CSRF protection on mutations',
  'Secure headers (CSP, HSTS)',
  'No sensitive data in client bundle',
  'Rate limiting on API routes',
];
```

### 3. Accessibility Audit

```typescript
const A11Y_CHECKS = [
  'All images have alt text',
  'Proper heading hierarchy (h1 → h2 → h3)',
  'Color contrast ratio ≥ 4.5:1',
  'Focus indicators on interactive elements',
  'Keyboard navigation works',
  'ARIA labels on icon buttons',
  'Form inputs have labels',
  'Skip links for navigation',
  'No auto-playing media',
  'Semantic HTML elements',
];
```

### 4. Performance Review

```typescript
const PERFORMANCE_CHECKS = [
  'Images optimized (next/image or srcset)',
  'No blocking scripts in head',
  'Lazy loading for below-fold content',
  'Bundle size < 200KB initial JS',
  'No unnecessary re-renders',
  'Proper use of React.memo / useMemo',
  'API calls cached appropriately',
  'No layout shifts (CLS)',
  'Fonts preloaded or using next/font',
  'Static generation where possible',
];
```

---

## 📊 QA Score Calculation

```typescript
interface QAResult {
  overall: number;        // 0-100
  breakdown: {
    security: number;     // Weight: 30%
    accessibility: number; // Weight: 20%
    performance: number;  // Weight: 20%
    bestPractices: number; // Weight: 20%
    seo: number;          // Weight: 10%
  };
  passed: boolean;        // overall >= 70
  blockers: Issue[];      // Must fix before deploy
  warnings: Issue[];      // Should fix
  suggestions: Issue[];   // Nice to have
}

function calculateScore(checks: CheckResult[]): number {
  const weights = {
    security: 0.30,
    accessibility: 0.20,
    performance: 0.20,
    bestPractices: 0.20,
    seo: 0.10,
  };
  
  return Object.entries(weights).reduce((total, [category, weight]) => {
    const categoryScore = checks
      .filter(c => c.category === category)
      .reduce((sum, c) => sum + (c.passed ? 1 : 0), 0) / 
      checks.filter(c => c.category === category).length * 100;
    return total + (categoryScore * weight);
  }, 0);
}
```

---

## 🔧 Auto-Fix Pipeline

When Codex finds issues, we attempt auto-fix:

```typescript
async function autoFixIssues(code: string, issues: Issue[]): Promise<string> {
  const fixableIssues = issues.filter(i => i.autoFixable);
  
  if (fixableIssues.length === 0) return code;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `Fix the following issues in the code. Return ONLY the fixed code, no explanations.`
      },
      {
        role: 'user',
        content: `Issues to fix:\n${JSON.stringify(fixableIssues)}\n\nCode:\n${code}`
      }
    ]
  });
  
  return response.choices[0].message.content;
}
```

### Auto-Fixable Issues

| Issue Type | Auto-Fix |
|------------|----------|
| Missing alt text | ✅ Generate from context |
| Missing meta tags | ✅ Generate SEO tags |
| Accessibility labels | ✅ Add ARIA labels |
| Image optimization | ✅ Convert to next/image |
| Console.log statements | ✅ Remove |
| Unused imports | ✅ Remove |
| Missing error boundaries | ✅ Add wrapper |
| Missing loading states | ✅ Add Suspense |

### Requires Human Review

| Issue Type | Action |
|------------|--------|
| Security vulnerability | ⚠️ Flag + block deploy |
| Business logic error | ⚠️ Flag for user |
| Complex refactor | ⚠️ Suggest, don't auto-fix |
| Design discrepancy | ⚠️ Show comparison |

---

## 🧪 Automated Testing

### Build-Time Checks

```bash
# Run before deploy
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run build         # Next.js build
npm run test          # Unit tests (if any)
```

### Runtime Checks

```typescript
// Lighthouse CI
const lighthouseConfig = {
  assertions: {
    'categories:performance': ['error', { minScore: 0.7 }],
    'categories:accessibility': ['error', { minScore: 0.9 }],
    'categories:best-practices': ['error', { minScore: 0.8 }],
    'categories:seo': ['error', { minScore: 0.9 }],
  },
};
```

---

## 📸 Visual QA

### Screenshot Comparison

```typescript
// Compare generated site to user's reference
async function visualQA(previewUrl: string, referenceUrl?: string) {
  // Take screenshot of generated site
  const preview = await takeScreenshot(previewUrl);
  
  if (referenceUrl) {
    // Compare to reference site user provided
    const reference = await takeScreenshot(referenceUrl);
    const diff = await compareImages(preview, reference);
    
    return {
      similarity: diff.similarity,
      differences: diff.regions,
      report: generateVisualReport(diff),
    };
  }
  
  // Just check for obvious issues
  return await checkVisualIssues(preview);
}

async function checkVisualIssues(screenshot: Buffer) {
  // Use vision model to check for issues
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Review this website screenshot for visual issues:
              - Broken layouts
              - Overlapping elements
              - Unreadable text
              - Missing images
              - Inconsistent spacing
              - Mobile responsiveness issues
              Return JSON: { "issues": [], "passed": boolean }`
          },
          { type: 'image_url', image_url: { url: toDataUrl(screenshot) } }
        ]
      }
    ]
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 🚦 Deploy Gates

### Must Pass (Blockers)

```
❌ Cannot deploy if:
├── Security score < 80%
├── Any critical security vulnerability
├── Build fails
├── TypeScript errors
└── Core functionality broken
```

### Should Pass (Warnings)

```
⚠️ Warn but allow deploy if:
├── Accessibility score < 90%
├── Performance score < 70%
├── SEO score < 80%
└── Best practices score < 80%
```

### Nice to Have (Info)

```
ℹ️ Suggestions only:
├── Code style improvements
├── Performance optimizations
├── Additional SEO enhancements
└── UX improvements
```

---

## 📋 QA Report to User

```
┌─────────────────────────────────────────────────┐
│              QA REPORT                          │
├─────────────────────────────────────────────────┤
│  Overall Score: 87/100 ✅                       │
│                                                 │
│  Security:      ████████░░  95%                │
│  Accessibility: ████████░░  88%                │
│  Performance:   ███████░░░  82%                │
│  Best Practices:████████░░  85%                │
│  SEO:           █████████░  92%                │
│                                                 │
├─────────────────────────────────────────────────┤
│  ✅ 0 Blockers                                  │
│  ⚠️ 2 Warnings (auto-fixed)                    │
│  ℹ️ 3 Suggestions                              │
│                                                 │
│  Ready to deploy!                               │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Continuous QA

After deployment, we also run:

```
POST-DEPLOY MONITORING:
├── Uptime check (every 5 min)
├── Weekly Lighthouse audit
├── Monthly security scan
├── Error rate monitoring
└── Performance regression alerts
```

---

## 💰 Cost Estimation

| Check | Model | Cost per Site |
|-------|-------|---------------|
| Code Review | GPT-4 Turbo | ~$0.10 |
| Auto-Fix | GPT-4 Turbo | ~$0.05 |
| Visual QA | GPT-4 Vision | ~$0.03 |
| Lighthouse | Free | $0.00 |
| **Total** | | **~$0.18** |

Included in platform cost, not charged to user.

---

*"Every site we deploy passes AI-powered quality assurance."*
