'use client'

import { useState, useEffect } from 'react'
import { restSuggestions } from '@/lib/protocols'

interface RestProtocolProps {
  onComplete: (durationSec: number) => void
  onCancel: () => void
}

export default function RestProtocol({ onComplete, onCancel }: RestProtocolProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime] = useState(Date.now())

  // Randomize order on mount
  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * restSuggestions.length))
  }, [])

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % restSuggestions.length)
  }

  const handleComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000)
    onComplete(duration)
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Rest Protocol</h2>
      <p className="text-slate-600 mb-8 text-center">
        Sometimes the kindest thing is to do nothing at all.
      </p>

      <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl p-8 mb-8 w-full min-h-[200px] flex items-center justify-center">
        <p className="text-xl text-slate-700 text-center leading-relaxed">
          {restSuggestions[currentIndex]}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={handleNext}
          className="w-full bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-xl text-lg font-medium hover:bg-slate-50"
        >
          Another suggestion
        </button>
        <button
          onClick={handleComplete}
          className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-teal-700"
        >
          I&apos;m feeling better
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 text-slate-600 hover:text-slate-800"
        >
          Back to protocols
        </button>
      </div>
    </div>
  )
}
