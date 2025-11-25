
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts'
import { EmotionScores } from '../types'

export default function EmotionChart({ emotion }: { emotion?: EmotionScores }) {
  if (!emotion) return <div className="text-sm opacity-70">No emotion data yet.</div>
  const data = Object.entries(emotion).map(([k, v]) => ({ emotion: k, score: Number((v*100).toFixed(1)) }))
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="emotion" />
          <Tooltip />
          <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
