'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { checkProStatus, isDayAccessible, getPointsMultiplier } from '@/lib/entitlements'
import { getDayProgress, updateDayProgress, addPoints, getLocalData } from '@/lib/localStore'
import type { User } from '@supabase/supabase-js'

interface PathDay {
  day_number: number
  title: string
  free: boolean
  preview_md: string
}

interface PathLesson {
  id: string
  day_number: number
  content_md: string
  est_minutes: number
}

// Fallback content for when Supabase is not available
const fallbackDays: Record<number, PathDay> = {
  1: { day_number: 1, title: 'Understanding Anxiety', free: true, preview_md: 'Learn what anxiety actually is and why your body responds the way it does.' },
  2: { day_number: 2, title: 'The Anxiety Response', free: true, preview_md: 'Explore the fight-flight-freeze response and why it\'s actually trying to help you.' },
  3: { day_number: 3, title: 'Breathing Basics', free: true, preview_md: 'Introduction to diaphragmatic breathing - your first portable calming tool.' },
  4: { day_number: 4, title: 'Grounding Techniques', free: true, preview_md: 'Learn the 5-4-3-2-1 technique and other ways to anchor yourself in the present.' },
  5: { day_number: 5, title: 'Thought Awareness', free: true, preview_md: 'Begin noticing your thoughts without getting caught up in them.' },
  6: { day_number: 6, title: 'Self-Compassion Start', free: true, preview_md: 'Why being kind to yourself isn\'t weakness - it\'s science.' },
  7: { day_number: 7, title: 'Week 1 Review', free: true, preview_md: 'Consolidate what you\'ve learned and celebrate your progress.' }
}

