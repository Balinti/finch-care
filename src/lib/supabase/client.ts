import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Hardcoded Supabase configuration - shared across all apps
const supabaseUrl = 'https://api.srv936332.hstgr.cloud'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

// Check if Supabase is configured (always true now with hardcoded values)
export const isSupabaseConfigured = () => {
  return true
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
