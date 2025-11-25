
import { EmotionScores } from '../types'

const colorFor = (e: string) => {
  switch (e) {
    case 'joy': return 'bg-yellow-100 text-yellow-800'
    case 'sadness': return 'bg-blue-100 text-blue-800'
    case 'anger': return 'bg-red-100 text-red-800'
    case 'fear': return 'bg-purple-100 text-purple-800'
    case 'surprise': return 'bg-pink-100 text-pink-800'
    case 'neutral': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function EmotionBadge({ emotion }: { emotion?: EmotionScores }) {
  if (!emotion) return <span className="badge">No analysis</span>
  const top = Object.entries(emotion).sort((a,b) => b[1]-a[1])[0][0]
  const color = colorFor(top)
  return <span className={`badge capitalize ${color}`}>{top}</span>
}
