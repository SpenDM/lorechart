import { type NodeProps, Handle, Position } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'
import { selectExpandedNodeId, selectLinking } from '../../store/selectors'
import { fileToImageRef, revokeObjectURL } from '../../lib/images'
import WorldNode from './WorldNode'
import CrossRefList from '../refs/CrossRefList'

function Pin({ active, linkTarget }: { active: boolean; linkTarget: boolean }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 26 }}>
      <div
        className={`w-[26px] h-[26px] rounded-full border-2 shadow-md flex-shrink-0 transition-all ${
          linkTarget
            ? 'border-amber-400 bg-red-500 ring-2 ring-amber-400 ring-offset-1'
            : active
              ? 'border-white bg-red-600'
              : 'border-white bg-red-500'
        }`}
      />
      <div
        className="w-0 h-0"
        style={{
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `10px solid ${active ? '#dc2626' : '#ef4444'}`,
        }}
      />
    </div>
  )
}

export default function LocationNode({ id }: NodeProps) {
  const location = useAppStore(s => s.project?.map.locations.find(l => l.id === id))
  const expandedNodeId = useAppStore(selectExpandedNodeId)
  const linking = useAppStore(selectLinking)
  const updateLocation = useAppStore(s => s.updateLocation)
  const beginLinking = useAppStore(s => s.beginLinking)
  const completeLinking = useAppStore(s => s.completeLinking)
  const removeCrossRef = useAppStore(s => s.removeCrossRef)
  const goTo = useAppStore(s => s.goTo)
  const isExpanded = expandedNodeId === id
  const isLinkTarget = linking?.sourceView === 'plot'

  const handleToggleExpand = () => {
    if (isLinkTarget) {
      completeLinking(id)
      return
    }
    useAppStore.setState(s => ({ expandedNodeId: s.expandedNodeId === id ? null : id }))
  }

  const handleImageUpload = async (file: File) => {
    if (location?.image) revokeObjectURL(location.image.blobId)
    const imageRef = await fileToImageRef(file)
    updateLocation(id, { image: imageRef })
  }

  if (!location) return null

  const crossRefSlot = (
    <CrossRefList
      refs={location.plotRefs}
      resolveTitle={refId =>
        useAppStore.getState().project?.plot.cards.find(c => c.id === refId)?.title || 'Unknown card'
      }
      onNavigate={refId => goTo('plot', refId)}
      onRemove={refId => removeCrossRef(refId, id)}
    />
  )

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />

      <div className={`select-none ${isLinkTarget ? 'cursor-crosshair' : ''}`}>
        <div
          className="flex items-start gap-2 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <Pin active={isExpanded} linkTarget={isLinkTarget} />
          {!isExpanded && (
            <div
              className={`mt-1 bg-white border rounded-md px-2 py-0.5 text-sm text-slate-700 shadow-sm whitespace-nowrap max-w-[180px] truncate nodrag nopan ${
                isLinkTarget ? 'border-amber-400' : 'border-slate-300'
              }`}
            >
              {location.title || 'Unnamed location'}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-1">
            <WorldNode
              title={location.title}
              image={location.image}
              description={location.description}
              isExpanded={true}
              onToggleExpand={handleToggleExpand}
              onTitleChange={title => updateLocation(id, { title })}
              onDescriptionChange={description => updateLocation(id, { description })}
              onImageUpload={handleImageUpload}
              crossRefLabel="PLOT VIEW REFERENCES"
              crossRefSlot={crossRefSlot}
              crossLinkLabel="＋ link new Plot item"
              onBeginCrossLink={() => beginLinking({ sourceView: 'map', sourceId: id })}
            />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />
    </>
  )
}
