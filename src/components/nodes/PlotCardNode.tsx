import { type NodeProps, Handle, Position } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'
import { selectExpandedNodeId, selectLinkingFrom } from '../../store/selectors'
import { fileToImageRef, revokeObjectURL } from '../../lib/images'
import WorldNode from './WorldNode'

export default function PlotCardNode({ id }: NodeProps) {
  const card = useAppStore(s => s.project?.plot.cards.find(c => c.id === id))
  const expandedNodeId = useAppStore(selectExpandedNodeId)
  const linkingFrom = useAppStore(selectLinkingFrom)
  const updatePlotCard = useAppStore(s => s.updatePlotCard)
  const addLink = useAppStore(s => s.addLink)
  const beginLinking = useAppStore(s => s.beginLinking)
  const beginSameViewLink = useAppStore(s => s.beginSameViewLink)
  const cancelSameViewLink = useAppStore(s => s.cancelSameViewLink)

  const isExpanded = expandedNodeId === id
  const linkMode = linkingFrom === id ? 'source' : linkingFrom !== null ? 'target' : undefined

  const handleBodyClick = () => {
    if (linkingFrom !== null) {
      if (linkingFrom !== id) {
        addLink(linkingFrom, id)
      }
      cancelSameViewLink()
      return
    }
    useAppStore.setState(s => ({ expandedNodeId: s.expandedNodeId === id ? null : id }))
  }

  const handleChainLink = () => {
    if (linkingFrom === id) {
      cancelSameViewLink()
    } else {
      beginSameViewLink(id)
    }
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
        onToggleExpand={handleBodyClick}
        onTitleChange={title => updatePlotCard(id, { title })}
        onDescriptionChange={description => updatePlotCard(id, { description })}
        onImageUpload={handleImageUpload}
        onChainLink={handleChainLink}
        linkMode={linkMode}
        crossRefLabel="MAP VIEW REFERENCES"
        crossLinkLabel="＋ link new Map item"
        onBeginCrossLink={() => beginLinking({ sourceView: 'plot', sourceId: id })}
      />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 4, height: 4, minWidth: 0, minHeight: 0 }} />
    </>
  )
}
