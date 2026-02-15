import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const FREE_SITES = 1;
const FREE_UPDATES = 20;

// Whitelisted chat IDs (unlimited usage)
const ADMIN_CHAT_IDS = new Set([
  8220228754, // Sanjeev
]);

// Page type for multi-page support
export interface PageContent {
  slug: string;           // e.g., "about", "contact", "services"
  title: string;          // Display name in nav
  content: string;        // HTML content for the page
  isHome?: boolean;       // Is this the homepage?
  order: number;          // Navigation order
}

// Blog post type
export interface BlogPost {
  slug: string;           // URL slug e.g., "my-first-post"
  title: string;
  description: string;
  content: string;        // Markdown content
  publishedAt: string;    // ISO date
  updatedAt?: string;
}

export interface ProjectState {
  repoName: string | null;
  currentHtml: string | null;      // Legacy: single page HTML
  deployUrl: string | null;
  messages: { role: string; content: string }[];
  deployCount: number;
  images: string[];                // paths of uploaded images
  
  // Phase 1: Multi-page support
  pages: PageContent[];            // All pages in the site
  siteConfig: {
    siteName: string;
    description: string;
    primaryColor: string;
    fontFamily: string;
    navStyle: 'horizontal' | 'hamburger';
  } | null;
  
  // Phase 2: Blog support
  blogPosts: BlogPost[];
  hasBlog: boolean;
}

export interface UserUsage {
  sitesCreated: number;
  extraSites: number;       // purchased via Stars
  extraUpdates: number;     // purchased via Stars
  payments: string[];       // telegram_payment_charge_ids for refund support
}

const KEY_PREFIX = 'project:';
const USAGE_PREFIX = 'usage:';

export async function getProjectState(chatId: number): Promise<ProjectState | null> {
  const data = await redis.get<ProjectState>(`${KEY_PREFIX}${chatId}`);
  if (data) {
    // Backfill new fields for old states
    if (!data.pages) data.pages = [];
    if (!data.blogPosts) data.blogPosts = [];
    if (data.hasBlog === undefined) data.hasBlog = false;
    if (!data.siteConfig) data.siteConfig = null;
  }
  return data;
}

export async function setProjectState(chatId: number, state: ProjectState): Promise<void> {
  await redis.set(`${KEY_PREFIX}${chatId}`, state);
}

export async function resetProjectState(chatId: number): Promise<void> {
  await redis.del(`${KEY_PREFIX}${chatId}`);
}

export async function getUserUsage(chatId: number): Promise<UserUsage> {
  const data = await redis.get<UserUsage>(`${USAGE_PREFIX}${chatId}`);
  return data || { sitesCreated: 0, extraSites: 0, extraUpdates: 0, payments: [] };
}

export async function addExtraSite(chatId: number, paymentId: string): Promise<void> {
  const usage = await getUserUsage(chatId);
  usage.extraSites += 1;
  usage.payments.push(paymentId);
  await redis.set(`${USAGE_PREFIX}${chatId}`, usage);
}

export async function addExtraUpdates(chatId: number, paymentId: string, count: number = 20): Promise<void> {
  const usage = await getUserUsage(chatId);
  usage.extraUpdates += count;
  usage.payments.push(paymentId);
  await redis.set(`${USAGE_PREFIX}${chatId}`, usage);
}

export async function incrementSitesCreated(chatId: number): Promise<void> {
  const usage = await getUserUsage(chatId);
  usage.sitesCreated += 1;
  await redis.set(`${USAGE_PREFIX}${chatId}`, usage);
}

export function isAdmin(chatId: number): boolean {
  return ADMIN_CHAT_IDS.has(chatId);
}

export function canCreateSite(chatId: number, usage: UserUsage): boolean {
  return isAdmin(chatId) || usage.sitesCreated < (FREE_SITES + (usage.extraSites || 0));
}

export function canUpdate(chatId: number, state: ProjectState, usage: UserUsage): boolean {
  const totalUpdates = FREE_UPDATES + (usage.extraUpdates || 0);
  return isAdmin(chatId) || state.deployCount < totalUpdates;
}

// Helper: Create initial project state
export function createInitialState(): ProjectState {
  return {
    repoName: null,
    currentHtml: null,
    deployUrl: null,
    messages: [],
    deployCount: 0,
    images: [],
    pages: [],
    siteConfig: null,
    blogPosts: [],
    hasBlog: false,
  };
}

// Helper: Add or update a page
export function upsertPage(state: ProjectState, page: PageContent): void {
  const existingIndex = state.pages.findIndex(p => p.slug === page.slug);
  if (existingIndex >= 0) {
    state.pages[existingIndex] = page;
  } else {
    state.pages.push(page);
  }
}

// Helper: Remove a page
export function removePage(state: ProjectState, slug: string): boolean {
  const index = state.pages.findIndex(p => p.slug === slug);
  if (index >= 0) {
    state.pages.splice(index, 1);
    return true;
  }
  return false;
}

// Helper: Add or update a blog post
export function upsertBlogPost(state: ProjectState, post: BlogPost): void {
  const existingIndex = state.blogPosts.findIndex(p => p.slug === post.slug);
  if (existingIndex >= 0) {
    state.blogPosts[existingIndex] = post;
  } else {
    state.blogPosts.push(post);
  }
  state.hasBlog = true;
}

// Helper: Remove a blog post
export function removeBlogPost(state: ProjectState, slug: string): boolean {
  const index = state.blogPosts.findIndex(p => p.slug === slug);
  if (index >= 0) {
    state.blogPosts.splice(index, 1);
    return true;
  }
  return false;
}

// Pricing in Telegram Stars
export const PRICES = {
  EXTRA_SITE: 50,       // ~$1
  EXTRA_UPDATES: 25,    // 20 more updates, ~$0.50
} as const;

export { FREE_SITES, FREE_UPDATES };
