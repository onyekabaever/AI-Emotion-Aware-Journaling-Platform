
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useJournal } from '../state/journal'
import { useAuth } from '../state/auth'
import EmotionBadge from '../components/EmotionBadge'
import EmotionChart from '../components/EmotionChart'

export default function Dashboard() {
  const { entries, tagCloud } = useJournal()
  const { user } = useAuth()

  const latest = entries.slice(0, 5)
  const total = entries.length
  const tags = tagCloud()
  const uniqueTags = Object.keys(tags).length
  const lastEntryAt = entries[0]?.createdAt

  const overall = useMemo(() => {
    const acc: any = { joy:0, sadness:0, anger:0, fear:0, surprise:0, neutral:0 }
    let n = 0
    entries.forEach(e => {
      if (!e.emotion) return
      n++
      Object.keys(acc).forEach(k => acc[k] += (e.emotion as any)[k] || 0)
    })
    if (n>0) Object.keys(acc).forEach(k => acc[k] = acc[k]/n)
    return acc
  }, [entries])

  const streakDays = useMemo(() => {
    if (entries.length === 0) return 0
    const keyForDate = (d: Date) => d.toISOString().split('T')[0]
    const days = new Set(entries.map(e => keyForDate(new Date(e.createdAt))))
    let streak = 0
    const cursor = new Date()
    while (days.has(keyForDate(cursor))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  }, [entries])

  const last7Count = useMemo(() => {
    const now = Date.now()
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    return entries.filter(e => now - new Date(e.createdAt).getTime() <= sevenDaysMs).length
  }, [entries])

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section aria-labelledby="overview-title" className="rounded-3xl border border-[var(--band-border)] bg-gradient-to-br from-[var(--band-from)] via-[var(--band-accent)] to-[var(--band-to)] p-6 md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 id="overview-title" className="text-2xl md:text-3xl font-bold">{user?.name ? `Welcome back, ${user.name}` : 'Your journal dashboard'}</h1>
            <p className="text-sm opacity-70">Quick glance at your activity and mood</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/journal/new" className="btn btn-primary" aria-label="Create new entry">New entry</Link>
            <Link to="/prompts" className="btn btn-ghost" aria-label="Browse prompts">Browse prompts</Link>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card" aria-label="Total entries">
            <p className="text-xs opacity-70">Entries</p>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs opacity-70 mt-1">{last7Count} in last 7 days</p>
          </div>
          <div className="card" aria-label="Writing streak">
            <p className="text-xs opacity-70">Streak</p>
            <p className="text-2xl font-bold">{streakDays} day{streakDays === 1 ? '' : 's'}</p>
            <p className="text-xs opacity-70 mt-1">Consecutive days with entries</p>
          </div>
          <div className="card" aria-label="Unique tags">
            <p className="text-xs opacity-70">Tags</p>
            <p className="text-2xl font-bold">{uniqueTags}</p>
            <p className="text-xs opacity-70 mt-1">Organize and explore themes</p>
          </div>
          <div className="card" aria-label="Last entry">
            <p className="text-xs opacity-70">Last entry</p>
            <p className="text-lg font-semibold">{lastEntryAt ? new Date(lastEntryAt).toLocaleString() : '—'}</p>
            <p className="text-xs opacity-70 mt-1">Most recent update</p>
          </div>
        </div>
        {total === 0 && (
          <div className="mt-6">
            <div className="card">
              <p className="font-semibold">You don’t have any entries yet.</p>
              <p className="text-sm opacity-80">Start with a new entry or pick a prompt to get inspired.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link to="/journal/new" className="btn btn-primary">Create entry</Link>
                <Link to="/prompts" className="btn btn-ghost">Browse prompts</Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card" aria-labelledby="recent-title">
          <h2 id="recent-title" className="text-xl font-bold mb-3">Recent entries</h2>
          <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800">
            {latest.length === 0 && <p className="opacity-70">No entries yet. <Link to="/journal/new" className="underline">Create your first journal</Link>.</p>}
            {latest.map(e => (
              <Link key={e.id} to={`/journal/${e.id}`} className="block py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-xl px-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{e.title || 'Untitled'}</p>
                    <p className="text-sm opacity-70">{new Date(e.createdAt).toLocaleString()}</p>
                    {e.tags?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {e.tags.slice(0, 4).map(t => <span key={t} className="badge">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <EmotionBadge emotion={e.emotion} />
                </div>
                {e.content && <p className="mt-2 text-sm opacity-80 line-clamp-2">{e.content}</p>}
              </Link>
            ))}
          </div>
        </section>

        <aside className="card space-y-3" aria-labelledby="insights-title">
          <h2 id="insights-title" className="text-xl font-bold">Emotion insights</h2>
          <EmotionChart emotion={overall} />
          <ul className="space-y-1 text-sm">
            <li>Total entries: <b>{total}</b></li>
            <li>Unique tags: <b>{uniqueTags}</b></li>
            <li>Last 7 days: <b>{last7Count}</b></li>
          </ul>
        </aside>

        <section className="lg:col-span-3 card" aria-labelledby="quick-title">
          <h2 id="quick-title" className="text-xl font-bold mb-3">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/journal/new" className="btn btn-primary">New entry</Link>
            <Link to="/prompts" className="btn btn-ghost">Browse prompts</Link>
            <Link to="/export" className="btn btn-ghost">Export data</Link>
            <Link to="/settings" className="btn btn-ghost">Settings</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
