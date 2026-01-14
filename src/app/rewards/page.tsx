'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { getLocalData, unlockCosmetic as localUnlockCosmetic, addPoints } from '@/lib/localStore'
import { checkProStatus } from '@/lib/entitlements'
import type { User } from '@supabase/supabase-js'

interface Cosmetic {
  id: string
  name: string
  cost: number
  description: string
  image_url: string
}

// Fallback cosmetics
const fallbackCosmetics: Cosmetic[] = [
  { id: '1', name: 'Calm Sky Background', cost: 50, description: 'A peaceful sky gradient for your profile', image_url: '/cosmetics/calm-sky.png' },
  { id: '2', name: 'Gentle Rain Theme', cost: 75, description: 'Soft rain animation for your dashboard', image_url: '/cosmetics/gentle-rain.png' },
  { id: '3', name: 'Mountain Serenity', cost: 100, description: 'Majestic mountain landscape theme', image_url: '/cosmetics/mountain.png' },
  { id: '4', name: 'Forest Retreat', cost: 100, description: 'Peaceful forest backdrop', image_url: '/cosmetics/forest.png' },
  { id: '5', name: 'Ocean Waves', cost: 125, description: 'Calming ocean waves theme', image_url: '/cosmetics/ocean.png' },
  { id: '6', name: 'Sunrise Glow', cost: 150, description: 'Warm sunrise color scheme', image_url: '/cosmetics/sunrise.png' },
  { id: '7', name: 'Starry Night', cost: 150, description: 'Peaceful night sky theme', image_url: '/cosmetics/starry.png' },
  { id: '8', name: 'Garden Peace', cost: 200, description: 'Beautiful garden landscape', image_url: '/cosmetics/garden.png' },
  { id: '9', name: 'Northern Lights', cost: 250, description: 'Stunning aurora borealis theme', image_url: '/cosmetics/aurora.png' },
  { id: '10', name: 'Zen Stone', cost: 300, description: 'Minimalist zen garden theme', image_url: '/cosmetics/zen.png' }
]

export default function RewardsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [balance, setBalance] = useState(0)
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>(fallbackCosmetics)
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured()) {
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

        if (userData.user) {
          const status = await checkProStatus(userData.user.id)
          setIsPro(status.isPro)

          // Load wallet balance
          const { data: walletData } = await supabase
            .from('wallet')
            .select('balance')
            .eq('user_id', userData.user.id)
            .single()

          if (walletData) {
            setBalance(walletData.balance)
          }

          // Load unlocked cosmetics
          const { data: unlockedData } = await supabase
            .from('user_cosmetics')
            .select('cosmetic_id')
            .eq('user_id', userData.user.id)

          if (unlockedData) {
            setUnlockedIds(unlockedData.map(u => u.cosmetic_id))
          }
        } else {
          loadFromLocalStorage()
        }

        // Load cosmetics catalog
        const { data: cosmeticsData } = await supabase
          .from('cosmetics')
          .select('id, name, cost, description, image_url')
          .order('sort_order')

        if (cosmeticsData && cosmeticsData.length > 0) {
          setCosmetics(cosmeticsData)
        }
      } else {
        loadFromLocalStorage()
      }

      setLoading(false)
    }

    function loadFromLocalStorage() {
      const data = getLocalData()
      setBalance(data.wallet.balance)
      setUnlockedIds(data.unlockedCosmetics)
    }

    loadData()
  }, [])

  const handleUnlock = async (cosmetic: Cosmetic) => {
    if (balance < cosmetic.cost) return
    if (unlockedIds.includes(cosmetic.id)) return

    if (user && isSupabaseConfigured()) {
      // Update wallet
      const newBalance = balance - cosmetic.cost

      await supabase.from('wallet').update({
        balance: newBalance
      }).eq('user_id', user.id)

      // Add transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        reason: `Unlocked ${cosmetic.name}`,
        delta: -cosmetic.cost
      })

      // Add to user_cosmetics
      await supabase.from('user_cosmetics').insert({
        user_id: user.id,
        cosmetic_id: cosmetic.id
      })

      setBalance(newBalance)
    } else {
      localUnlockCosmetic(cosmetic.id, cosmetic.cost)
      setBalance(balance - cosmetic.cost)
    }

    setUnlockedIds([...unlockedIds, cosmetic.id])
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Rewards</h1>
          <p className="text-slate-600">Earn points, unlock cosmetics. No pressure, no penalties.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-teal-600">{balance}</div>
          <div className="text-sm text-slate-500">points</div>
        </div>
      </div>

      {/* Pro bonus indicator */}
      {isPro && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold">2x</span>
          </div>
          <div>
            <p className="font-medium text-purple-800">Pro Bonus Active</p>
            <p className="text-sm text-purple-600">You earn double points on all activities</p>
          </div>
        </div>
      )}

      {/* How to earn points */}
      <section className="bg-slate-50 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-slate-800 mb-4">How to earn points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
              +10
            </div>
            <span className="text-slate-600">Complete a reset session</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
              +15
            </div>
            <span className="text-slate-600">Complete a lesson</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
              +20
            </div>
            <span className="text-slate-600">Complete a practice</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
              +25
            </div>
            <span className="text-slate-600">Weekly check-in</span>
          </div>
        </div>
        {!isPro && (
          <p className="text-sm text-purple-600 mt-4">
            Pro members earn 2x points on everything!
          </p>
        )}
      </section>

      {/* Cosmetics shop */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Cosmetics Shop</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cosmetics.map((cosmetic) => {
            const isUnlocked = unlockedIds.includes(cosmetic.id)
            const canAfford = balance >= cosmetic.cost

            return (
              <div
                key={cosmetic.id}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  isUnlocked
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Image placeholder */}
                <div className={`h-24 ${isUnlocked ? 'bg-teal-100' : 'bg-gradient-to-br from-slate-100 to-slate-200'} flex items-center justify-center`}>
                  {isUnlocked ? (
                    <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-slate-800 text-sm mb-1">{cosmetic.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{cosmetic.description}</p>

                  {isUnlocked ? (
                    <span className="text-sm text-teal-600 font-medium">Unlocked</span>
                  ) : (
                    <button
                      onClick={() => handleUnlock(cosmetic)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-lg text-sm font-medium ${
                        canAfford
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Unlock (${cosmetic.cost} pts)` : `${cosmetic.cost} pts`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Note about rewards */}
      <p className="text-sm text-slate-500 mt-8 text-center">
        Rewards are purely cosmetic. They never expire and there are no penalties.
      </p>
    </div>
  )
}
