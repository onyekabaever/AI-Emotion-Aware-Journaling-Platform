import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function ProviderCallback() {
  const { provider } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await new Promise((res) => setTimeout(res, 700))
      if (!mounted) return
      toast.success(`${provider ?? 'Provider'} connected`)
      setTimeout(() => navigate('/signin'), 600)
    })()
    return () => {
      mounted = false
    }
  }, [navigate, provider])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[var(--band-accent)]/8 to-background">
      <Toaster richColors />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
          <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-[var(--band-accent)]/15 to-transparent">
            <div className="flex items-center gap-2">
              <ExternalLink className="size-5 text-[var(--band-accent)]" aria-hidden />
              <h1 className="text-lg font-semibold">{provider ? `${provider} callback` : 'OAuth callback'}</h1>
            </div>
          </div>
          <div className="p-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>Finalizing authentication…</span>
            </div>
            <p className="mt-2 text-xs">If this takes too long, <Link className="text-[var(--band-accent)] hover:underline" to="/signin">continue</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}