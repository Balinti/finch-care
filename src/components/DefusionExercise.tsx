'use client'

import { useState } from 'react'
import { defusionThoughts } from '@/lib/protocols'

interface DefusionExerciseProps {
  onComplete: (durationSec: number) => void
  onCancel: () => void
}

export default function DefusionExercise({ onComplete, onCancel }: DefusionExerciseProps) {
  const [step, setStep] = useState<'select' | 'reframe' | 'practice'>('select')
  const [selectedThought, setSelectedThought] = useState<number | null>(null)
  const [selectedReframe, setSelectedReframe] = useState<number | null>(null)
  const [startTime] = useState(Date.now())

  const handleSelectThought = (index: number) => {
    setSelectedThought(index)
    setStep('reframe')
  }

  const handleSelectReframe = (index: number) => {
    setSelectedReframe(index)
    setStep('practice')
  }

  const handleComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000)
    onComplete(duration)
  }

  if (step === 'select') {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Cognitive Defusion</h2>
        <p className="text-slate-600 mb-8 text-center">
          Which anxious thought is showing up right now?
        </p>

        <div className="w-full space-y-3 mb-6">
          {defusionThoughts.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelectThought(index)}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <span className="text-slate-700">&quot;{item.thought}&quot;</span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="px-6 py-3 text-slate-600 hover:text-slate-800"
        >
          Back
        </button>
      </div>
    )
  }

  if (step === 'reframe' && selectedThought !== null) {
    const thought = defusionThoughts[selectedThought]

    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Name the Thought</h2>
        <p className="text-slate-600 mb-4 text-center">
          Instead of: &quot;{thought.thought}&quot;
        </p>
        <p className="text-slate-600 mb-8 text-center">
          Try noticing it differently. Choose a reframe:
        </p>

        <div className="w-full space-y-3 mb-6">
          {thought.reframes.map((reframe, index) => (
            <button
              key={index}
              onClick={() => handleSelectReframe(index)}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors"
            >
              <span className="text-slate-700">&quot;{reframe}&quot;</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep('select')}
          className="px-6 py-3 text-slate-600 hover:text-slate-800"
        >
          Choose a different thought
        </button>
      </div>
    )
  }

  if (step === 'practice' && selectedThought !== null && selectedReframe !== null) {
    const thought = defusionThoughts[selectedThought]
    const reframe = thought.reframes[selectedReframe]

    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Practice</h2>
        <p className="text-slate-600 mb-8 text-center">
          Take a moment to say this to yourself, either silently or out loud:
        </p>

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-8 w-full">
          <p className="text-xl text-teal-800 text-center italic">
            &quot;{reframe}&quot;
          </p>
        </div>

        <p className="text-slate-500 text-sm mb-8 text-center">
          Notice how this creates a little distance from the thought. The thought is still there, but you&apos;re observing it rather than being consumed by it.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleComplete}
            className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-teal-700"
          >
            Done
          </button>
          <button
            onClick={() => {
              setSelectedReframe(null)
              setStep('reframe')
            }}
            className="px-6 py-3 text-slate-600 hover:text-slate-800"
          >
            Try another reframe
          </button>
        </div>
      </div>
    )
  }

  return null
}
