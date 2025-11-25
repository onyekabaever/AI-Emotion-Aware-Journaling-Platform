import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, PenSquare, BarChart3, Search, Settings as SettingsIcon, Home, AudioWaveform, Menu, X } from 'lucide-react'
import { useTheme } from '../state/theme'
import { useAuth } from '../state/auth'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Close mobile nav on route change
    setMobileOpen(false)
  }, [location.pathname])

  const linkClass = (isActive: boolean) =>
    `btn btn-ghost ${isActive ? 'text-foreground bg-[var(--band-accent)]/20 ring-1 ring-[var(--band-accent)]/30 font-medium' : ''}`

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70">
      {/* Skip link for accessibility */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-card focus:px-3 focus:py-1 focus:rounded-md">Skip to content</a>

      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Accent band header row */}
        <div className="rounded-lg bg-gradient-to-r from-[var(--band-accent)]/12 to-transparent px-3 py-2">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-base md:text-lg font-bold" aria-label="Go to home">
              Emotion Journal
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-2" aria-label="Primary navigation">
              <NavLink to="/" className={({ isActive }) => linkClass(isActive)}><Home className="size-4 mr-2" /> Home</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/app" className={({ isActive }) => linkClass(isActive)}><BarChart3 className="size-4 mr-2" /> Dashboard</NavLink>
                  <NavLink to="/journal" className={({ isActive }) => linkClass(isActive)}><PenSquare className="size-4 mr-2" /> Journal</NavLink>
                  <NavLink to="/insights" className={({ isActive }) => linkClass(isActive)}><BarChart3 className="size-4 mr-2" /> Insights</NavLink>
                  <NavLink to="/search" className={({ isActive }) => linkClass(isActive)}><Search className="size-4 mr-2" /> Search</NavLink>
                </>
              )}
            </nav>

            {/* Spacer + actions */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="btn btn-ghost rounded-full focus:ring-2 focus:ring-[var(--band-accent)]/40"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              {isAuthenticated ? (
                <>
                  <NavLink to="/journal/new" className="btn btn-primary"><AudioWaveform className="size-4 mr-2" /> New entry</NavLink>
                  <NavLink to="/settings" className={({ isActive }) => linkClass(isActive)}><SettingsIcon className="size-4 mr-2" /> Settings</NavLink>
                  <button onClick={signOut} className="btn btn-ghost">Sign out</button>
                </>
              ) : (
                <>
                  <NavLink to="/signin" className="btn btn-primary">Sign in</NavLink>
                  <NavLink to="/signup" className={({ isActive }) => linkClass(isActive)}>Create account</NavLink>
                </>
              )}

              {/* Mobile toggle */}
              <button
                className="md:hidden btn btn-ghost"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="primary-nav"
                onClick={() => setMobileOpen((s) => !s)}
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav panel */}
        <div
          id="primary-nav"
          className={`${mobileOpen ? 'grid' : 'hidden'} md:hidden grid-cols-1 gap-2 mt-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800 bg-card/80 backdrop-blur p-3`}
        >
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}><Home className="size-4 mr-2" /> Home</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/app" className={({ isActive }) => linkClass(isActive)}><BarChart3 className="size-4 mr-2" /> Dashboard</NavLink>
              <NavLink to="/journal" className={({ isActive }) => linkClass(isActive)}><PenSquare className="size-4 mr-2" /> Journal</NavLink>
              <NavLink to="/insights" className={({ isActive }) => linkClass(isActive)}><BarChart3 className="size-4 mr-2" /> Insights</NavLink>
              <NavLink to="/search" className={({ isActive }) => linkClass(isActive)}><Search className="size-4 mr-2" /> Search</NavLink>
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-1" />
              <NavLink to="/settings" className={({ isActive }) => linkClass(isActive)}><SettingsIcon className="size-4 mr-2" /> Settings</NavLink>
              <button onClick={signOut} className="btn btn-ghost">Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={({ isActive }) => `btn btn-primary ${isActive ? 'ring-2 ring-[var(--band-accent)]/40' : ''}`}>Sign in</NavLink>
              <NavLink to="/signup" className={({ isActive }) => linkClass(isActive)}>Create account</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}