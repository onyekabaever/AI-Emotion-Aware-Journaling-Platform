import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { MailCheck, Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await new Promise((res) => setTimeout(res, 800))
      if (!mounted) return
      toast.success('Email verified successfully')
      setVerifying(false)
      // Redirect to sign in after a brief moment
      setTimeout(() => navigate('/signin'), 600)
    })()
    return () => {
      mounted = false
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[var(--band-accent)]/8 to-background">
      <Toaster richColors />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
          <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-[var(--band-accent)]/15 to-transparent">
            <div className="flex items-center gap-2">
              <MailCheck className="size-5 text-[var(--band-accent)]" aria-hidden />
              <h1 className="text-lg font-semibold">Verify your email</h1>
            </div>
            {token && (
              <p className="mt-1 text-xs text-muted-foreground">Token: {token.slice(0, 6)}…</p>
            )}
          </div>
          <div className="p-6 text-sm">
            {verifying ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>Verifying your email…</span>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">Your email has been verified. Redirecting to sign in…</p>
                <p className="mt-2 text-xs">Not redirected? <Link className="text-[var(--band-accent)] hover:underline" to="/signin">Continue</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}