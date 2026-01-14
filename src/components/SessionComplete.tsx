'use client'

import { useState } from 'react'
import { symptomTags } from '@/lib/protocols'

interface SessionCompleteProps {
  protocol: string
  durationSec: number
  onSubmit: (helpedScore: number, tags: string[]) => void
}

export default function SessionComplete({ protocol, durationSec, onSubmit }: SessionCompleteProps) {
  const [helpedScore, setHelpedScore] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    if (helpedScore !== null) {
      onSubmit(helpedScore, selectedTags)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }

  const helpedLabels = [
    { score: 0, label: 'Not at all', emoji: '' },
    { score: 1, label: 'A little', emoji: '' },
    { score: 2, label: 'Somewhat', emoji: '' },
    { score: 3, label: 'A lot', emoji: '' }
  ]

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Session Complete</h2>
      <p className="text-slate-600 mb-6">
        {formatDuration(durationSec)} of {protocol.replace('-', ' ')}
      </p>

      {/* Helped score */}
      <div className="w-full mb-6">
        <p className="text-slate-700 mb-4 text-center">Did this help?</p>
        <div className="grid grid-cols-4 gap-2">
          {helpedLabels.map(({ score, label }) => (
            <button
              key={score}
              onClick={() => setHelpedScore(score)}
              className={`p-3 rounded-xl border text-center transition-colors ${
                helpedScore === score
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-slate-200 hover:border-teal-300 text-slate-600'
              }`}
            >
              <div className="text-2xl mb-1">{score}</div>
              <div className="text-xs">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional symptom tags */}
      {helpedScore !== null && (
        <div className="w-full mb-6">
          <button
            onClick={() => setShowTags(!showTags)}
            className="text-sm text-teal-600 hover:text-teal-700 mb-3"
          >
            {showTags ? 'Hide' : '+ Add'} symptom tags (optional)
          </button>

          {showTags && (
            <div className="flex flex-wrap gap-2">
              {symptomTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 hover:border-teal-300 text-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={helpedScore === null}
        className={`w-full px-6 py-4 rounded-xl text-lg font-medium ${
          helpedScore !== null
            ? 'bg-teal-600 text-white hover:bg-teal-700'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Save & Continue
      </button>
    </div>
  )
}
