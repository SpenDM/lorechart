import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'

export default function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  })

  const selectedLinkId = useAppStore(s => s.selectedLinkId)
  const link = useAppStore(s => s.project?.plot.links.find(l => l.id === id))
  const updateLink = useAppStore(s => s.updateLink)
  const removeLink = useAppStore(s => s.removeLink)

  const isSelected = selectedLinkId === id

  const handleDelete = () => {
    if (window.confirm('Remove this relationship?')) {
      removeLink(id)
    }
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isSelected ? '#2563eb' : '#3b82f6',
          strokeWidth: isSelected ? 3 : 2.5,
        }}
      />

      {isSelected && link && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan absolute"
            style={{
              transform: `translate(-50%, calc(-100% - 10px)) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            {/* Popover */}
            <div className="bg-white border border-blue-400 rounded-xl shadow-lg w-60 p-3">
              <div className="text-[9px] tracking-widest text-slate-400 uppercase mb-2">
                Relationship Description
              </div>
              <textarea
                autoFocus
                value={link.description}
                onChange={e => updateLink(id, { description: e.target.value })}
                placeholder="Describe this relationship…"
                rows={3}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none resize-none bg-slate-50 focus:border-blue-300"
                onClick={e => e.stopPropagation()}
              />
              <button
                onClick={handleDelete}
                className="mt-2 w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg py-1.5 transition-colors"
              >
                Delete relationship
              </button>
            </div>
            {/* Downward caret */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #60a5fa',
              }}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
