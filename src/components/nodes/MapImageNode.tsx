import { useState, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { imageRefToObjectURL } from '../../lib/images'

export default function MapImageNode() {
  const background = useAppStore(s => s.project?.map.background ?? null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!background) {
      setObjectUrl(null)
      return
    }
    let cancelled = false
    imageRefToObjectURL(background).then(url => {
      if (!cancelled) setObjectUrl(url)
    })
    return () => { cancelled = true }
  }, [background?.blobId])

  if (!background || !objectUrl) return null

  return (
    <div
      style={{
        width: background.width,
        height: background.height,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <img
        src={objectUrl}
        draggable={false}
        style={{ width: '100%', height: '100%', display: 'block', borderRadius: 8 }}
        alt="Map background"
      />
    </div>
  )
}
