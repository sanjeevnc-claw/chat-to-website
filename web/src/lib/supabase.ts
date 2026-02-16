import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role (bypasses RLS)
// Lazy initialization to avoid build errors
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !serviceKey) {
      throw new Error("Supabase credentials not configured");
    }
    
    _supabase = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // New Supabase keys (sb_secret_*) need this header format
      global: {
        headers: {
          apikey: serviceKey,
        },
      },
    });
  }
  return _supabase;
}

// For backward compatibility
export const supabase = {
  get rpc() { return getSupabase().rpc.bind(getSupabase()); },
  get from() { return getSupabase().from.bind(getSupabase()); },
};

// Types
export interface User {
  id: string;
  telegram_id: number | null;
  telegram_username: string | null;
  web_session_id: string | null;
  credits: number;
  total_credits_purchased: number;
  total_credits_spent: number;
  country_code: string | null;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  provider: "stripe" | "dodo" | "telegram";
  provider_payment_id: string;
  provider_customer_id: string | null;
  amount_cents: number;
  currency: string;
  credits_purchased: number;
  status: "pending" | "completed" | "failed" | "refunded";
  created_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
}

export interface Site {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  github_repo: string | null;
  vercel_url: string | null;
  cloudflare_project: string | null;
  custom_domain: string | null;
  pages: Array<{ name: string; path: string }>;
  blog_posts: Array<{ title: string; slug: string }>;
  status: "generating" | "deployed" | "failed" | "deleted";
  credits_used: number;
  created_at: string;
  updated_at: string;
  deployed_at: string | null;
}

// ============================================
// USER OPERATIONS
// ============================================

export async function getOrCreateTelegramUser(
  telegramId: number,
  username?: string
): Promise<User> {
  const { data, error } = await supabase.rpc("get_or_create_telegram_user", {
    p_telegram_id: telegramId,
    p_telegram_username: username || null,
  });

  if (error) throw error;

  // Fetch full user
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data)
    .single();

  if (fetchError) throw fetchError;
  return user as User;
}

export async function getOrCreateWebUser(
  sessionId: string,
  countryCode?: string
): Promise<User> {
  const { data, error } = await supabase.rpc("get_or_create_web_user", {
    p_web_session_id: sessionId,
    p_country_code: countryCode || null,
  });

  if (error) throw error;

  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data)
    .single();

  if (fetchError) throw fetchError;
  return user as User;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data as User;
}

export async function getUserByTelegramId(
  telegramId: number
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as User;
}

// ============================================
// CREDIT OPERATIONS
// ============================================

export async function getUserCredits(userId: string): Promise<number> {
  const user = await getUserById(userId);
  return user?.credits ?? 0;
}

export async function spendCredits(
  userId: string,
  amount: number,
  siteId?: string,
  description?: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("spend_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_site_id: siteId || null,
    p_description: description || null,
  });

  if (error) throw error;
  return data as boolean;
}

export async function addCredits(
  userId: string,
  amount: number,
  paymentId: string,
  description?: string
): Promise<number> {
  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_payment_id: paymentId,
    p_description: description || null,
  });

  if (error) throw error;
  return data as number;
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export async function createPayment(
  userId: string,
  provider: "stripe" | "dodo" | "telegram",
  providerPaymentId: string,
  amountCents: number,
  currency: string,
  creditsPurchased: number,
  metadata?: Record<string, unknown>
): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: userId,
      provider,
      provider_payment_id: providerPaymentId,
      amount_cents: amountCents,
      currency,
      credits_purchased: creditsPurchased,
      status: "pending",
      metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function completePayment(paymentId: string): Promise<Payment> {
  const { data, error } = await supabase
    .from("payments")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function getPaymentByProviderId(
  provider: "stripe" | "dodo" | "telegram",
  providerPaymentId: string
): Promise<Payment | null> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("provider", provider)
    .eq("provider_payment_id", providerPaymentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Payment;
}

// ============================================
// SITE OPERATIONS
// ============================================

export async function createSite(
  userId: string,
  name: string,
  description?: string
): Promise<Site> {
  const { data, error } = await supabase
    .from("sites")
    .insert({
      user_id: userId,
      name,
      description,
      status: "generating",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Site;
}

export async function updateSiteDeployed(
  siteId: string,
  vercelUrl: string,
  pages: Array<{ name: string; path: string }>,
  creditsUsed: number,
  options?: {
    githubRepo?: string;
    cloudflareProject?: string;
  }
): Promise<Site> {
  const { data, error } = await supabase
    .from("sites")
    .update({
      github_repo: options?.githubRepo || null,
      cloudflare_project: options?.cloudflareProject || null,
      vercel_url: vercelUrl,
      pages,
      status: "deployed",
      credits_used: creditsUsed,
      deployed_at: new Date().toISOString(),
    })
    .eq("id", siteId)
    .select()
    .single();

  if (error) throw error;
  return data as Site;
}

export async function getUserSites(userId: string): Promise<Site[]> {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Site[];
}
