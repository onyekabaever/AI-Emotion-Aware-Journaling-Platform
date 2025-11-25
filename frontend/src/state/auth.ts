
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user?: { id: string; name: string; email: string }
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: Boolean(localStorage.getItem('auth_token')),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : undefined,
  async signIn(email, password) {
    // Placeholder: integrate with backend later
    const fakeToken = 'dev-token'
    localStorage.setItem('auth_token', fakeToken)
    const user = { id: 'u1', name: email.split('@')[0], email }
    localStorage.setItem('user', JSON.stringify(user))
    set({ isAuthenticated: true, user })
  },
  async signUp(name, email, password) {
    const fakeToken = 'dev-token'
    localStorage.setItem('auth_token', fakeToken)
    const user = { id: 'u1', name, email }
    localStorage.setItem('user', JSON.stringify(user))
    set({ isAuthenticated: true, user })
  },
  signOut() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: undefined })
  }
}))
