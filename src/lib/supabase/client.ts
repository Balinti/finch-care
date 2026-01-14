import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Create a mock client that does nothing when Supabase is not configured
const createMockClient = (): SupabaseClient => {
  const mockResponse = { data: null, error: null }
  const mockQuery = () => ({
    select: () => mockQuery(),
    insert: () => Promise.resolve(mockResponse),
    update: () => mockQuery(),
    upsert: () => Promise.resolve(mockResponse),
    delete: () => mockQuery(),
    eq: () => mockQuery(),
    single: () => Promise.resolve(mockResponse),
    order: () => mockQuery(),
    limit: () => mockQuery(),
  })

  return {
    from: () => mockQuery(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as SupabaseClient
}

// Client-side Supabase client (uses anon key)
// Returns a mock client if Supabase is not configured to prevent build errors
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()
