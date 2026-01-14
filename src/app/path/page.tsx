'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { checkProStatus, isDayAccessible } from '@/lib/entitlements'
import { getLocalData } from '@/lib/localStore'
import type { User } from '@supabase/supabase-js'

interface PathDay {
  day_number: number
  title: string
  free: boolean
}

interface DayProgress {
  day_number: number
  lesson_completed_at: string | null
  practice_completed_at: string | null
}

// Static path days data (used when Supabase is not available or as fallback)
const staticPathDays: PathDay[] = Array.from({ length: 30 }, (_, i) => ({
  day_number: i + 1,
  title: `Day ${i + 1}`,
  free: i < 7
}))

export default function PathPage() {
  const [pathDays, setPathDays] = useState<PathDay[]>(staticPathDays)
  const [progress, setProgress] = useState<DayProgress[]>([])
  const [isPro, setIsPro] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Load path days from Supabase if available
      if (isSupabaseConfigured()) {
        const { data: days } = await supabase
          .from('path_days')
          .select('day_number, title, free')
          .order('day_number')

        if (days && days.length > 0) {
          setPathDays(days)
        }

        // Check user and pro status
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

        if (userData.user) {
          const status = await checkProStatus(userData.user.id)
          setIsPro(status.isPro)

          // Load progress from Supabase
          const { data: progressData } = await supabase
            .from('user_day_progress')
            .select('day_number, lesson_completed_at, practice_completed_at')
            .eq('user_id', userData.user.id)

          if (progressData) {
            setProgress(progressData)
          }
        } else {
          // Load progress from localStorage
          const localData = getLocalData()
          setProgress(localData.dayProgress.map(p => ({
            day_number: p.day_number,
            lesson_completed_at: p.lesson_completed_at || null,
            practice_completed_at: p.practice_completed_at || null
          })))
        }
      } else {
        // Load progress from localStorage only
        const localData = getLocalData()
        setProgress(localData.dayProgress.map(p => ({
          day_number: p.day_number,
          lesson_completed_at: p.lesson_completed_at || null,
          practice_completed_at: p.practice_completed_at || null
        })))
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const getDayStatus = (dayNumber: number) => {
    const dayProgress = progress.find(p => p.day_number === dayNumber)
    if (dayProgress?.practice_completed_at) return 'complete'
    if (dayProgress?.lesson_completed_at) return 'in-progress'
    return 'not-started'
  }

  const completedDays = progress.filter(p => p.practice_completed_at).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">30-Day Anxiety Skills Path</h1>
        <p className="text-slate-600 mb-4">
          Evidence-based lessons and practices to build lasting skills
        </p>
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm">
          <span className="font-medium">{completedDays} of 30 days complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedDays / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
        {pathDays.map((day) => {
          const status = getDayStatus(day.day_number)
          const accessible = isDayAccessible(day.day_number, isPro)
          const isLocked = !accessible

          return (
            <Link
              key={day.day_number}
              href={`/path/day/${day.day_number}`}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all
                ${status === 'complete'
                  ? 'bg-teal-100 border-teal-500 text-teal-700'
                  : status === 'in-progress'
                    ? 'bg-amber-50 border-amber-400 text-amber-700'
                    : isLocked
                      ? 'bg-slate-100 border-slate-300 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400'
                }
              `}
            >
              <span className="text-lg font-bold">{day.day_number}</span>
              {status === 'complete' && (
                <svg className="w-4 h-4 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {isLocked && (
                <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </Link>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-teal-500" />
          <span className="text-slate-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-400" />
          <span className="text-slate-600">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-slate-200" />
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-200" />
          <span className="text-slate-600">Locked (Pro)</span>
        </div>
      </div>

      {/* Pro upsell for non-pro users */}
      {!isPro && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Unlock Days 8-30</h3>
              <p className="text-sm text-slate-600">
                Continue your journey with advanced techniques and deeper practices.
              </p>
            </div>
            <Link
              href="/account"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 whitespace-nowrap"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
