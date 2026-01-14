'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { checkProStatus } from '@/lib/entitlements'
import { isStripeConfigured, getAvailablePlans, STRIPE_PRICES } from '@/lib/stripe'
import type { User } from '@supabase/supabase-js'

interface Subscription {
  status: string
  current_period_end: string
  price_id: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const stripeConfigured = isStripeConfigured()
  const availablePlans = getAvailablePlans()

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured()) {
        setLoading(false)
        return
      }

      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push('/auth/sign-in')
        return
      }

      setUser(userData.user)

      // Check pro status
      const status = await checkProStatus(userData.user.id)
      setIsPro(status.isPro)

      // Load subscription details
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('status, current_period_end, price_id')
        .eq('user_id', userData.user.id)
        .single()

      if (subData) {
        setSubscription(subData)
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleCheckout = async (priceId: string) => {
    if (!user) return

    setCheckoutLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email
        })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }

    setCheckoutLoading(false)
  }

  const handleManageBilling = async () => {
    if (!user) return

    setPortalLoading(true)

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No portal URL returned')
      }
    } catch (error) {
      console.error('Portal error:', error)
    }

    setPortalLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-40 bg-slate-200 rounded-xl" />
          <div className="h-40 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Sign in to view your account</h1>
        <Link
          href="/auth/sign-in"
          className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Account</h1>

      {/* Profile section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Profile</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Email</span>
            <span className="text-slate-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Member since</span>
            <span className="text-slate-800">
              {formatDate(user.created_at)}
            </span>
          </div>
        </div>
      </section>

      {/* Subscription section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Subscription</h2>

        {isPro ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-slate-800">Pro Plan</div>
                <div className="text-sm text-slate-500">
                  {subscription?.status === 'active' ? 'Active' : subscription?.status}
                </div>
              </div>
            </div>

            {subscription?.current_period_end && (
              <p className="text-sm text-slate-600 mb-4">
                {subscription.status === 'canceled'
                  ? `Access until ${formatDate(subscription.current_period_end)}`
                  : `Renews on ${formatDate(subscription.current_period_end)}`
                }
              </p>
            )}

            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              {portalLoading ? 'Loading...' : 'Manage billing'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 mb-4">
              You&apos;re on the Free plan. Upgrade to Pro for full access to Days 8-30 and 2x points.
            </p>

            {stripeConfigured ? (
              <div className="space-y-3">
                {availablePlans.monthly && STRIPE_PRICES.monthly && (
                  <button
                    onClick={() => handleCheckout(STRIPE_PRICES.monthly)}
                    disabled={checkoutLoading}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-slate-300"
                  >
                    {checkoutLoading ? 'Loading...' : 'Upgrade to Pro (Monthly)'}
                  </button>
                )}
                {availablePlans.annual && STRIPE_PRICES.annual && (
                  <button
                    onClick={() => handleCheckout(STRIPE_PRICES.annual)}
                    disabled={checkoutLoading}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-slate-300"
                  >
                    {checkoutLoading ? 'Loading...' : 'Upgrade to Pro (Annual - Save 2 months)'}
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-700 text-sm">
                  Pro subscriptions coming soon! For now, enjoy the free features.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Pro features */}
      {!isPro && (
        <section className="bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-100 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">What&apos;s in Pro</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Full 30-day Anxiety Skills Path (Days 8-30)</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">2x points on all activities</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Support ongoing development</span>
            </li>
          </ul>
        </section>
      )}

      {/* Privacy & data */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Privacy & Data</h2>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Your data is stored securely and never shared with third parties for advertising.
          </p>
          <p>
            You can request a copy of your data or account deletion by contacting support.
          </p>
        </div>
      </section>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
      >
        Sign Out
      </button>
    </div>
  )
}
