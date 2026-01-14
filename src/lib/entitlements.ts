import { supabase } from './supabase/client'

export interface EntitlementResult {
  isPro: boolean
  reason: 'active_subscription' | 'free_tier' | 'no_subscription' | 'subscription_expired' | 'error'
}

// Check if a user has Pro access
export async function checkProStatus(userId: string | null): Promise<EntitlementResult> {
  if (!userId) {
    return { isPro: false, reason: 'free_tier' }
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return { isPro: false, reason: 'no_subscription' }
    }

    // Check if subscription is active
    const isActive = data.status === 'active' || data.status === 'trialing'

    // Check if not expired
    const now = new Date()
    const periodEnd = data.current_period_end ? new Date(data.current_period_end) : null
    const notExpired = periodEnd ? periodEnd > now : false

    if (isActive && notExpired) {
      return { isPro: true, reason: 'active_subscription' }
    }

    if (data.status === 'canceled' || data.status === 'past_due') {
      // Still has access until period end
      if (notExpired) {
        return { isPro: true, reason: 'active_subscription' }
      }
      return { isPro: false, reason: 'subscription_expired' }
    }

    return { isPro: false, reason: 'no_subscription' }

  } catch {
    return { isPro: false, reason: 'error' }
  }
}

// Check if a specific day is accessible
export function isDayAccessible(dayNumber: number, isPro: boolean): boolean {
  // Days 1-7 are always free
  if (dayNumber <= 7) return true
  // Days 8-30 require Pro
  return isPro
}

// Get points multiplier (Pro users get 2x)
export function getPointsMultiplier(isPro: boolean): number {
  return isPro ? 2 : 1
}
