import { type NodeProps, Handle, Position } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'
import { selectExpandedNodeId } from '../../store/selectors'
import { fileToImageRef, revokeObjectURL } from '../../lib/images'
import WorldNode from './WorldNode'

export default function PlotCardNode({ id }: NodeProps) {
  const card = useAppStore(s => s.project?.plot.cards.find(c => c.id === id))
  const expandedNodeId = useAppStore(selectExpandedNodeId)
  const updatePlotCard = useAppStore(s => s.updatePlotCard)
  const beginLinking = useAppStore(s => s.beginLinking)
  const isExpanded = expandedNodeId === id

  const handleToggleExpand = () => {
    useAppStore.setState(s => ({ expandedNodeId: s.expandedNodeId === id ? null : id }))
  }

  const handleImageUpload = async (file: File) => {
    if (card?.image) revokeObjectURL(card.image.blobId)
    const imageRef = await fileToImageRef(file)
    updatePlotCard(id, { image: imageRef })
  }

  if (!card) return null

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 4, height: 4, minWidth: 0, minHeight: 0 }} />
      <WorldNode
        title={card.title}
        image={card.image}
        description={card.description}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        onTitleChange={title => updatePlotCard(id, { title })}
        onDescriptionChange={description => updatePlotCard(id, { description })}
        onImageUpload={handleImageUpload}
        onChainLink={() => {/* T4.1 — wired in Phase 4 */}}
        crossRefLabel="MAP VIEW REFERENCES"
        crossLinkLabel="＋ link new Map item"
        onBeginCrossLink={() => beginLinking({ sourceView: 'plot', sourceId: id })}
      />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 4, height: 4, minWidth: 0, minHeight: 0 }} />
    </>
  )
}
