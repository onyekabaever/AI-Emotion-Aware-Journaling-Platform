import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function CheckEmail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[var(--band-accent)]/8 to-background">
      <Toaster richColors />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 rounded-xl border border-border/60 bg-card/70 backdrop-blur">
          <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-[var(--band-accent)]/15 to-transparent">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-[var(--band-accent)]" aria-hidden />
              <h1 className="text-lg font-semibold">Check your email</h1>
            </div>
          </div>
          <div className="p-6 text-sm">
            <p className="text-muted-foreground">
              We sent you an email with instructions. Follow the link inside to continue.
            </p>
            <p className="mt-3 text-xs">
              Didn’t get it? Check spam or request again from the <Link to="/forgot" className="text-[var(--band-accent)] hover:underline">Forgot Password</Link> page.
            </p>
            <p className="mt-3 text-xs">
              Ready? <Link to="/signin" className="text-[var(--band-accent)] hover:underline">Return to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}