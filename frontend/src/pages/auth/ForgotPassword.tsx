import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, ShieldCheck } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validate = () => {
    const next: typeof errors = {}
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      // Prototype: simulate network request
      await new Promise(res => setTimeout(res, 600))
      toast.success('If an account exists, a reset link was sent')
      navigate('/check-email')
    } catch (err) {
      toast.error('Failed to request reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Forgot your password?</h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
        <p className="text-sm opacity-80">Enter your email; we’ll send a reset link if an account exists.</p>
      </header>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <div className="relative mt-1">
            <input
              id="email"
              className="input w-full pr-10"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            <Mail className="size-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
          </div>
          {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">{errors.email}</p>}
        </div>

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Sending link…' : 'Send reset link'}
        </button>

        <p className="text-sm opacity-70">
          Remembered it? <Link to="/signin" className="underline">Back to sign in</Link>
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
          <ShieldCheck className="size-4" />
          <p>Local‑first prototype: data is stored in your browser. You can export or clear it anytime.</p>
        </div>
      </form>
    </section>
  )
}