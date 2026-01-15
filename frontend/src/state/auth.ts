
import axios from 'axios'
import { create } from 'zustand'
import { toast } from 'sonner'

interface AuthState {
  isAuthenticated: boolean
  user?: { id: string; username: string; email: string }
  signIn: (username: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string) => Promise<void>
  signOut: () => void
  refreshAccessToken: () => Promise<void>
}

const API_BASE =
  (import.meta.env.VITE_AUTH_API_BASE as string | undefined) ??
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  'http://localhost:8000/api'

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: Boolean(
    localStorage.getItem('access_token') || localStorage.getItem('auth_token')
  ),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : undefined,
  async signIn(username, password) {
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login/`, {
        username,
        password,
      })

      const access = data.access as string
      const refresh = data.refresh as string

      if (!access || !refresh) {
        throw new Error('Invalid token response from server')
      }

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      // Keep legacy key so existing checks continue to work
      localStorage.setItem('auth_token', access)

      const meRes = await axios.get(`${API_BASE}/auth/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      })

      const user = meRes.data as { id: string; username: string; email: string }
      localStorage.setItem('user', JSON.stringify(user))
      set({ isAuthenticated: true, user })
    } catch (error) {
      // Let callers handle errors for UI feedback
      throw error
    }
  },
  async signUp(username, email, password) {
    try {
      // Create the user account
      await axios.post(`${API_BASE}/auth/register/`, {
        username,
        email,
        password,
      })

      // Immediately log the user in to obtain tokens
      const { data } = await axios.post(`${API_BASE}/auth/login/`, {
        username,
        password,
      })

      const access = data.access as string
      const refresh = data.refresh as string

      if (!access || !refresh) {
        throw new Error('Invalid token response from server')
      }

      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('auth_token', access)

      const meRes = await axios.get(`${API_BASE}/auth/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      })

      const user = meRes.data as { id: string; username: string; email: string }
      localStorage.setItem('user', JSON.stringify(user))
      set({ isAuthenticated: true, user })
    } catch (error) {
      throw error
    }
  },
  signOut() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: undefined })
  },
  async refreshAccessToken() {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) {
      // No refresh token available – treat as logged out
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      set({ isAuthenticated: false, user: undefined })
      throw new Error('No refresh token available')
    }

    try {
      const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, {
        refresh,
      })

      const newAccess = data.access as string | undefined
      const newRefresh = (data.refresh as string | undefined) ?? refresh

      if (!newAccess) {
        throw new Error('Invalid refresh response from server')
      }

      localStorage.setItem('access_token', newAccess)
      localStorage.setItem('auth_token', newAccess)
      localStorage.setItem('refresh_token', newRefresh)

      // Keep existing user info but ensure auth flag stays true
      set((state) => ({ ...state, isAuthenticated: true }))
    } catch (error) {
      // On any refresh failure, fully sign the user out
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      set({ isAuthenticated: false, user: undefined })
      toast.error('Your session has expired. Please sign in again.')
      throw error
    }
  },
}))
