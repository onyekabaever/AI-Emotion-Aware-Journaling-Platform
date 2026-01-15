
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JournalEntry } from '../types'

type State = {
  entries: JournalEntry[]
  setEntries: (entries: JournalEntry[]) => void
  upsert: (e: JournalEntry) => void
  remove: (id: string) => void
  clearAll: () => void
  byId: (id: string) => JournalEntry | undefined
  search: (q: string) => JournalEntry[]
  tagCloud: () => Record<string, number>
}

export const useJournal = create<State>()(persist((set, get) => ({
  entries: [],
  setEntries(entries) {
    set({ entries })
  },
  upsert(e) {
    set(s => {
      const i = s.entries.findIndex(x => x.id === e.id)
      if (i >= 0) {
        const next = [...s.entries]
        next[i] = e
        return { entries: next }
      }
      return { entries: [e, ...s.entries] }
    })
  },
  remove(id) {
    set(s => ({ entries: s.entries.filter(e => e.id !== id) }))
  },
  clearAll() {
    set({ entries: [] })
  },
  byId(id) {
    return get().entries.find(e => e.id === id)
  },
  search(q) {
    const k = q.toLowerCase()
    return get().entries.filter(e => e.title.toLowerCase().includes(k) || e.content.toLowerCase().includes(k) || e.tags.some(t => t.toLowerCase().includes(k)))
  },
  tagCloud() {
    const m: Record<string, number> = {}
    get().entries.forEach(e => e.tags.forEach(t => m[t] = (m[t]||0)+1))
    return m
  }
}), { name: 'ejournal' }))
