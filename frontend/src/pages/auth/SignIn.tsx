
import { useState } from 'react'
import { useAuth } from '../../state/auth'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function SignIn() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const validate = () => {
    const next: typeof errors = {}
    if (!username.trim()) next.username = 'Enter your username.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await signIn(username.trim(), password)
      toast.success('Signed in')
      nav('/app')
    } catch (err) {
      toast.error('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Sign in to your account</h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] rounded-full" aria-hidden="true" />
        <p className="text-sm opacity-80">Welcome back. Your data stays local unless you export.</p>
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
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              id="password"
              className="input w-full pr-20"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
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
          {errors.password && <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400" aria-live="polite">{errors.password}</p>}
          <p className="text-sm mt-2"><Link to="/forgot" className="underline">Forgot password?</Link></p>
        </div>

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Signing in…' : 'Continue'}
        </button>

        <p className="text-sm opacity-70">
          No account? <Link to="/signup" className="underline">Create one</Link>
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
          <ShieldCheck className="size-4" />
          <p>Local‑first prototype: data is stored in your browser. You can export or clear it anytime.</p>
        </div>
      </form>
    </section>
  )
}
