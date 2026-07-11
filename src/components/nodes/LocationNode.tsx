import { type NodeProps, Handle, Position } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'
import { selectExpandedNodeId } from '../../store/selectors'
import { fileToImageRef, revokeObjectURL } from '../../lib/images'
import WorldNode from './WorldNode'

function Pin({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 26 }}>
      <div
        className={`w-[26px] h-[26px] rounded-full border-2 border-white shadow-md flex-shrink-0 transition-colors ${
          active ? 'bg-red-600' : 'bg-red-500'
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
  const updateLocation = useAppStore(s => s.updateLocation)
  const beginLinking = useAppStore(s => s.beginLinking)
  const isExpanded = expandedNodeId === id

  const handleToggleExpand = () => {
    useAppStore.setState(s => ({ expandedNodeId: s.expandedNodeId === id ? null : id }))
  }

  const handleImageUpload = async (file: File) => {
    if (location?.image) revokeObjectURL(location.image.blobId)
    const imageRef = await fileToImageRef(file)
    updateLocation(id, { image: imageRef })
  }

  if (!location) return null

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1, minWidth: 0, minHeight: 0 }} />

      <div className="select-none">
        {/* Pin + collapsed title */}
        <div
          className="flex items-start gap-2 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <Pin active={isExpanded} />
          {!isExpanded && (
            <div className="mt-1 bg-white border border-slate-300 rounded-md px-2 py-0.5 text-sm text-slate-700 shadow-sm whitespace-nowrap max-w-[180px] truncate nodrag nopan">
              {location.title || 'Unnamed location'}
            </div>
          )}
        </div>

        {/* Expanded card below pin */}
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
