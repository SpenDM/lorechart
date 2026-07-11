import { useState, useEffect, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
import { selectPlotViewport } from '../store/selectors'
import PlotCardNode from '../components/nodes/PlotCardNode'
import RelationshipEdge from '../components/edges/RelationshipEdge'
import Toolbar from '../components/Toolbar/Toolbar'
import ToolbarButton from '../components/Toolbar/ToolbarButton'
import ProjectSwitcherModal from '../components/overlays/ProjectSwitcherModal'

const nodeTypes = { plotCard: PlotCardNode }
const edgeTypes = { relationship: RelationshipEdge }

function PlotViewInner() {
  const projectId = useAppStore(s => s.project?.id)
  const cardIdsKey = useAppStore(s => s.project?.plot.cards.map(c => c.id).join(',') ?? '')
  const linkIdsKey = useAppStore(s => s.project?.plot.links.map(l => l.id).join(',') ?? '')
  const viewport = useAppStore(selectPlotViewport)

  const addPlotCard = useAppStore(s => s.addPlotCard)
  const goTo = useAppStore(s => s.goTo)
  const setPlotViewport = useAppStore(s => s.setPlotViewport)
  const exportProject = useAppStore(s => s.exportProject)

  const [showSwitcher, setShowSwitcher] = useState(false)
  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Re-sync node list when cards are added/removed or project changes.
  // Preserves RF-internal state (position, selection) for existing nodes.
  useEffect(() => {
    const cards = useAppStore.getState().project?.plot.cards ?? []
    setNodes(prev => {
      const prevMap = new Map(prev.map(n => [n.id, n]))
      return cards.map(card => prevMap.get(card.id) ?? {
        id: card.id,
        type: 'plotCard' as const,
        position: card.position,
        data: {},
      })
    })
  }, [cardIdsKey, projectId, setNodes])

  // Re-sync edges when links are added/removed or project changes.
  useEffect(() => {
    const links = useAppStore.getState().project?.plot.links ?? []
    setEdges(links.map(link => ({
      id: link.id,
      type: 'relationship' as const,
      source: link.source,
      target: link.target,
      data: {},
    })))
  }, [linkIdsKey, projectId, setEdges])

  // Write final position to store on drag stop so autosave picks it up.
  const handleNodeDragStop = useCallback((_: MouseEvent | TouchEvent, node: Node) => {
    useAppStore.getState().updatePlotCard(node.id, { position: node.position })
  }, [])

  // Persist viewport after pan/zoom ends.
  const handleMoveEnd = useCallback((_: MouseEvent | TouchEvent | null, vp: { x: number; y: number; zoom: number }) => {
    setPlotViewport(vp)
  }, [setPlotViewport])

  // Place new card near the viewport centre.
  const handleAddCard = useCallback(() => {
    const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addPlotCard(pos)
  }, [addPlotCard, screenToFlowPosition])

  const plotBottomSlot = (
    <>
      <ToolbarButton onClick={handleAddCard} title="New Plot Card" variant="primary">＋</ToolbarButton>
      <ToolbarButton onClick={() => goTo('map')} title="Switch to Map View">🗺</ToolbarButton>
    </>
  )

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        key={projectId}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        onMoveEnd={handleMoveEnd}
        defaultViewport={viewport}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="#d7dde5" />
      </ReactFlow>

      <Toolbar
        onNewProject={() => setShowSwitcher(true)}
        onSwitchProject={() => setShowSwitcher(true)}
        onSave={() => exportProject()}
        bottomSlot={plotBottomSlot}
      />

      {showSwitcher && <ProjectSwitcherModal onClose={() => setShowSwitcher(false)} />}
    </div>
  )
}

export default function PlotView() {
  return (
    <ReactFlowProvider>
      <PlotViewInner />
    </ReactFlowProvider>
  )
}
