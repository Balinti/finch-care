'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { shouldShowSignupPrompt, dismissSignupPrompt } from '@/lib/localStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export default function SignupPrompt() {
  const [show, setShow] = useState(false)
  const [user, setUser] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is logged in
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(!!data.user)
      })
    }
  }, [])

  useEffect(() => {
    // Only show if not logged in and has meaningful activity
    if (!user && shouldShowSignupPrompt()) {
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [user])

  if (!show || user) return null

  const handleDismiss = () => {
    dismissSignupPrompt()
    setShow(false)
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-slate-800">Save your progress</h3>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Create a free account to save your progress, sync across devices, and unlock more features.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/sign-up"
          className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-center text-sm font-medium"
        >
          Create free account
        </Link>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm"
        >
          Later
        </button>
      </div>
    </div>
  )
}
