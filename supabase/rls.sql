-- Finch Care Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE gad2_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE panic_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Regulation sessions: users can CRUD their own sessions
CREATE POLICY "Users can view own sessions"
  ON regulation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON regulation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON regulation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Path days: everyone can read (content is public)
CREATE POLICY "Anyone can view path days"
  ON path_days FOR SELECT
  USING (true);

-- Path lessons: everyone can read
CREATE POLICY "Anyone can view path lessons"
  ON path_lessons FOR SELECT
  USING (true);

-- User day progress: users can CRUD their own
CREATE POLICY "Users can view own day progress"
  ON user_day_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own day progress"
  ON user_day_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own day progress"
  ON user_day_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- GAD-2 responses: users can CRUD their own
CREATE POLICY "Users can view own gad2 responses"
  ON gad2_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gad2 responses"
  ON gad2_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gad2 responses"
  ON gad2_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- Panic counts: users can CRUD their own
CREATE POLICY "Users can view own panic counts"
  ON panic_counts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own panic counts"
  ON panic_counts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own panic counts"
  ON panic_counts FOR UPDATE
  USING (auth.uid() = user_id);

-- Wallet: users can view their own
CREATE POLICY "Users can view own wallet"
  ON wallet FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallet FOR UPDATE
  USING (auth.uid() = user_id);

-- Transactions: users can view and insert their own
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Cosmetics: everyone can read (shop items are public)
CREATE POLICY "Anyone can view cosmetics"
  ON cosmetics FOR SELECT
  USING (true);

-- User cosmetics: users can CRUD their own
CREATE POLICY "Users can view own cosmetics"
  ON user_cosmetics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cosmetics"
  ON user_cosmetics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions: users can view their own
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do anything (for webhook updates)
-- This is handled by using service_role key in API routes
