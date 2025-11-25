import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-neutral-800" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-10 bg-gradient-to-r from-[var(--band-accent)]/8 to-transparent">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="font-semibold">Emotion Journal</p>
            <span className="mt-2 block h-1 w-8 bg-[var(--band-accent)]/60 rounded-full" aria-hidden />
            <p className="opacity-70 mt-2">Research prototype for digital well‑being. Local‑first storage with export & deletion, and gentle AI reflections.</p>
          </div>
          <div aria-labelledby="footer-product">
            <p id="footer-product" className="font-semibold">Product</p>
            <span className="mt-2 block h-1 w-8 bg-[var(--band-accent)]/60 rounded-full" aria-hidden />
            <ul className="mt-2 space-y-2">
              <li><NavLink to="/app" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Dashboard</NavLink></li>
              <li><NavLink to="/journal" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Journal</NavLink></li>
              <li><NavLink to="/insights" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Insights</NavLink></li>
              <li><NavLink to="/search" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Search</NavLink></li>
            </ul>
          </div>
          <div aria-labelledby="footer-resources">
            <p id="footer-resources" className="font-semibold">Resources</p>
            <span className="mt-2 block h-1 w-8 bg-[var(--band-accent)]/60 rounded-full" aria-hidden />
            <ul className="mt-2 space-y-2">
              <li><NavLink to="/prompts" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Prompts</NavLink></li>
              <li><NavLink to="/export" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Export</NavLink></li>
              <li><NavLink to="/settings" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Settings</NavLink></li>
            </ul>
          </div>
          <div aria-labelledby="footer-account">
            <p id="footer-account" className="font-semibold">Account</p>
            <span className="mt-2 block h-1 w-8 bg-[var(--band-accent)]/60 rounded-full" aria-hidden />
            <ul className="mt-2 space-y-2">
              <li><NavLink to="/signin" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Sign in</NavLink></li>
              <li><NavLink to="/signup" className="underline-hover transition-colors hover:text-[var(--band-accent)]">Create account</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs opacity-60">© {new Date().getFullYear()} Emotion Journal — Research prototype for digital well‑being.</div>
      </div>
    </footer>
  )
}