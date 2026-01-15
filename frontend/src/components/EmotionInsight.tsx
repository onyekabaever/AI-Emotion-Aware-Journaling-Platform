import { EmotionScores } from '../types'

type Props = {
  emotion?: EmotionScores
  sentiment?: number | null
  mode?: 'text' | 'voice'
}

const sentimentLabel = (score?: number | null) => {
  if (score == null) return 'No AI feedback yet'
  if (score > 0.25) return 'Mostly positive'
  if (score < -0.25) return 'Mostly negative'
  return 'Mixed / neutral'
}

const modeLabel = (mode?: 'text' | 'voice') => {
  if (mode === 'voice') return 'your voice in this recording'
  if (mode === 'text') return 'your writing in this entry'
  return 'this entry'
}

export default function EmotionInsight({ emotion, sentiment, mode }: Props) {
  if (!emotion) {
    return <p className="text-sm opacity-70">No AI feedback yet. Add some text or a recording, then request feedback.</p>
  }

  const entries = Object.entries(emotion)
  const sorted = [...entries].sort((a, b) => b[1] - a[1])
  const [primaryKey, primaryVal] = sorted[0] || []
  const secondary = sorted[1]

  const primaryPct = Math.round((primaryVal || 0) * 100)
  const secondaryPct = secondary ? Math.round(secondary[1] * 100) : 0

  const tone = sentimentLabel(sentiment)

  return (
    <div className="space-y-3 text-sm">
      <p>
        <span className="font-medium">Overall tone:</span> {tone.toLowerCase()}.
      </p>

      {primaryKey && (
        <p>
          <span className="font-medium">Strongest emotion:</span> {primaryKey} ({primaryPct}%).
          {secondary && secondaryPct >= 15 && (
            <>
              {' '}A noticeable amount of {secondary[0]} ({secondaryPct}%) also appears.
            </>
          )}
        </p>
      )}

      <div className="space-y-1" aria-label="Emotion breakdown">
        {sorted.map(([key, value]) => {
          const pct = Math.round(value * 100)
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-20 text-xs capitalize opacity-80">{key}</span>
              <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800" aria-hidden="true">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-xs text-right opacity-70">{pct}%</span>
            </div>
          )
        })}
      </div>

      <p className="text-xs opacity-70">
        This is an approximation of how {modeLabel(mode)} may come across emotionally. It is not a diagnosis.
      </p>
    </div>
  )
}
