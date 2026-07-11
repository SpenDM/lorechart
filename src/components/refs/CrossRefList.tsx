interface CrossRefListProps {
  refs: string[]
  resolveTitle: (id: string) => string
  onNavigate: (id: string) => void
  onRemove: (id: string) => void
}

export default function CrossRefList({ refs, resolveTitle, onNavigate, onRemove }: CrossRefListProps) {
  if (refs.length === 0) {
    return <p className="text-xs text-slate-400 italic py-1">None yet</p>
  }
  return (
    <ul className="space-y-1">
      {refs.map(refId => (
        <li key={refId} className="flex items-center gap-1 min-w-0">
          <span className="flex-1 text-sm text-slate-700 truncate min-w-0">{resolveTitle(refId)}</span>
          <button
            className="text-blue-400 hover:text-blue-600 nodrag nopan px-1 shrink-0 text-base leading-none"
            onClick={e => { e.stopPropagation(); onNavigate(refId) }}
            title="Navigate to this item"
          >
            ↗
          </button>
          <button
            className="text-slate-300 hover:text-red-400 nodrag nopan px-1 shrink-0 text-xs leading-none"
            onClick={e => { e.stopPropagation(); onRemove(refId) }}
            title="Remove reference"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
