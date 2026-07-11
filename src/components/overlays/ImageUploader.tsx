import { useRef, useState, useEffect } from 'react'
import type { ImageRef } from '../../types/model'
import { imageRefToObjectURL } from '../../lib/images'

interface ImageUploaderProps {
  imageRef: ImageRef | null
  onUpload: (file: File) => void
  expanded?: boolean
}

export default function ImageUploader({ imageRef, onUpload, expanded = false }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!imageRef) {
      setObjectUrl(null)
      return
    }
    let cancelled = false
    imageRefToObjectURL(imageRef).then(url => {
      if (!cancelled) setObjectUrl(url)
    })
    return () => { cancelled = true }
  }, [imageRef?.blobId])

  return (
    <div
      className={`relative cursor-pointer border border-dashed border-slate-300 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center ${
        expanded ? 'h-24' : 'h-14'
      }`}
      onClick={e => {
        e.stopPropagation()
        inputRef.current?.click()
      }}
    >
      {objectUrl ? (
        <img src={objectUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs text-slate-400">
          {expanded ? 'click to upload / replace' : 'click to set'}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={e => e.stopPropagation()}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
