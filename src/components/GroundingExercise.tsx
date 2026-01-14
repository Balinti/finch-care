'use client'

import { useState, useEffect } from 'react'
import { groundingPrompts } from '@/lib/protocols'

interface GroundingExerciseProps {
  onComplete: (durationSec: number) => void
  onCancel: () => void
}

type Sense = 'see' | 'touch' | 'hear' | 'smell' | 'taste'

const senseOrder: { sense: Sense; count: number }[] = [
  { sense: 'see', count: 5 },
  { sense: 'touch', count: 4 },
  { sense: 'hear', count: 3 },
  { sense: 'smell', count: 2 },
  { sense: 'taste', count: 1 }
]

const senseLabels: Record<Sense, string> = {
  see: 'SEE',
  touch: 'TOUCH',
  hear: 'HEAR',
  smell: 'SMELL',
  taste: 'TASTE'
}

const senseColors: Record<Sense, string> = {
  see: 'bg-blue-500',
  touch: 'bg-purple-500',
  hear: 'bg-green-500',
  smell: 'bg-amber-500',
  taste: 'bg-rose-500'
}

export default function GroundingExercise({ onComplete, onCancel }: GroundingExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentItem, setCurrentItem] = useState(0)
  const [startTime] = useState(Date.now())

  const current = senseOrder[currentIndex]
  const prompts = groundingPrompts[current.sense]
  const prompt = prompts[currentItem % prompts.length]

  const handleNext = () => {
    if (currentItem < current.count - 1) {
      setCurrentItem((i) => i + 1)
    } else if (currentIndex < senseOrder.length - 1) {
      setCurrentIndex((i) => i + 1)
      setCurrentItem(0)
    } else {
      const duration = Math.round((Date.now() - startTime) / 1000)
      onComplete(duration)
    }
  }

  const totalItems = senseOrder.reduce((sum, s) => sum + s.count, 0)
  const completedItems = senseOrder
    .slice(0, currentIndex)
    .reduce((sum, s) => sum + s.count, 0) + currentItem

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedItems / totalItems) * 100}%` }}
        />
      </div>

      {/* Sense badge */}
      <div
        className={`${senseColors[current.sense]} text-white px-4 py-2 rounded-full text-sm font-medium mb-6`}
      >
        {current.count - currentItem} things you can {senseLabels[current.sense]}
      </div>

      {/* Prompt */}
      <div className="text-center mb-8">
        <p className="text-xl text-slate-700 mb-4">{prompt}</p>
        <p className="text-slate-500 text-sm">
          Take a moment to notice. When ready, tap &quot;Found one&quot;
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleNext}
          className={`${senseColors[current.sense]} text-white px-6 py-4 rounded-xl text-lg font-medium hover:opacity-90 transition-opacity`}
        >
          Found one
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Stop early
        </button>
      </div>
    </div>
  )
}
