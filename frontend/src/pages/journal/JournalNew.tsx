import { Link, useLocation } from 'react-router-dom'
import { PenLine, Mic } from 'lucide-react'

export default function JournalNew() {
  const location = useLocation() as any
  const prompt = location?.state?.prompt

  return (
    <div className="space-y-6">
      <section aria-labelledby="mode-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-4">
        <div>
          <h1 id="mode-title" className="text-2xl md:text-3xl font-bold">Choose journaling mode</h1>
          <p className="text-sm opacity-70">Pick text or voice capture to start your entry</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/journal/new/text" state={prompt ? { prompt } : undefined} className="card hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Start text journaling">
            <div className="flex items-center gap-3">
              <PenLine className="size-5 text-indigo-600" aria-hidden />
              <p className="font-semibold">Text journaling</p>
            </div>
            <p className="text-sm opacity-80 mt-2">Write with tags, dictation, and emotion analysis from text.</p>
            <span className="btn btn-primary mt-3">Start</span>
          </Link>
          <Link to="/journal/new/voice" className="card hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Start voice journaling">
            <div className="flex items-center gap-3">
              <Mic className="size-5 text-indigo-600" aria-hidden />
              <p className="font-semibold">Voice journaling</p>
            </div>
            <p className="text-sm opacity-80 mt-2">Record audio and analyze emotion from voice. Add tags.</p>
            <span className="btn btn-primary mt-3">Start</span>
          </Link>
        </div>
      </section>
    </div>
  )
}