import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { Toaster, toast } from 'sonner'

function estimateStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})

  const strength = estimateStrength(password)

  function validate() {
    const e: { password?: string; confirm?: string } = {}
    if (!password || password.length < 8) {
      e.password = 'Password must be at least 8 characters.'
    }
    if (password && !/[A-Z]/.test(password)) {
      e.password = (e.password ? e.password + ' ' : '') + 'Include an uppercase letter.'
    }
    if (password && !/\d/.test(password)) {
      e.password = (e.password ? e.password + ' ' : '') + 'Include a number.'
    }
    if (confirm !== password) {
      e.confirm = 'Passwords do not match.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Simulate API call to reset password with token
      await new Promise((res) => setTimeout(res, 800))
      toast.success('Password reset successfully. Please sign in.')
      navigate('/signin')
    } catch (err) {
      toast.error('Could not reset password. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const strengthLabels = ['Very weak', 'Weak', 'Okay', 'Strong', 'Very strong']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[var(--band-accent)]/8 to-background">
      <Toaster richColors />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
          <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-[var(--band-accent)]/15 to-transparent">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[var(--band-accent)]" aria-hidden />
              <h1 className="text-lg font-semibold">Reset your password</h1>
            </div>
            {token && (
              <p className="mt-1 text-xs text-muted-foreground">Token: {token.slice(0, 6)}…</p>
            )}
          </div>
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <label className="block text-sm font-medium" htmlFor="password">
              New password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[var(--band-accent)]/40"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-destructive mt-1">
                {errors.password}
              </p>
            )}

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Strength</span>
                <span className="font-medium">{strengthLabels[strength]}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    strength <= 1
                      ? 'bg-destructive/80 w-1/5'
                      : strength === 2
                      ? 'bg-yellow-500/80 w-2/5'
                      : strength === 3
                      ? 'bg-[var(--band-accent)]/80 w-3/5'
                      : 'bg-emerald-500/80 w-full'
                  }`}
                />
              </div>
            </div>

            <label className="block text-sm font-medium" htmlFor="confirm">
              Confirm password
            </label>
            <div className="relative mt-1">
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--band-accent)]/40"
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                placeholder="••••••••"
              />
              <Lock className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
            </div>
            {errors.confirm && (
              <p id="confirm-error" className="text-xs text-destructive mt-1">
                {errors.confirm}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--band-accent)] px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>

            <p className="mt-3 text-xs text-muted-foreground">
              Remembered it? <Link to="/signin" className="text-[var(--band-accent)] hover:underline">Back to sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}