const fallbackLessons: Record<number, string> = {
  1: `## What Is Anxiety?

Anxiety is your body's natural alarm system. When it senses potential danger, it activates to protect you. This response has kept humans alive for thousands of years.

**Key points:**
- Anxiety is normal and universal
- It becomes problematic when it's too frequent, intense, or disconnected from real threats
- Your brain can't always tell the difference between physical and social threats

**Practice:** Notice three times today when you feel any level of anxiety. Just notice - no judgment, no fixing. Simply acknowledge: "There's anxiety."`,
  2: `## Fight, Flight, Freeze

When your brain perceives threat, it triggers automatic responses:

- **Fight:** Tension, irritability, wanting to confront
- **Flight:** Urge to escape, restlessness, avoidance
- **Freeze:** Feeling stuck, mind going blank, numbness

These aren't choices - they're automatic survival responses.

**Practice:** Think about a recent anxious moment. Which response showed up? Again, no judgment - just curiosity.`,
  3: `## Breathing: Your Portable Reset

Slow, deep breathing signals safety to your nervous system. It's the one automatic function you can consciously control.

**Technique: 4-7-8 Breathing**
1. Inhale through nose for 4 counts
2. Hold for 7 counts
3. Exhale through mouth for 8 counts
4. Repeat 3-4 times

**Practice:** Try this technique once today, ideally when you're relatively calm.`,
  4: `## Grounding: Anchor to Now

Anxiety often pulls us into feared futures or regretted pasts. Grounding brings you back to the only moment that exists: now.

**5-4-3-2-1 Technique:**
- 5 things you can SEE
- 4 things you can TOUCH
- 3 things you can HEAR
- 2 things you can SMELL
- 1 thing you can TASTE

**Practice:** Use this technique once today. Notice how your anxiety level shifts.`,
  5: `## Thoughts Are Not Facts

Your mind generates thousands of thoughts daily. Many are automatic, repetitive, and not particularly accurate.

**Key insight:** You can observe your thoughts without believing them or acting on them.

**Practice:** When you notice an anxious thought today, try silently saying: "I notice I'm having the thought that..." This creates helpful distance.`,
  6: `## Self-Compassion: Not Weakness

Research shows self-criticism increases anxiety and depression, while self-compassion builds resilience.

**Three components:**
1. **Mindfulness:** Acknowledging difficulty without over-identifying
2. **Common humanity:** Remembering suffering is universal
3. **Self-kindness:** Treating yourself as you'd treat a friend

**Practice:** When you notice self-criticism today, pause and ask: "What would I say to a friend feeling this way?"`,
  7: `## Week 1: What You've Learned

Congratulations on completing your first week!

**You now know:**
- Anxiety is a normal protective response
- Fight-flight-freeze happens automatically
- Breathing can activate your calming system
- Grounding anchors you to the present
- Thoughts can be observed, not obeyed
- Self-compassion supports healing

**Review practice:** Which technique resonated most? Use it at least once today.`
}

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = use(params)
  const router = useRouter()
  const dayNumber = parseInt(day, 10)

  const [pathDay, setPathDay] = useState<PathDay | null>(null)
  const [lesson, setLesson] = useState<PathLesson | null>(null)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [practiceCompleted, setPracticeCompleted] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessible, setAccessible] = useState(true)

  useEffect(() => {
    async function loadData() {
      let userIsPro = false

      if (isSupabaseConfigured()) {
        // Check user and pro status
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

        if (userData.user) {
          const status = await checkProStatus(userData.user.id)
          userIsPro = status.isPro
          setIsPro(status.isPro)

          // Load progress from Supabase
          const { data: progressData } = await supabase
            .from('user_day_progress')
            .select('lesson_completed_at, practice_completed_at')
            .eq('user_id', userData.user.id)
            .eq('day_number', dayNumber)
            .single()

          if (progressData) {
            setLessonCompleted(!!progressData.lesson_completed_at)
            setPracticeCompleted(!!progressData.practice_completed_at)
          }
        } else {
          // Load progress from localStorage
          const localProgress = getDayProgress(dayNumber)
          if (localProgress) {
            setLessonCompleted(!!localProgress.lesson_completed_at)
            setPracticeCompleted(!!localProgress.practice_completed_at)
          }
        }

        // Load day content
        const { data: dayData } = await supabase
          .from('path_days')
          .select('*')
          .eq('day_number', dayNumber)
          .single()

        if (dayData) {
          setPathDay(dayData)
        } else if (fallbackDays[dayNumber]) {
          setPathDay(fallbackDays[dayNumber])
        }

        // Load lesson content
        const { data: lessonData } = await supabase
          .from('path_lessons')
          .select('*')
          .eq('day_number', dayNumber)
          .single()

        if (lessonData) {
          setLesson(lessonData)
        }
      } else {
        // Use fallback content
        if (fallbackDays[dayNumber]) {
          setPathDay(fallbackDays[dayNumber])
        }

        // Load progress from localStorage
        const localProgress = getDayProgress(dayNumber)
        if (localProgress) {
          setLessonCompleted(!!localProgress.lesson_completed_at)
          setPracticeCompleted(!!localProgress.practice_completed_at)
        }
      }

      // Check accessibility
      const canAccess = isDayAccessible(dayNumber, userIsPro)
      setAccessible(canAccess)
      setLoading(false)
    }

    loadData()
  }, [dayNumber])

  const handleCompleteLesson = async () => {
    const now = new Date().toISOString()
    const multiplier = getPointsMultiplier(isPro)
    const points = 15 * multiplier

    if (user && isSupabaseConfigured()) {
      await supabase.from('user_day_progress').upsert({
        user_id: user.id,
        day_number: dayNumber,
        lesson_completed_at: now
      }, { onConflict: 'user_id,day_number' })

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
        reason: `Completed Day ${dayNumber} lesson`,
        delta: points
      })
    } else {
      updateDayProgress({
        day_number: dayNumber,
        lesson_completed_at: now
      })
      addPoints(points, `Completed Day ${dayNumber} lesson`)
    }

    setLessonCompleted(true)
  }

  const handleCompletePractice = async () => {
    const now = new Date().toISOString()
    const multiplier = getPointsMultiplier(isPro)
    const points = 20 * multiplier

    if (user && isSupabaseConfigured()) {
      await supabase.from('user_day_progress').upsert({
        user_id: user.id,
        day_number: dayNumber,
        practice_completed_at: now
      }, { onConflict: 'user_id,day_number' })

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
        reason: `Completed Day ${dayNumber} practice`,
        delta: points
      })
    } else {
      updateDayProgress({
        day_number: dayNumber,
        practice_completed_at: now
      })
      addPoints(points, `Completed Day ${dayNumber} practice`)
    }

    setPracticeCompleted(true)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!pathDay) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Day not found</h1>
        <Link href="/path" className="text-teal-600 hover:text-teal-700">
          Return to Path
        </Link>
      </div>
    )
  }

  // Show paywall for locked content
  if (!accessible) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/path" className="text-teal-600 hover:text-teal-700 text-sm mb-4 inline-block">
          &larr; Back to Path
        </Link>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Day {dayNumber}: {pathDay.title}
          </h1>

          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            {pathDay.preview_md}
          </p>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-slate-800 mb-2">Unlock with Pro</h3>
            <p className="text-sm text-slate-600 mb-4">
              Days 8-30 are part of the Pro plan. Upgrade to continue your journey.
            </p>
            <Link
              href="/account"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const lessonContent = lesson?.content_md || fallbackLessons[dayNumber] || pathDay.preview_md

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/path" className="text-teal-600 hover:text-teal-700 text-sm mb-4 inline-block">
        &larr; Back to Path
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
            Day {dayNumber}
          </span>
          {practiceCompleted && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Complete
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{pathDay.title}</h1>
      </div>

      {/* Lesson content */}
      <div className="prose prose-slate max-w-none mb-8">
        {lessonContent.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('## ', '')}</h2>
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-semibold text-slate-700">{line.replace(/\*\*/g, '')}</p>
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="text-slate-600 ml-4">{line.replace('- ', '')}</li>
          }
          if (line.trim()) {
            return <p key={i} className="text-slate-600 mb-3">{line}</p>
          }
          return null
        })}
      </div>

      {/* Completion buttons */}
      <div className="border-t border-slate-200 pt-8 space-y-4">
        <button
          onClick={handleCompleteLesson}
          disabled={lessonCompleted}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            lessonCompleted
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {lessonCompleted ? 'Lesson Complete' : 'Mark Lesson Complete (+15 points)'}
        </button>

        <button
          onClick={handleCompletePractice}
          disabled={practiceCompleted || !lessonCompleted}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            practiceCompleted
              ? 'bg-green-100 text-green-700 cursor-default'
              : !lessonCompleted
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {practiceCompleted
            ? 'Practice Complete'
            : !lessonCompleted
              ? 'Complete lesson first'
              : 'Mark Practice Complete (+20 points)'
          }
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-slate-200">
        {dayNumber > 1 ? (
          <Link
            href={`/path/day/${dayNumber - 1}`}
            className="text-teal-600 hover:text-teal-700"
          >
            &larr; Day {dayNumber - 1}
          </Link>
        ) : <span />}

        {dayNumber < 30 && (
          <Link
            href={`/path/day/${dayNumber + 1}`}
            className="text-teal-600 hover:text-teal-700"
          >
            Day {dayNumber + 1} &rarr;
          </Link>
        )}
      </div>
    </div>
  )
}
