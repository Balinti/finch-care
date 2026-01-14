'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { getLocalData, addGAD2Response, updatePanicCount, addPoints } from '@/lib/localStore'
import { checkProStatus, getPointsMultiplier } from '@/lib/entitlements'
import type { User } from '@supabase/supabase-js'

interface GAD2Response {
  week_start: string
  q1: number
  q2: number
  total: number
}

interface PanicCount {
  date: string
  count: number
}

const gad2Questions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying'
]

const gad2Options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
]

function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

export default function ProgressPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [gad2History, setGad2History] = useState<GAD2Response[]>([])
  const [panicHistory, setPanicHistory] = useState<PanicCount[]>([])
  const [currentWeekResponse, setCurrentWeekResponse] = useState<GAD2Response | null>(null)
  const [showGAD2Form, setShowGAD2Form] = useState(false)
  const [q1, setQ1] = useState<number | null>(null)
  const [q2, setQ2] = useState<number | null>(null)
  const [todayPanic, setTodayPanic] = useState(0)
  const [loading, setLoading] = useState(true)

  const currentWeekStart = getWeekStart()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured()) {
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

        if (userData.user) {
          const status = await checkProStatus(userData.user.id)
          setIsPro(status.isPro)

          // Load GAD-2 history
          const { data: gad2Data } = await supabase
            .from('gad2_responses')
            .select('week_start, q1, q2, total')
            .eq('user_id', userData.user.id)
            .order('week_start', { ascending: false })
            .limit(12)

          if (gad2Data) {
            setGad2History(gad2Data)
            const current = gad2Data.find(r => r.week_start === currentWeekStart)
            setCurrentWeekResponse(current || null)
          }

          // Load panic counts
          const { data: panicData } = await supabase
            .from('panic_counts')
            .select('date, count')
            .eq('user_id', userData.user.id)
            .order('date', { ascending: false })
            .limit(30)

          if (panicData) {
            setPanicHistory(panicData)
            const todayCount = panicData.find(p => p.date === today)
            setTodayPanic(todayCount?.count || 0)
          }
        } else {
          loadFromLocalStorage()
        }
      } else {
        loadFromLocalStorage()
      }

      setLoading(false)
    }

    function loadFromLocalStorage() {
      const data = getLocalData()
      setGad2History(data.gad2Responses)
      const current = data.gad2Responses.find(r => r.week_start === currentWeekStart)
      setCurrentWeekResponse(current || null)

      setPanicHistory(data.panicCounts)
      const todayCount = data.panicCounts.find(p => p.date === today)
      setTodayPanic(todayCount?.count || 0)
    }

    loadData()
  }, [currentWeekStart, today])

  const handleSubmitGAD2 = async () => {
    if (q1 === null || q2 === null) return

    const response: GAD2Response = {
      week_start: currentWeekStart,
      q1,
      q2,
      total: q1 + q2
    }

    const multiplier = getPointsMultiplier(isPro)
    const points = 25 * multiplier

    if (user && isSupabaseConfigured()) {
      await supabase.from('gad2_responses').upsert({
        user_id: user.id,
        week_start: currentWeekStart,
        q1,
        q2
      }, { onConflict: 'user_id,week_start' })

      // Add points
      const { data: wallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single()

      await supabase.from('wallet').upsert({
        user_id: user.id,
        balance: (wallet?.balance || 0) + points
      })

      await supabase.from('transactions').insert({
        user_id: user.id,
        reason: 'Completed weekly check-in',
        delta: points
      })
    } else {
      addGAD2Response({
        ...response,
        created_at: new Date().toISOString()
      })
      addPoints(points, 'Completed weekly check-in')
    }

    setCurrentWeekResponse(response)
    setGad2History([response, ...gad2History.filter(r => r.week_start !== currentWeekStart)])
    setShowGAD2Form(false)
    setQ1(null)
    setQ2(null)
  }

  const handleUpdatePanic = async (delta: number) => {
    const newCount = Math.max(0, todayPanic + delta)
    setTodayPanic(newCount)

    if (user && isSupabaseConfigured()) {
      await supabase.from('panic_counts').upsert({
        user_id: user.id,
        date: today,
        count: newCount
      }, { onConflict: 'user_id,date' })
    } else {
      updatePanicCount(today, newCount)
    }

    // Update local history
    const existingIndex = panicHistory.findIndex(p => p.date === today)
    if (existingIndex >= 0) {
      const updated = [...panicHistory]
      updated[existingIndex] = { date: today, count: newCount }
      setPanicHistory(updated)
    } else {
      setPanicHistory([{ date: today, count: newCount }, ...panicHistory])
    }
  }

  const getScoreInterpretation = (score: number) => {
    if (score <= 2) return { label: 'Minimal anxiety', color: 'text-green-600' }
    if (score <= 4) return { label: 'Mild anxiety', color: 'text-amber-600' }
    return { label: 'Moderate anxiety', color: 'text-rose-600' }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-40 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Progress</h1>
      <p className="text-slate-600 mb-8">Track your journey with gentle check-ins</p>

      {/* Weekly GAD-2 Check-in */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Weekly Check-in</h2>
          {currentWeekResponse && (
            <span className="text-sm text-green-600 font-medium">Completed this week</span>
          )}
        </div>

        {currentWeekResponse && !showGAD2Form ? (
          <div>
            <p className="text-slate-600 mb-4">
              Over the past 2 weeks, how often have you been bothered by these problems?
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Your score this week</span>
                <span className={`text-2xl font-bold ${getScoreInterpretation(currentWeekResponse.total).color}`}>
                  {currentWeekResponse.total}/6
                </span>
              </div>
              <p className={`text-sm ${getScoreInterpretation(currentWeekResponse.total).color}`}>
                {getScoreInterpretation(currentWeekResponse.total).label}
              </p>
            </div>

            <button
              onClick={() => setShowGAD2Form(true)}
              className="text-teal-600 hover:text-teal-700 text-sm"
            >
              Update this week&apos;s response
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 mb-6">
              Over the past 2 weeks, how often have you been bothered by these problems?
            </p>

            {gad2Questions.map((question, index) => (
              <div key={index} className="mb-6">
                <p className="font-medium text-slate-700 mb-3">{index + 1}. {question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {gad2Options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => index === 0 ? setQ1(option.value) : setQ2(option.value)}
                      className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                        (index === 0 ? q1 : q2) === option.value
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitGAD2}
                disabled={q1 === null || q2 === null}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  q1 !== null && q2 !== null
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save Check-in (+25 points)
              </button>
              {currentWeekResponse && (
                <button
                  onClick={() => setShowGAD2Form(false)}
                  className="px-4 py-3 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* GAD-2 Trend */}
      {gad2History.length > 1 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Trend</h2>

          <div className="flex items-end gap-2 h-32">
            {gad2History.slice(0, 8).reverse().map((response, index) => {
              const heightPercent = (response.total / 6) * 100
              const interpretation = getScoreInterpretation(response.total)

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all ${
                      interpretation.color === 'text-green-600'
                        ? 'bg-green-400'
                        : interpretation.color === 'text-amber-600'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                    }`}
                    style={{ height: `${Math.max(heightPercent, 10)}%` }}
                  />
                  <span className="text-xs text-slate-400 mt-1">
                    {new Date(response.week_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="text-sm text-slate-500 mt-4 text-center">
            Lower bars indicate less anxiety
          </p>
        </section>
      )}

      {/* Panic Counter (Optional) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Panic Episodes</h2>
            <p className="text-sm text-slate-500">Optional tracking for panic attacks</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 py-4">
          <button
            onClick={() => handleUpdatePanic(-1)}
            disabled={todayPanic === 0}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${
              todayPanic === 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-300 text-slate-600 hover:border-teal-500 hover:text-teal-600'
            }`}
          >
            -
          </button>

          <div className="text-center">
            <div className="text-5xl font-bold text-slate-800">{todayPanic}</div>
            <div className="text-sm text-slate-500">today</div>
          </div>

          <button
            onClick={() => handleUpdatePanic(1)}
            className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center text-2xl font-bold text-slate-600 hover:border-teal-500 hover:text-teal-600"
          >
            +
          </button>
        </div>

        {/* Recent history */}
        {panicHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-2">Recent:</p>
            <div className="flex flex-wrap gap-2">
              {panicHistory.slice(0, 7).map((p, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                >
                  {new Date(p.date).toLocaleDateString(undefined, { weekday: 'short' })}: {p.count}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Note about tracking */}
      <p className="text-sm text-slate-500 mt-6 text-center">
        This information is private and not shared. Track only what feels helpful.
      </p>
    </div>
  )
}
