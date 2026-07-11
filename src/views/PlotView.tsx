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
import { selectPlotViewport, selectLinkingFrom } from '../store/selectors'
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
  const linkingFrom = useAppStore(selectLinkingFrom)

  const addPlotCard = useAppStore(s => s.addPlotCard)
  const goTo = useAppStore(s => s.goTo)
  const setPlotViewport = useAppStore(s => s.setPlotViewport)
  const exportProject = useAppStore(s => s.exportProject)
  const cancelSameViewLink = useAppStore(s => s.cancelSameViewLink)

  const [showSwitcher, setShowSwitcher] = useState(false)
  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Re-sync node list when cards are added/removed or project changes.
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

  // ESC: cancel link mode or deselect edge — reads fresh state, no closure staleness.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const s = useAppStore.getState()
      if (s.linkingFrom !== null) s.cancelSameViewLink()
      if (s.selectedLinkId !== null) useAppStore.setState({ selectedLinkId: null })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleNodeDragStop = useCallback((_: MouseEvent | TouchEvent, node: Node) => {
    useAppStore.getState().updatePlotCard(node.id, { position: node.position })
  }, [])

  const handleMoveEnd = useCallback((_: MouseEvent | TouchEvent | null, vp: { x: number; y: number; zoom: number }) => {
    setPlotViewport(vp)
  }, [setPlotViewport])

  const handleAddCard = useCallback(() => {
    const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addPlotCard(pos)
  }, [addPlotCard, screenToFlowPosition])

  // Edge click → select it.
  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    useAppStore.setState({ selectedLinkId: edge.id })
  }, [])

  // Pane click → clear edge selection and cancel link mode.
  const handlePaneClick = useCallback(() => {
    useAppStore.setState({ selectedLinkId: null })
    useAppStore.getState().cancelSameViewLink()
  }, [])

  // Node click → clear edge selection (popover closes).
  const handleNodeClick = useCallback(() => {
    if (useAppStore.getState().selectedLinkId !== null) {
      useAppStore.setState({ selectedLinkId: null })
    }
  }, [])

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
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
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

      {/* Link mode banner */}
      {linkingFrom && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-blue-600 text-white text-sm px-5 py-2.5 rounded-full shadow-lg pointer-events-none">
          <span>Click another card to create a relationship — or</span>
          <button
            className="underline hover:no-underline pointer-events-auto"
            onClick={cancelSameViewLink}
          >
            Cancel
          </button>
        </div>
      )}

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
