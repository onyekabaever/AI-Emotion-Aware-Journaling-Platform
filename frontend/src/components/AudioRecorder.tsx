
import { useEffect, useRef, useState } from 'react'

export default function AudioRecorder({ onFinish }: { onFinish: (blob: Blob, url: string) => void }) {
  const [recording, setRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const chunks = useRef<BlobPart[]>([])

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
    }
  }, [mediaRecorder])

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const rec = new MediaRecorder(stream)
    setMediaRecorder(rec)
    chunks.current = []
    rec.ondataavailable = (e) => chunks.current.push(e.data)
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      onFinish(blob, url)
    }
    rec.start()
    setRecording(true)
  }

  const stop = () => {
    mediaRecorder?.stop()
    setRecording(false)
  }

  return (
    <div className="flex items-center gap-2">
      {!recording ? (
        <button className="btn btn-primary" onClick={start} aria-label="Start recording">Start recording</button>
      ) : (
        <button className="btn btn-ghost" onClick={stop} aria-label="Stop recording">Stop</button>
      )}
    </div>
  )
}
