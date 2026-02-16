-- Chat-to-Website Initial Schema
-- Created: 2026-02-16
-- Run this in Supabase SQL Editor or via CLI

-- ============================================
-- TYPES
-- ============================================

CREATE TYPE payment_provider AS ENUM ('stripe', 'dodo', 'telegram');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE credit_type AS ENUM ('purchase', 'spend', 'refund', 'bonus', 'admin');
CREATE TYPE site_status AS ENUM ('generating', 'deployed', 'failed', 'deleted');

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity (at least one required)
  telegram_id BIGINT UNIQUE,
  telegram_username TEXT,
  web_session_id TEXT UNIQUE,
  
  -- Credits
  credits INTEGER NOT NULL DEFAULT 5,
  total_credits_purchased INTEGER NOT NULL DEFAULT 0,
  total_credits_spent INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  country_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT has_identity CHECK (
    telegram_id IS NOT NULL OR web_session_id IS NOT NULL
  )
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment details
  provider payment_provider NOT NULL,
  provider_payment_id TEXT NOT NULL,
  provider_customer_id TEXT,
  
  -- Amount
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  credits_purchased INTEGER NOT NULL,
  
  -- Status
  status payment_status NOT NULL DEFAULT 'pending',
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB,
  
  -- Constraints
  CONSTRAINT positive_amount CHECK (amount_cents > 0),
  CONSTRAINT positive_credits CHECK (credits_purchased > 0)
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction
  type credit_type NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  
  -- References
  payment_id UUID REFERENCES payments(id),
  site_id UUID,
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT
);

-- Sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Site details
  name TEXT NOT NULL,
  description TEXT,
  
  -- Deployment
  github_repo TEXT,
  vercel_url TEXT,
  custom_domain TEXT,
  
  -- Structure
  pages JSONB NOT NULL DEFAULT '[]',
  blog_posts JSONB NOT NULL DEFAULT '[]',
  
  -- Status
  status site_status NOT NULL DEFAULT 'generating',
  credits_used INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  
  CONSTRAINT valid_pages CHECK (jsonb_typeof(pages) = 'array'),
  CONSTRAINT valid_blog CHECK (jsonb_typeof(blog_posts) = 'array')
);

-- Add site foreign key to credit_transactions
ALTER TABLE credit_transactions 
  ADD CONSTRAINT fk_credit_site 
  FOREIGN KEY (site_id) REFERENCES sites(id);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_web_session_id ON users(web_session_id);
CREATE INDEX idx_users_last_active ON users(last_active_at);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_provider_id ON payments(provider, provider_payment_id);
CREATE INDEX idx_payments_status ON payments(status) WHERE status = 'pending';
CREATE INDEX idx_payments_created ON payments(created_at DESC);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id, created_at DESC);

CREATE INDEX idx_sites_user ON sites(user_id, created_at DESC);
CREATE INDEX idx_sites_status ON sites(status) WHERE status IN ('generating', 'deployed');

-- ============================================
-- TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Spend Credits
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_site_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_current_credits IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;
  
  v_new_balance := v_current_credits - p_amount;
  
  UPDATE users 
  SET credits = v_new_balance,
      total_credits_spent = total_credits_spent + p_amount,
      last_active_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, site_id, description)
  VALUES (p_user_id, 'spend', -p_amount, v_new_balance, p_site_id, p_description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add Credits
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_payment_id UUID,
  p_description TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE users 
  SET credits = credits + p_amount,
      total_credits_purchased = total_credits_purchased + p_amount,
      last_active_at = NOW()
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;
  
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, payment_id, description)
  VALUES (p_user_id, 'purchase', p_amount, v_new_balance, p_payment_id, p_description);
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- Get or Create Telegram User
CREATE OR REPLACE FUNCTION get_or_create_telegram_user(
  p_telegram_id BIGINT,
  p_telegram_username TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM users
  WHERE telegram_id = p_telegram_id;
  
  IF v_user_id IS NOT NULL THEN
    UPDATE users 
    SET last_active_at = NOW(),
        telegram_username = COALESCE(p_telegram_username, telegram_username)
    WHERE id = v_user_id;
    RETURN v_user_id;
  END IF;
  
  INSERT INTO users (telegram_id, telegram_username, credits)
  VALUES (p_telegram_id, p_telegram_username, 5)
  RETURNING id INTO v_user_id;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Get or Create Web User
CREATE OR REPLACE FUNCTION get_or_create_web_user(
  p_web_session_id TEXT,
  p_country_code TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM users
  WHERE web_session_id = p_web_session_id;
  
  IF v_user_id IS NOT NULL THEN
    UPDATE users 
    SET last_active_at = NOW(),
        country_code = COALESCE(p_country_code, country_code)
    WHERE id = v_user_id;
    RETURN v_user_id;
  END IF;
  
  INSERT INTO users (web_session_id, country_code, credits)
  VALUES (p_web_session_id, p_country_code, 5)
  RETURNING id INTO v_user_id;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Service role key bypasses RLS
-- All operations go through Next.js API routes using service_role key
