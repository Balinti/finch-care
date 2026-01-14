import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-600 text-sm">
              Finch Care is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              If you are in crisis, please contact emergency services or a crisis helpline.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/crisis" className="text-rose-600 hover:text-rose-700 text-sm font-medium">
              Crisis Help
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-700 text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
