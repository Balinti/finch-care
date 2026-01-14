'use client'

import { useState, useEffect } from 'react'

export default function WorryTimeBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [worryTime, setWorryTime] = useState<Date | null>(null)

  useEffect(() => {
    const checkWorryTime = () => {
      if (typeof window === 'undefined') return

      const stored = localStorage.getItem('finchCare:worryTime')
      if (!stored) {
        setShowBanner(false)
        return
      }

      const time = new Date(stored)
      const now = new Date()

      // Show banner if within 5 minutes of worry time
      const diff = time.getTime() - now.getTime()
      if (diff <= 5 * 60 * 1000 && diff > -30 * 60 * 1000) {
        setWorryTime(time)
        setShowBanner(true)
      } else if (diff <= -30 * 60 * 1000) {
        // Clear if more than 30 minutes past
        localStorage.removeItem('finchCare:worryTime')
        setShowBanner(false)
      } else {
        setShowBanner(false)
      }
    }

    checkWorryTime()
    const interval = setInterval(checkWorryTime, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    localStorage.removeItem('finchCare:worryTime')
    setShowBanner(false)
  }

  if (!showBanner || !worryTime) return null

  const now = new Date()
  const isPast = worryTime <= now

  return (
    <div className={`${isPast ? 'bg-amber-500' : 'bg-teal-500'} text-white px-4 py-3`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {isPast
              ? 'It\'s your scheduled worry time. Take a few minutes to address your concerns.'
              : `Worry time in ${Math.round((worryTime.getTime() - now.getTime()) / 60000)} minutes`
            }
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
