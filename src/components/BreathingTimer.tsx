'use client'

import { useState, useEffect, useCallback } from 'react'

interface BreathingTimerProps {
  pattern: {
    inhale: number
    hold?: number
    hold1?: number
    exhale: number
    hold2?: number
    cycles: number
  }
  onComplete: (durationSec: number) => void
  onCancel: () => void
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'hold2' | 'complete'

export default function BreathingTimer({ pattern, onComplete, onCancel }: BreathingTimerProps) {
  const [phase, setPhase] = useState<Phase>('inhale')
  const [timeLeft, setTimeLeft] = useState(pattern.inhale)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [totalElapsed, setTotalElapsed] = useState(0)

  const getHoldDuration = useCallback(() => {
    return pattern.hold ?? pattern.hold1 ?? 0
  }, [pattern])

  const getHold2Duration = useCallback(() => {
    return pattern.hold2 ?? 0
  }, [pattern])

  useEffect(() => {
    if (phase === 'complete') {
      onComplete(totalElapsed)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === 'inhale') {
            const holdDuration = getHoldDuration()
            if (holdDuration > 0) {
              setPhase('hold')
              return holdDuration
            } else {
              setPhase('exhale')
              return pattern.exhale
            }
          } else if (phase === 'hold') {
            setPhase('exhale')
            return pattern.exhale
          } else if (phase === 'exhale') {
            const hold2Duration = getHold2Duration()
            if (hold2Duration > 0) {
              setPhase('hold2')
              return hold2Duration
            } else if (currentCycle < pattern.cycles) {
              setCurrentCycle((c) => c + 1)
              setPhase('inhale')
              return pattern.inhale
            } else {
              setPhase('complete')
              return 0
            }
          } else if (phase === 'hold2') {
            if (currentCycle < pattern.cycles) {
              setCurrentCycle((c) => c + 1)
              setPhase('inhale')
              return pattern.inhale
            } else {
              setPhase('complete')
              return 0
            }
          }
        }
        return prev - 1
      })
      setTotalElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, currentCycle, pattern, onComplete, totalElapsed, getHoldDuration, getHold2Duration])

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
      case 'hold2':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      default:
        return ''
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500'
      case 'hold':
      case 'hold2':
        return 'bg-purple-500'
      case 'exhale':
        return 'bg-teal-500'
      default:
        return 'bg-slate-500'
    }
  }

  const getCircleScale = () => {
    if (phase === 'inhale') {
      return 1 + (1 - timeLeft / pattern.inhale) * 0.3
    } else if (phase === 'exhale') {
      return 1.3 - (1 - timeLeft / pattern.exhale) * 0.3
    }
    return 1.15
  }

  return (
    <div className="flex flex-col items-center">
      {/* Breathing circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <div
          className={`absolute rounded-full ${getPhaseColor()} opacity-20 transition-transform duration-1000`}
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${getCircleScale()})`
          }}
        />
        <div
          className={`absolute rounded-full ${getPhaseColor()} opacity-30 transition-transform duration-1000`}
          style={{
            width: '80%',
            height: '80%',
            transform: `scale(${getCircleScale()})`
          }}
        />
        <div className="z-10 text-center">
          <div className="text-5xl font-light text-slate-700 mb-2">{timeLeft}</div>
          <div className="text-xl text-slate-600 font-medium">{getPhaseLabel()}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="text-center mb-8">
        <div className="text-slate-500">
          Cycle {currentCycle} of {pattern.cycles}
        </div>
      </div>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="px-6 py-3 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
      >
        Stop early
      </button>
    </div>
  )
}
