-- Finch Care Database Schema
-- Run this against your Supabase database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  country_code TEXT,
  onboarding_done BOOLEAN DEFAULT FALSE
);

-- Regulation sessions
CREATE TABLE IF NOT EXISTS regulation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  protocol TEXT NOT NULL,
  duration_sec INTEGER,
  helped_score INTEGER CHECK (helped_score >= 0 AND helped_score <= 3),
  symptom_tags TEXT[]
);

-- Path days content (static content)
CREATE TABLE IF NOT EXISTS path_days (
  day_number INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  free BOOLEAN DEFAULT FALSE,
  preview_md TEXT
);

-- Path lessons content
CREATE TABLE IF NOT EXISTS path_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_number INTEGER NOT NULL REFERENCES path_days(day_number) ON DELETE CASCADE,
  content_md TEXT NOT NULL,
  est_minutes INTEGER DEFAULT 5
);

-- User day progress
CREATE TABLE IF NOT EXISTS user_day_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL REFERENCES path_days(day_number) ON DELETE CASCADE,
  lesson_completed_at TIMESTAMPTZ,
  practice_completed_at TIMESTAMPTZ,
  UNIQUE(user_id, day_number)
);

-- GAD-2 responses
CREATE TABLE IF NOT EXISTS gad2_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  q1 INTEGER NOT NULL CHECK (q1 >= 0 AND q1 <= 3),
  q2 INTEGER NOT NULL CHECK (q2 >= 0 AND q2 <= 3),
  total INTEGER GENERATED ALWAYS AS (q1 + q2) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Panic counts
CREATE TABLE IF NOT EXISTS panic_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Wallet for points
CREATE TABLE IF NOT EXISTS wallet (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0 CHECK (balance >= 0)
);

-- Transactions log
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT NOT NULL,
  delta INTEGER NOT NULL
);

-- Cosmetics items
CREATE TABLE IF NOT EXISTS cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  description TEXT
);

-- User unlocked cosmetics
CREATE TABLE IF NOT EXISTS user_cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cosmetic_id UUID NOT NULL REFERENCES cosmetics(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cosmetic_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  price_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_regulation_sessions_user_id ON regulation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_gad2_responses_user_id ON gad2_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_panic_counts_user_id ON panic_counts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cosmetics_user_id ON user_cosmetics(user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wallet (user_id, balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
