
import { Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, BrainCircuit, PenLine, Mic, BarChart3, ArrowRight, CheckCircle, Lock, Globe } from 'lucide-react'
import { useAuth } from '../state/auth'

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <main aria-label="Landing page">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/10 via-fuchsia-600/10 to-amber-600/10 p-6 md:p-10" aria-labelledby="hero-title">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="mb-2 text-xs tracking-widest uppercase text-indigo-600">Digital Well‑Being</p>
              <h1 id="hero-title" className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
                Emotion‑Aware Journaling
              </h1>
              <p className="opacity-80 text-lg">Write or speak your thoughts. Receive gentle, AI‑powered reflections on your emotional patterns — designed with privacy first and a calming, distraction‑free experience.</p>
              <div className="mt-6 flex flex-wrap gap-3" aria-label="Primary actions">
                {!isAuthenticated ? (
                  <>
                    <Link to="/signup" className="btn btn-primary focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Get started">
                      <Sparkles className="size-4 mr-2" /> Get started
                    </Link>
                    <Link to="/signin" className="btn btn-ghost focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Sign in">
                      I already have an account
                    </Link>
                  </>
                ) : (
                  <Link to="/app" className="btn btn-primary focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Open your journal">
                    <PenLine className="size-4 mr-2" /> Open your journal
                  </Link>
                )}
                <Link to="#how" className="btn btn-ghost" aria-label="Learn how it works">
                  Learn how it works <ArrowRight className="size-4 ml-2" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Trust badges">
                <span className="badge"><Lock className="size-3 mr-1" /> Privacy‑first</span>
                <span className="badge"><ShieldCheck className="size-3 mr-1" /> Local‑first</span>
                <span className="badge"><Globe className="size-3 mr-1" /> PWA‑ready</span>
              </div>
            </div>
            <div className="card">
              <img src="https://dummyimage.com/960x540/1f2937/fff&text=Emotion+Insights+Preview" alt="Preview of emotion insights radar chart" className="rounded-2xl w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="mx-auto max-w-5xl border-t border-[var(--divider)]" aria-hidden="true" />

        {/* Highlights */}
        <section aria-labelledby="highlights-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-6">
          <div className="flex items-end justify-between">
            <h2 id="highlights-title" className="text-3xl font-bold">Highlights</h2>
            <p className="text-sm opacity-70">Core features at a glance</p>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div tabIndex={0} className="card hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Write with focus" role="article">
              <div className="flex items-center gap-3">
                <PenLine className="size-5 text-indigo-600" />
                <p className="font-semibold">Write with focus</p>
              </div>
              <p className="text-sm opacity-80 mt-2">A clean editor for reflective writing with tags and emotion analysis.</p>
            </div>
            <div tabIndex={0} className="card hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Speak to journal" role="article">
              <div className="flex items-center gap-3">
                <Mic className="size-5 text-indigo-600" />
                <p className="font-semibold">Speak to journal</p>
              </div>
              <p className="text-sm opacity-80 mt-2">Voice recording and dictation turn thoughts into entries, hands‑free.</p>
            </div>
            <div tabIndex={0} className="card hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="See meaningful insights" role="article">
              <div className="flex items-center gap-3">
                <BarChart3 className="size-5 text-indigo-600" />
                <p className="font-semibold">See meaningful insights</p>
              </div>
              <p className="text-sm opacity-80 mt-2">Understand your emotional patterns with clear, accessible visualizations.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="mx-auto max-w-5xl border-t border-[var(--divider)]" aria-hidden="true" />

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-6">
          <h2 id="how-title" className="text-3xl font-bold">How it works</h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
          <ol className="grid md:grid-cols-3 gap-6 text-sm">
            <li className="card">
              <p className="font-semibold flex items-center gap-2"><span className="size-6 rounded-full bg-indigo-600/10 text-indigo-700 inline-flex items-center justify-center">1</span> Capture</p>
              <p className="opacity-80 mt-1">Write or record a voice note. Add tags to organize.</p>
            </li>
            <li className="card">
              <p className="font-semibold flex items-center gap-2"><span className="size-6 rounded-full bg-indigo-600/10 text-indigo-700 inline-flex items-center justify-center">2</span> Analyze</p>
              <p className="opacity-80 mt-1">Run emotion & sentiment analysis on text or audio.</p>
            </li>
            <li className="card">
              <p className="font-semibold flex items-center gap-2"><span className="size-6 rounded-full bg-indigo-600/10 text-indigo-700 inline-flex items-center justify-center">3</span> Reflect</p>
              <p className="opacity-80 mt-1">Review charts on your dashboard to notice changes over time.</p>
            </li>
          </ol>
        </section>

        {/* Divider */}
        <hr className="mx-auto max-w-5xl border-t border-[var(--divider)]" aria-hidden="true" />

        {/* Privacy & control */}
        <section aria-labelledby="privacy-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-6">
          <div className="flex items-end justify-between">
            <h2 id="privacy-title" className="text-3xl font-bold">Privacy & control</h2>
            <p className="text-sm opacity-70">Own your data; export or delete anytime</p>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-green-600" /> Local storage by default; you control exports and deletion.</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-green-600" /> Clear, transparent AI usage with configurable remote analysis.</li>
                <li className="flex items-center gap-2"><CheckCircle className="size-4 text-green-600" /> Designed with accessibility and gentle feedback loops.</li>
              </ul>
            </div>
            <div className="card">
              <div className="flex flex-wrap gap-3">
                <Link to="/journal/new" className="btn btn-primary focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Create your first entry"><PenLine className="size-4 mr-2" /> Create your first entry</Link>
                <Link to="/prompts" className="btn btn-ghost focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Browse prompts"><Sparkles className="size-4 mr-2" /> Browse prompts</Link>
              </div>
              <p className="text-xs opacity-60 mt-2">Data stays local unless you explicitly export or opt‑in to remote analysis.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="mx-auto max-w-5xl border-t border-[var(--divider)]" aria-hidden="true" />

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8 space-y-6">
          <h2 id="faq-title" className="text-3xl font-bold">FAQ</h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
          <div className="space-y-4">
            <details className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/70">
              <summary className="cursor-pointer font-semibold">Where is my data stored?</summary>
              <p className="mt-2 text-sm opacity-80">Your entries are stored locally in your browser. You can export JSON or clear entries at any time.</p>
            </details>
            <details className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/70">
              <summary className="cursor-pointer font-semibold">Does voice dictation work on all browsers?</summary>
              <p className="mt-2 text-sm opacity-80">Dictation uses the Web Speech API, supported in most Chromium browsers. If unsupported, you’ll see a clear notice.</p>
            </details>
            <details className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 p-4 bg-white/70 dark:bg-neutral-900/70">
              <summary className="cursor-pointer font-semibold">Is AI analysis always online?</summary>
              <p className="mt-2 text-sm opacity-80">Text/audio analysis can use a remote API when configured; otherwise, the prototype uses local approximations.</p>
            </details>
          </div>
        </section>
      </div>
    </main>
  )
}
