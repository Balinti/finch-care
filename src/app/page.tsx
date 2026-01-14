import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            A safety-first anxiety companion
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            In-the-moment resets and gentle skill-building &mdash; no streaks, no shame.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/regulate"
              className="bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20"
            >
              Try it now &mdash; Free
            </Link>
            <Link
              href="/path"
              className="bg-white text-teal-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-teal-600 hover:bg-teal-50"
            >
              Start the 30-day Path
            </Link>
          </div>

          <p className="text-sm text-slate-500">
            No account required to start. Your progress is saved locally.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
            What Finch Care offers
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Co-Regulation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Co-Regulation Mode
              </h3>
              <p className="text-slate-600">
                Always-free, 1-tap access to breathing exercises, grounding techniques, and cognitive tools.
              </p>
            </div>

            {/* 30-Day Path */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                30-Day Skills Path
              </h3>
              <p className="text-slate-600">
                Evidence-based lessons and practices. Days 1-7 free, then unlock more with Pro.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Gentle Progress Tracking
              </h3>
              <p className="text-slate-600">
                Weekly check-ins and optional panic counter. No streaks, no pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Our approach
          </h2>
          <div className="space-y-4 text-slate-600">
            <p>
              Finch Care is built on the principle that anxiety management should be <strong>accessible</strong>, <strong>pressure-free</strong>, and <strong>safe</strong>.
            </p>
            <p>
              We believe in positive reinforcement only. No streaks to maintain, no penalties for missed days. Just gentle tools that are there when you need them.
            </p>
            <p>
              Start using the app immediately &mdash; no account required. Create a free account when you want to save your progress across devices.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-rose-800 mb-2">Important Notice</h3>
                <p className="text-rose-700 text-sm mb-3">
                  Finch Care is not a substitute for professional medical advice, diagnosis, or treatment. It is not intended for use in emergencies.
                </p>
                <Link
                  href="/crisis"
                  className="inline-flex items-center text-rose-700 font-medium text-sm hover:text-rose-800"
                >
                  If you&apos;re in crisis, get help now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
