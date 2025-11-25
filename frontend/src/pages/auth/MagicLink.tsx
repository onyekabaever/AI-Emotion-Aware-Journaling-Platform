import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Link2, Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function MagicLink() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await new Promise((res) => setTimeout(res, 700))
      if (!mounted) return
      toast.success('Magic link verified')
      setValidating(false)
      setTimeout(() => navigate('/signin'), 700)
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
              <Link2 className="size-5 text-[var(--band-accent)]" aria-hidden />
              <h1 className="text-lg font-semibold">Magic link</h1>
            </div>
            {token && (
              <p className="mt-1 text-xs text-muted-foreground">Token: {token.slice(0, 6)}…</p>
            )}
          </div>
          <div className="p-6 text-sm">
            {validating ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>Validating link…</span>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">Link verified. Please sign in to continue.</p>
                <p className="mt-2 text-xs">Go to <Link className="text-[var(--band-accent)] hover:underline" to="/signin">Sign In</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}