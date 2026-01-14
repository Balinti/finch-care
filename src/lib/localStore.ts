// Local storage utility for anonymous users
// Version key allows for schema migrations

const STORE_VERSION = 'finchCare:v1'

export interface LocalSession {
  id: string
  started_at: string
  protocol: string
  duration_sec?: number
  helped_score?: number
  symptom_tags?: string[]
}

export interface LocalDayProgress {
  day_number: number
  lesson_completed_at?: string
  practice_completed_at?: string
}

export interface LocalGAD2Response {
  week_start: string
  q1: number
  q2: number
  total: number
  created_at: string
}

export interface LocalPanicCount {
  date: string
  count: number
}

export interface LocalTransaction {
  id: string
  created_at: string
  reason: string
  delta: number
}

export interface LocalData {
  sessions: LocalSession[]
  dayProgress: LocalDayProgress[]
  gad2Responses: LocalGAD2Response[]
  panicCounts: LocalPanicCount[]
  wallet: { balance: number }
  transactions: LocalTransaction[]
  unlockedCosmetics: string[]
  migrated: boolean
  signupPromptShown: boolean
  signupPromptDismissedAt?: string
  countryCode?: string
}

const defaultData: LocalData = {
  sessions: [],
  dayProgress: [],
  gad2Responses: [],
  panicCounts: [],
  wallet: { balance: 0 },
  transactions: [],
  unlockedCosmetics: [],
  migrated: false,
  signupPromptShown: false
}

export function getLocalData(): LocalData {
  if (typeof window === 'undefined') return defaultData

  try {
    const stored = localStorage.getItem(STORE_VERSION)
    if (!stored) return defaultData
    return { ...defaultData, ...JSON.parse(stored) }
  } catch {
    return defaultData
  }
}

export function setLocalData(data: Partial<LocalData>): void {
  if (typeof window === 'undefined') return

  try {
    const current = getLocalData()
    const updated = { ...current, ...data }
    localStorage.setItem(STORE_VERSION, JSON.stringify(updated))
  } catch {
    // Ignore storage errors
  }
}

// Helper functions for specific operations
export function addSession(session: LocalSession): void {
  const data = getLocalData()
  data.sessions.push(session)
  setLocalData({ sessions: data.sessions })
}

export function updateDayProgress(progress: LocalDayProgress): void {
  const data = getLocalData()
  const existing = data.dayProgress.findIndex(p => p.day_number === progress.day_number)
  if (existing >= 0) {
    data.dayProgress[existing] = { ...data.dayProgress[existing], ...progress }
  } else {
    data.dayProgress.push(progress)
  }
  setLocalData({ dayProgress: data.dayProgress })
}

export function getDayProgress(dayNumber: number): LocalDayProgress | undefined {
  const data = getLocalData()
  return data.dayProgress.find(p => p.day_number === dayNumber)
}

export function addGAD2Response(response: LocalGAD2Response): void {
  const data = getLocalData()
  const existing = data.gad2Responses.findIndex(r => r.week_start === response.week_start)
  if (existing >= 0) {
    data.gad2Responses[existing] = response
  } else {
    data.gad2Responses.push(response)
  }
  setLocalData({ gad2Responses: data.gad2Responses })
}

export function updatePanicCount(date: string, count: number): void {
  const data = getLocalData()
  const existing = data.panicCounts.findIndex(p => p.date === date)
  if (existing >= 0) {
    data.panicCounts[existing].count = count
  } else {
    data.panicCounts.push({ date, count })
  }
  setLocalData({ panicCounts: data.panicCounts })
}

export function addPoints(delta: number, reason: string): void {
  const data = getLocalData()
  const newBalance = Math.max(0, data.wallet.balance + delta)
  const transaction: LocalTransaction = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    reason,
    delta
  }
  data.wallet.balance = newBalance
  data.transactions.push(transaction)
  setLocalData({
    wallet: data.wallet,
    transactions: data.transactions
  })
}

export function unlockCosmetic(cosmeticId: string, cost: number): boolean {
  const data = getLocalData()
  if (data.wallet.balance < cost) return false
  if (data.unlockedCosmetics.includes(cosmeticId)) return false

  data.unlockedCosmetics.push(cosmeticId)
  addPoints(-cost, `Unlocked cosmetic: ${cosmeticId}`)
  setLocalData({ unlockedCosmetics: data.unlockedCosmetics })
  return true
}

export function hasCompletedMeaningfulAction(): boolean {
  const data = getLocalData()
  // Meaningful action: completed a session OR completed day 1 lesson
  const hasSession = data.sessions.length > 0
  const hasDay1 = data.dayProgress.some(p =>
    p.day_number === 1 && (p.lesson_completed_at || p.practice_completed_at)
  )
  return hasSession || hasDay1
}

export function shouldShowSignupPrompt(): boolean {
  const data = getLocalData()
  if (data.migrated) return false
  if (data.signupPromptDismissedAt) {
    // Don't show again within 24 hours
    const dismissedAt = new Date(data.signupPromptDismissedAt)
    const now = new Date()
    if (now.getTime() - dismissedAt.getTime() < 24 * 60 * 60 * 1000) {
      return false
    }
  }
  return hasCompletedMeaningfulAction()
}

export function dismissSignupPrompt(): void {
  setLocalData({
    signupPromptShown: true,
    signupPromptDismissedAt: new Date().toISOString()
  })
}

export function markAsMigrated(): void {
  setLocalData({ migrated: true })
}

export function clearLocalData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORE_VERSION)
}
