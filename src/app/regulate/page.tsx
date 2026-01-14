'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { protocols, breathingPatterns } from '@/lib/protocols'
import { addSession, addPoints, getLocalData } from '@/lib/localStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { checkProStatus, getPointsMultiplier } from '@/lib/entitlements'
import BreathingTimer from '@/components/BreathingTimer'
import GroundingExercise from '@/components/GroundingExercise'
import DefusionExercise from '@/components/DefusionExercise'
import WorryPostponement from '@/components/WorryPostponement'
import RestProtocol from '@/components/RestProtocol'
import SessionComplete from '@/components/SessionComplete'
import type { User } from '@supabase/supabase-js'

type Stage = 'picker' | 'breathing-select' | 'breathing' | 'grounding' | 'defusion' | 'worry' | 'rest' | 'complete'

export default function RegulatePage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('picker')
  const [selectedProtocol, setSelectedProtocol] = useState<string>('')
  const [breathingPattern, setBreathingPattern] = useState<keyof typeof breathingPatterns>('4-7-8')
  const [sessionDuration, setSessionDuration] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(async ({ data }) => {
        setUser(data.user)
        if (data.user) {
          const status = await checkProStatus(data.user.id)
          setIsPro(status.isPro)
        }
      })
    }
  }, [])

  const handleSelectProtocol = (protocolId: string) => {
    setSelectedProtocol(protocolId)

    switch (protocolId) {
      case 'panic-breathing':
        setStage('breathing-select')
        break
      case '5-4-3-2-1':
        setStage('grounding')
        break
      case 'defusion':
        setStage('defusion')
        break
      case 'worry-postpone':
        setStage('worry')
        break
      case 'rest':
        setStage('rest')
        break
    }
  }

  const handleSelectBreathing = (pattern: keyof typeof breathingPatterns) => {
    setBreathingPattern(pattern)
    setStage('breathing')
  }

  const handleExerciseComplete = (durationSec: number) => {
    setSessionDuration(durationSec)
    setStage('complete')
  }

  const handleExerciseCancel = () => {
    setStage('picker')
    setSelectedProtocol('')
  }

  const handleSessionSubmit = async (helpedScore: number, symptomTags: string[]) => {
    const sessionId = crypto.randomUUID()
    const startedAt = new Date(Date.now() - sessionDuration * 1000).toISOString()

    // Calculate points
    const multiplier = getPointsMultiplier(isPro)
    const basePoints = 10
    const points = basePoints * multiplier

    if (user && isSupabaseConfigured()) {
      // Save to Supabase
      await supabase.from('regulation_sessions').insert({
        id: sessionId,
        user_id: user.id,
        started_at: startedAt,
        protocol: selectedProtocol,
        duration_sec: sessionDuration,
        helped_score: helpedScore,
        symptom_tags: symptomTags
      })

      // Update wallet
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
        reason: `Completed ${selectedProtocol} session`,
        delta: points
      })
    } else {
      // Save to localStorage
      addSession({
        id: sessionId,
        started_at: startedAt,
        protocol: selectedProtocol,
        duration_sec: sessionDuration,
        helped_score: helpedScore,
        symptom_tags: symptomTags
      })

      addPoints(points, `Completed ${selectedProtocol} session`)
    }

    router.push('/')
  }

  // Protocol picker
  if (stage === 'picker') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Co-Regulation Mode</h1>
          <p className="text-slate-600">Choose a technique to help you reset right now</p>
        </div>

        <div className="space-y-4">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => handleSelectProtocol(protocol.id)}
              className="w-full text-left p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{protocol.name}</h3>
                  <p className="text-slate-600 text-sm">{protocol.description}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                  {protocol.duration}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          These techniques are always free, unlimited use.
        </p>
      </div>
    )
  }

  // Breathing pattern selector
  if (stage === 'breathing-select') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Choose a Breathing Pattern</h1>
          <p className="text-slate-600">Select what feels right for you</p>
        </div>

        <div className="space-y-3">
          {(Object.entries(breathingPatterns) as [keyof typeof breathingPatterns, typeof breathingPatterns['4-7-8']][]).map(([key, pattern]) => (
            <button
              key={key}
              onClick={() => handleSelectBreathing(key)}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 transition-colors"
            >
              <div className="font-medium text-slate-800">{pattern.name}</div>
              <div className="text-sm text-slate-500">
                Inhale {pattern.inhale}s
                {'hold' in pattern && pattern.hold ? ` • Hold ${pattern.hold}s` : ''}
                {'hold1' in pattern && pattern.hold1 ? ` • Hold ${pattern.hold1}s` : ''}
                {' • '}Exhale {pattern.exhale}s
                {'hold2' in pattern && pattern.hold2 ? ` • Hold ${pattern.hold2}s` : ''}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStage('picker')}
          className="w-full mt-6 px-4 py-3 text-slate-600 hover:text-slate-800"
        >
          Back to protocols
        </button>
      </div>
    )
  }

  // Breathing exercise
  if (stage === 'breathing') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <BreathingTimer
          pattern={breathingPatterns[breathingPattern]}
          onComplete={handleExerciseComplete}
          onCancel={handleExerciseCancel}
        />
      </div>
    )
  }

  // Grounding exercise
  if (stage === 'grounding') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <GroundingExercise
          onComplete={handleExerciseComplete}
          onCancel={handleExerciseCancel}
        />
      </div>
    )
  }

  // Defusion exercise
  if (stage === 'defusion') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <DefusionExercise
          onComplete={handleExerciseComplete}
          onCancel={handleExerciseCancel}
        />
      </div>
    )
  }

  // Worry postponement
  if (stage === 'worry') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <WorryPostponement
          onComplete={handleExerciseComplete}
          onCancel={handleExerciseCancel}
        />
      </div>
    )
  }

  // Rest protocol
  if (stage === 'rest') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <RestProtocol
          onComplete={handleExerciseComplete}
          onCancel={handleExerciseCancel}
        />
      </div>
    )
  }

  // Session complete
  if (stage === 'complete') {
    const protocolName = protocols.find(p => p.id === selectedProtocol)?.name || selectedProtocol
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <SessionComplete
          protocol={protocolName}
          durationSec={sessionDuration}
          onSubmit={handleSessionSubmit}
        />
      </div>
    )
  }

  return null
}
