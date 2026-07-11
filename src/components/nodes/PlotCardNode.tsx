import { type NodeProps, Handle, Position } from '@xyflow/react'
import { useAppStore } from '../../store/useAppStore'
import { selectExpandedNodeId, selectLinkingFrom, selectLinking } from '../../store/selectors'
import { fileToImageRef, revokeObjectURL } from '../../lib/images'
import WorldNode from './WorldNode'
import CrossRefList from '../refs/CrossRefList'

export default function PlotCardNode({ id }: NodeProps) {
  const card = useAppStore(s => s.project?.plot.cards.find(c => c.id === id))
  const expandedNodeId = useAppStore(selectExpandedNodeId)
  const linkingFrom = useAppStore(selectLinkingFrom)
  const linking = useAppStore(selectLinking)
  const updatePlotCard = useAppStore(s => s.updatePlotCard)
  const removePlotCard = useAppStore(s => s.removePlotCard)
  const addLink = useAppStore(s => s.addLink)
  const beginLinking = useAppStore(s => s.beginLinking)
  const completeLinking = useAppStore(s => s.completeLinking)
  const beginSameViewLink = useAppStore(s => s.beginSameViewLink)
  const cancelSameViewLink = useAppStore(s => s.cancelSameViewLink)
  const removeCrossRef = useAppStore(s => s.removeCrossRef)
  const goTo = useAppStore(s => s.goTo)

  const isExpanded = expandedNodeId === id
  const isCrossLinkTarget = linking?.sourceView === 'map'
  const linkMode = linkingFrom === id
    ? 'source'
    : (linkingFrom !== null || isCrossLinkTarget)
      ? 'target'
      : undefined

  const handleBodyClick = () => {
    if (isCrossLinkTarget) {
      completeLinking(id)
      return
    }
    if (linkingFrom !== null) {
      if (linkingFrom !== id) addLink(linkingFrom, id)
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

  const handleDelete = () => {
    if (window.confirm(`Delete "${card?.title || 'this card'}"? This will also remove all its relationship lines.`)) {
      removePlotCard(id)
    }
  }

  if (!card) return null

  const crossRefSlot = (
    <CrossRefList
      refs={card.mapRefs}
      resolveTitle={refId =>
        useAppStore.getState().project?.map.locations.find(l => l.id === refId)?.title || 'Unknown location'
      }
      onNavigate={refId => goTo('map', refId)}
      onRemove={refId => removeCrossRef(id, refId)}
    />
  )

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
        onDelete={handleDelete}
        onChainLink={handleChainLink}
        linkMode={linkMode}
        crossRefLabel="MAP VIEW REFERENCES"
        crossRefSlot={crossRefSlot}
        crossLinkLabel="＋ link new Map item"
        onBeginCrossLink={() => beginLinking({ sourceView: 'plot', sourceId: id })}
      />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 4, height: 4, minWidth: 0, minHeight: 0 }} />
    </>
  )
}
