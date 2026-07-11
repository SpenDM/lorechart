import type { ReactNode } from 'react'
import type { ImageRef } from '../../types/model'
import ImageUploader from '../overlays/ImageUploader'

interface WorldNodeProps {
  title: string
  image: ImageRef | null
  description: string
  isExpanded: boolean
  onToggleExpand: () => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (desc: string) => void
  onImageUpload: (file: File) => void
  onChainLink: () => void
  crossRefLabel?: string
  crossRefSlot?: ReactNode
  onBeginCrossLink?: () => void
  crossLinkLabel?: string
}

export default function WorldNode({
  title,
  image,
  description,
  isExpanded,
  onToggleExpand,
  onTitleChange,
  onDescriptionChange,
  onImageUpload,
  onChainLink,
  crossRefLabel = 'MAP VIEW REFERENCES',
  crossRefSlot,
  onBeginCrossLink,
  crossLinkLabel = '＋ link new Map item',
}: WorldNodeProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-[width,border-color] duration-150 cursor-pointer select-none ${
        isExpanded ? 'border-blue-400 w-80' : 'border-slate-300 w-48'
      }`}
      onClick={onToggleExpand}
    >
      {/* Header: title */}
      <div className="bg-slate-100 rounded-t-xl px-3 py-2" onClick={stop}>
        <input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Editable title…"
          className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none nodrag nopan"
          onClick={stop}
        />
      </div>

      {/* Image */}
      <div className="px-3 pt-2" onClick={stop}>
        <ImageUploader imageRef={image} onUpload={onImageUpload} expanded={isExpanded} />
      </div>

      {/* Expanded: description + cross-refs */}
      {isExpanded && (
        <div onClick={stop}>
          <div className="px-3 pt-3">
            <div className="text-[9px] tracking-widest text-slate-400 uppercase mb-1">Description</div>
            <textarea
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
              placeholder="Editable multi-line description…"
              rows={3}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none resize-none nodrag nopan bg-slate-50 focus:border-blue-300"
              onClick={stop}
            />
          </div>
          <div className="px-3 pt-2 pb-1">
            <div className="text-[9px] tracking-widest text-slate-400 uppercase mb-1">{crossRefLabel}</div>
            {crossRefSlot}
            {onBeginCrossLink && (
              <button
                className="mt-2 w-full text-sm text-blue-500 border border-blue-300 rounded-full py-1 bg-blue-50 hover:bg-blue-100 nodrag nopan"
                onClick={e => { stop(e); onBeginCrossLink() }}
              >
                {crossLinkLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer: hint + chain-link */}
      <div className="flex items-center justify-between px-3 py-2" onClick={stop}>
        {!isExpanded && (
          <span className="text-[9px] text-slate-400">click to expand ▾</span>
        )}
        <div className="ml-auto">
          <button
            className="w-7 h-7 rounded-full bg-blue-50 border border-blue-400 flex items-center justify-center text-sm text-blue-600 hover:bg-blue-100 nodrag nopan"
            onClick={e => { stop(e); onChainLink() }}
            title="Link to another card"
          >
            🔗
          </button>
        </div>
      </div>
    </div>
  )
}
