import { supabase } from './supabase/client'
import { getLocalData, markAsMigrated, LocalData } from './localStore'

// Migrate local data to Supabase after user signs up/logs in
export async function migrateLocalDataToSupabase(userId: string): Promise<{ success: boolean; error?: string }> {
  const localData = getLocalData()

  // Skip if already migrated or no data
  if (localData.migrated) {
    return { success: true }
  }

  const hasData = localData.sessions.length > 0 ||
    localData.dayProgress.length > 0 ||
    localData.gad2Responses.length > 0 ||
    localData.panicCounts.length > 0 ||
    localData.wallet.balance > 0 ||
    localData.unlockedCosmetics.length > 0

  if (!hasData) {
    markAsMigrated()
    return { success: true }
  }

  try {
    // Migrate sessions
    if (localData.sessions.length > 0) {
      const sessions = localData.sessions.map(s => ({
        id: s.id,
        user_id: userId,
        started_at: s.started_at,
        protocol: s.protocol,
        duration_sec: s.duration_sec,
        helped_score: s.helped_score,
        symptom_tags: s.symptom_tags
      }))

      const { error: sessionsError } = await supabase
        .from('regulation_sessions')
        .upsert(sessions, { onConflict: 'id' })

      if (sessionsError) {
        console.error('Error migrating sessions:', sessionsError)
      }
    }

    // Migrate day progress
    if (localData.dayProgress.length > 0) {
      const progress = localData.dayProgress.map(p => ({
        user_id: userId,
        day_number: p.day_number,
        lesson_completed_at: p.lesson_completed_at,
        practice_completed_at: p.practice_completed_at
      }))

      const { error: progressError } = await supabase
        .from('user_day_progress')
        .upsert(progress, { onConflict: 'user_id,day_number' })

      if (progressError) {
        console.error('Error migrating day progress:', progressError)
      }
    }

    // Migrate GAD-2 responses
    if (localData.gad2Responses.length > 0) {
      const responses = localData.gad2Responses.map(r => ({
        user_id: userId,
        week_start: r.week_start,
        q1: r.q1,
        q2: r.q2
      }))

      const { error: gad2Error } = await supabase
        .from('gad2_responses')
        .upsert(responses, { onConflict: 'user_id,week_start' })

      if (gad2Error) {
        console.error('Error migrating GAD-2 responses:', gad2Error)
      }
    }

    // Migrate panic counts
    if (localData.panicCounts.length > 0) {
      const counts = localData.panicCounts.map(p => ({
        user_id: userId,
        date: p.date,
        count: p.count
      }))

      const { error: panicError } = await supabase
        .from('panic_counts')
        .upsert(counts, { onConflict: 'user_id,date' })

      if (panicError) {
        console.error('Error migrating panic counts:', panicError)
      }
    }

    // Migrate wallet balance
    if (localData.wallet.balance > 0) {
      // First, get current balance
      const { data: currentWallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', userId)
        .single()

      const newBalance = (currentWallet?.balance || 0) + localData.wallet.balance

      const { error: walletError } = await supabase
        .from('wallet')
        .upsert({
          user_id: userId,
          balance: newBalance
        }, { onConflict: 'user_id' })

      if (walletError) {
        console.error('Error migrating wallet:', walletError)
      }

      // Migrate transactions
      if (localData.transactions.length > 0) {
        const transactions = localData.transactions.map(t => ({
          id: t.id,
          user_id: userId,
          created_at: t.created_at,
          reason: t.reason,
          delta: t.delta
        }))

        const { error: txError } = await supabase
          .from('transactions')
          .upsert(transactions, { onConflict: 'id' })

        if (txError) {
          console.error('Error migrating transactions:', txError)
        }
      }
    }

    // Migrate unlocked cosmetics
    if (localData.unlockedCosmetics.length > 0) {
      const cosmetics = localData.unlockedCosmetics.map(id => ({
        user_id: userId,
        cosmetic_id: id,
        unlocked_at: new Date().toISOString()
      }))

      const { error: cosmeticsError } = await supabase
        .from('user_cosmetics')
        .upsert(cosmetics, { onConflict: 'user_id,cosmetic_id' })

      if (cosmeticsError) {
        console.error('Error migrating cosmetics:', cosmeticsError)
      }
    }

    // Migrate country code to profile
    if (localData.countryCode) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ country_code: localData.countryCode })
        .eq('id', userId)

      if (profileError) {
        console.error('Error migrating profile:', profileError)
      }
    }

    markAsMigrated()
    return { success: true }

  } catch (error) {
    console.error('Migration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during migration'
    }
  }
}
