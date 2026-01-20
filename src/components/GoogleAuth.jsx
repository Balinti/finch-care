'use client'

import { useState, useEffect } from 'react'

// Hardcoded Supabase configuration - DO NOT use env vars
const SUPABASE_URL = 'https://api.srv936332.hstgr.cloud'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
const APP_SLUG = 'finch-care'

let supabaseClient = null

// Load Supabase client dynamically via CDN
const loadSupabase = () => {
  return new Promise((resolve, reject) => {
    if (supabaseClient) {
      resolve(supabaseClient)
      return
    }

    if (typeof window !== 'undefined' && window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      resolve(supabaseClient)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
    script.async = true
    script.onload = () => {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      resolve(supabaseClient)
    }
    script.onerror = () => reject(new Error('Failed to load Supabase'))
    document.head.appendChild(script)
  })
}

// Track user login - upsert to user_tracking table
const trackUserLogin = async (user) => {
  if (!user || !supabaseClient) return

  try {
    const { data: existing } = await supabaseClient
      .from('user_tracking')
      .select('login_cnt')
      .eq('user_email', user.email)
      .eq('app', APP_SLUG)
      .single()

    if (existing) {
      // User exists for this app - increment login count and update timestamp
      await supabaseClient
        .from('user_tracking')
        .update({
          login_cnt: existing.login_cnt + 1,
          last_login_ts: new Date().toISOString()
        })
        .eq('user_email', user.email)
        .eq('app', APP_SLUG)
    } else {
      // New user for this app - insert new row
      await supabaseClient
        .from('user_tracking')
        .insert({
          user_email: user.email,
          app: APP_SLUG,
          login_cnt: 1,
          last_login_ts: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Error tracking user login:', error)
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const client = await loadSupabase()
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

// Sign out
export const signOut = async () => {
  try {
    const client = await loadSupabase()
    const { error } = await client.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export default function GoogleAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription = null

    const initAuth = async () => {
      try {
        const client = await loadSupabase()

        // Get current user
        const { data: { user: currentUser } } = await client.auth.getUser()
        setUser(currentUser)
        setLoading(false)

        // Listen for auth state changes
        const { data: { subscription: sub } } = client.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null)

          // Track login on SIGNED_IN event
          if (event === 'SIGNED_IN' && session?.user) {
            await trackUserLogin(session.user)
          }
        })
        subscription = sub
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="h-10 w-24 bg-slate-200 animate-pulse rounded-lg"></div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 hidden sm:inline">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 text-sm font-medium"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>
  )
}
