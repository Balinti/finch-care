'use client'

import Link from 'next/link'
import { useState } from 'react'
import GoogleAuth from './GoogleAuth'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-teal-700">
          Finch Care
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/regulate" className="text-slate-600 hover:text-teal-700">
            Reset
          </Link>
          <Link href="/path" className="text-slate-600 hover:text-teal-700">
            Path
          </Link>
          <Link href="/progress" className="text-slate-600 hover:text-teal-700">
            Progress
          </Link>
          <Link href="/rewards" className="text-slate-600 hover:text-teal-700">
            Rewards
          </Link>
          <Link href="/crisis" className="text-rose-600 hover:text-rose-700 font-medium">
            Crisis Help
          </Link>
          <GoogleAuth />
        </div>
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="flex flex-col px-4 py-3 gap-3">
            <Link
              href="/regulate"
              className="text-slate-600 hover:text-teal-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Reset
            </Link>
            <Link
              href="/path"
              className="text-slate-600 hover:text-teal-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Path
            </Link>
            <Link
              href="/progress"
              className="text-slate-600 hover:text-teal-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              href="/rewards"
              className="text-slate-600 hover:text-teal-700 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Rewards
            </Link>
            <Link
              href="/crisis"
              className="text-rose-600 hover:text-rose-700 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Crisis Help
            </Link>
            <div className="border-t border-slate-200 pt-3">
              <GoogleAuth />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
