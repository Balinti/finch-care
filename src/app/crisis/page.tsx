'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLocalData, setLocalData } from '@/lib/localStore'

interface CrisisLine {
  country: string
  code: string
  lines: {
    name: string
    phone?: string
    text?: string
    url?: string
  }[]
}

const crisisLines: CrisisLine[] = [
  {
    country: 'United States',
    code: 'US',
    lines: [
      { name: '988 Suicide & Crisis Lifeline', phone: '988', text: '988' },
      { name: 'Crisis Text Line', text: 'HOME to 741741' },
      { name: 'SAMHSA National Helpline', phone: '1-800-662-4357' }
    ]
  },
  {
    country: 'United Kingdom',
    code: 'UK',
    lines: [
      { name: 'Samaritans', phone: '116 123' },
      { name: 'SHOUT', text: 'SHOUT to 85258' },
      { name: 'Mind Infoline', phone: '0300 123 3393' }
    ]
  },
  {
    country: 'Canada',
    code: 'CA',
    lines: [
      { name: 'Talk Suicide Canada', phone: '1-833-456-4566', text: '45645' },
      { name: 'Crisis Services Canada', phone: '1-833-456-4566' }
    ]
  },
  {
    country: 'Australia',
    code: 'AU',
    lines: [
      { name: 'Lifeline Australia', phone: '13 11 14' },
      { name: 'Beyond Blue', phone: '1300 22 4636' }
    ]
  },
  {
    country: 'International',
    code: 'INT',
    lines: [
      { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
      { name: 'Find a Helpline', url: 'https://findahelpline.com/' }
    ]
  }
]

export default function CrisisPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('US')

  useEffect(() => {
    // Load saved country preference
    const data = getLocalData()
    if (data.countryCode) {
      setSelectedCountry(data.countryCode)
    }
  }, [])

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code)
    setLocalData({ countryCode: code })
  }

  const selectedLines = crisisLines.find(c => c.code === selectedCountry)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Emergency banner */}
      <div className="bg-rose-600 text-white rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">If you&apos;re in immediate danger</h1>
            <p className="text-rose-100">
              Call your local emergency number (911 in the US, 999 in the UK, 000 in Australia) or go to your nearest emergency room.
            </p>
          </div>
        </div>
      </div>

      {/* Country selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select your location
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        >
          {crisisLines.map((country) => (
            <option key={country.code} value={country.code}>
              {country.country}
            </option>
          ))}
        </select>
      </div>

      {/* Crisis lines */}
      {selectedLines && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Crisis Support - {selectedLines.country}
          </h2>
          <div className="space-y-4">
            {selectedLines.lines.map((line, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <h3 className="font-medium text-slate-800 mb-2">{line.name}</h3>
                <div className="space-y-2">
                  {line.phone && (
                    <a
                      href={`tel:${line.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call {line.phone}
                    </a>
                  )}
                  {line.text && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Text: {line.text}
                    </div>
                  )}
                  {line.url && (
                    <a
                      href={line.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional resources */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">What to Expect</h2>
        <div className="bg-slate-50 rounded-xl p-6 space-y-4 text-slate-600">
          <p>
            <strong className="text-slate-800">Crisis lines are confidential.</strong> Trained counselors are available 24/7 to listen and help.
          </p>
          <p>
            <strong className="text-slate-800">You don&apos;t need to be suicidal to call.</strong> These lines support anyone in emotional distress.
          </p>
          <p>
            <strong className="text-slate-800">It&apos;s okay to feel nervous.</strong> The person on the other end wants to help and won&apos;t judge you.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="font-semibold text-amber-800 mb-2">Important</h2>
        <p className="text-amber-700 text-sm mb-3">
          Finch Care is not a crisis intervention service. This app is designed for general anxiety management and skill-building, not emergency situations.
        </p>
        <p className="text-amber-700 text-sm">
          If you are having thoughts of self-harm or suicide, please reach out to a crisis line immediately or go to your nearest emergency room.
        </p>
      </section>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-teal-600 hover:text-teal-700">
          &larr; Back to Finch Care
        </Link>
      </div>
    </div>
  )
}
