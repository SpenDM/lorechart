import { useAppStore } from '../../store/useAppStore'
import { selectLinking } from '../../store/selectors'

export default function LinkingBanner() {
  const linking = useAppStore(selectLinking)
  const cancelLinking = useAppStore(s => s.cancelLinking)
  const sourceName = useAppStore(s => {
    if (!s.linking) return ''
    if (s.linking.sourceView === 'plot') {
      return s.project?.plot.cards.find(c => c.id === s.linking!.sourceId)?.title || 'Unnamed card'
    }
    return s.project?.map.locations.find(l => l.id === s.linking!.sourceId)?.title || 'Unnamed location'
  })

  if (!linking) return null

  const targetLabel = linking.sourceView === 'plot' ? 'a Location' : 'a Plot Card'

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5 bg-[#fffaeb] border-b border-amber-400 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-amber-500 text-base">⚑</span>
        <span className="text-sm text-amber-800">
          Select {targetLabel} to link to{' '}
          <strong className="font-semibold">{sourceName || 'this item'}</strong>
        </span>
      </div>
      <button
        className="text-xs text-amber-700 border border-amber-400 rounded-full px-3 py-1 hover:bg-amber-100 transition-colors"
        onClick={cancelLinking}
      >
        Cancel
      </button>
    </div>
  )
}
