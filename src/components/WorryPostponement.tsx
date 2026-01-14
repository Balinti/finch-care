'use client'

import { useState, useEffect } from 'react'

interface WorryPostponementProps {
  onComplete: (durationSec: number) => void
  onCancel: () => void
}

export default function WorryPostponement({ onComplete, onCancel }: WorryPostponementProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [startTime] = useState(Date.now())

  // Check for existing worry time reminder
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('finchCare:worryTime')
      if (existing) {
        const worryTime = new Date(existing)
        if (worryTime > new Date()) {
          setSelectedTime(worryTime.toISOString())
        }
      }
    }
  }, [])

  const timeOptions = [
    { label: 'In 30 minutes', minutes: 30 },
    { label: 'In 1 hour', minutes: 60 },
    { label: 'In 2 hours', minutes: 120 },
    { label: 'Tomorrow at 10am', minutes: null, specific: true }
  ]

  const handleSelectTime = (option: typeof timeOptions[0]) => {
    let time: Date

    if (option.specific) {
      // Tomorrow at 10am
      time = new Date()
      time.setDate(time.getDate() + 1)
      time.setHours(10, 0, 0, 0)
    } else if (option.minutes) {
      time = new Date()
      time.setMinutes(time.getMinutes() + option.minutes)
    } else {
      return
    }

    setSelectedTime(time.toISOString())
    localStorage.setItem('finchCare:worryTime', time.toISOString())
  }

  const handleConfirm = () => {
    setConfirmed(true)
  }

  const handleComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000)
    onComplete(duration)
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (confirmed) {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Worry Time Set</h2>

        <p className="text-slate-600 mb-2 text-center">
          Your worry time is scheduled for:
        </p>

        <div className="bg-slate-100 rounded-xl px-6 py-3 mb-6">
          <p className="text-lg font-medium text-slate-800">
            {selectedTime && formatTime(selectedTime)}
          </p>
        </div>

        <p className="text-slate-500 text-sm mb-8 text-center">
          Until then, when worries arise, gently remind yourself: &quot;I&apos;ll address this at my worry time.&quot;
          <br /><br />
          You&apos;ll see a reminder banner at the top of the app when it&apos;s time.
        </p>

        <button
          onClick={handleComplete}
          className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-teal-700"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Worry Postponement</h2>
      <p className="text-slate-600 mb-8 text-center">
        Schedule a specific time to address your worries. Until then, give yourself permission to set them aside.
      </p>

      <div className="w-full space-y-3 mb-6">
        {timeOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectTime(option)}
            className={`w-full text-left p-4 bg-white border rounded-xl transition-colors ${
              selectedTime && formatTime(selectedTime).includes(option.label.split(' ').slice(-2).join(' '))
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-200 hover:border-teal-500 hover:bg-teal-50'
            }`}
          >
            <span className="text-slate-700">{option.label}</span>
          </button>
        ))}
      </div>

      {selectedTime && (
        <div className="w-full mb-6">
          <p className="text-sm text-slate-500 mb-4 text-center">
            Selected: {formatTime(selectedTime)}
          </p>
          <button
            onClick={handleConfirm}
            className="w-full bg-teal-600 text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-teal-700"
          >
            Confirm Worry Time
          </button>
        </div>
      )}

      <button
        onClick={onCancel}
        className="px-6 py-3 text-slate-600 hover:text-slate-800"
      >
        Back
      </button>
    </div>
  )
}
