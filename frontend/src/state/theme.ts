
import { create } from 'zustand'

type Theme = 'light' | 'dark'
interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const getInitial = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: getInitial(),
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme: next })
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
    localStorage.setItem('theme', next)
  }
}))

if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', getInitial() === 'dark')
}
