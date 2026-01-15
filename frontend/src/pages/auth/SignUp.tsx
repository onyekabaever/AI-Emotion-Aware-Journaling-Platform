
import { useState } from 'react'
import { useAuth } from '../../state/auth'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function SignUp() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirm?: string }>({})

  const validate = () => {
    const next: typeof errors = {}
    if (!username.trim()) next.username = 'Please enter a username.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    if (confirm !== password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await signUp(username.trim(), email.trim(), password)
      toast.success('Account created')
      nav('/app')
    } catch (err) {
      toast.error('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(password)

  return (
    <section className="max-w-md mx-auto rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
        <p className="text-sm opacity-80">Local‑first prototype. Your data stays in your browser unless you export.</p>
      </header>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="username" className="text-sm font-medium">Username</label>
          <div className="relative mt-1">
            <input
              id="username"
              className="input w-full pr-10"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              required
            />
            <User className="size-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
          </div>
          {errors.username && <p id="username-error" className="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">{errors.username}</p>}
        </div>

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

        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              className="input w-full pr-20"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : 'password-help'}
              required
            />
            <Lock className="size-4 absolute right-12 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              className="btn btn-ghost absolute right-1 top-1/2 -translate-y-1/2 px-2"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {!errors.password && (
            <p id="password-help" className="mt-1 text-xs opacity-70">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
          )}
          {errors.password && <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">{errors.password}</p>}

          <div className="mt-2 grid grid-cols-4 gap-1" aria-label="Password strength meter">
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className={`h-1 rounded-full ${i < strength ? 'bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)]' : 'bg-neutral-200 dark:bg-neutral-800'}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
          <div className="relative mt-1">
            <input
              id="confirm"
              className="input w-full pr-10"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={errors.confirm ? 'confirm-error' : undefined}
              required
            />
            <Lock className="size-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
          </div>
          {errors.confirm && <p id="confirm-error" className="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">{errors.confirm}</p>}
        </div>

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="text-sm opacity-70">
          Already have an account? <Link to="/signin" className="underline">Sign in</Link>
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
          <ShieldCheck className="size-4" />
          <p>Local‑first prototype: data is stored in your browser. You can export or clear it anytime.</p>
        </div>
      </form>
    </section>
  )
}
