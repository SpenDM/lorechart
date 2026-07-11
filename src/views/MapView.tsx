import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
  type Node,
} from '@xyflow/react'
import { useAppStore } from '../store/useAppStore'
import { selectMapViewport } from '../store/selectors'
import MapImageNode from '../components/nodes/MapImageNode'
import LocationNode from '../components/nodes/LocationNode'
import Toolbar from '../components/Toolbar/Toolbar'
import ToolbarButton from '../components/Toolbar/ToolbarButton'
import ProjectSwitcherModal from '../components/overlays/ProjectSwitcherModal'

const nodeTypes = { mapImage: MapImageNode, location: LocationNode }

function MapViewInner() {
  const projectId = useAppStore(s => s.project?.id)
  const background = useAppStore(s => s.project?.map.background ?? null)
  const locationIdsKey = useAppStore(s => s.project?.map.locations.map(l => l.id).join(',') ?? '')
  const viewport = useAppStore(selectMapViewport)

  const addLocation = useAppStore(s => s.addLocation)
  const goTo = useAppStore(s => s.goTo)
  const setMapViewport = useAppStore(s => s.setMapViewport)
  const setBackgroundImage = useAppStore(s => s.setBackgroundImage)
  const exportProject = useAppStore(s => s.exportProject)

  const [showSwitcher, setShowSwitcher] = useState(false)
  const { screenToFlowPosition } = useReactFlow()
  const bgInputRef = useRef<HTMLInputElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])

  // Combined sync key: rebuild nodes when background, locations, or project changes.
  const bgKey = background?.blobId ?? 'none'
  const nodesSyncKey = `${projectId}|${bgKey}|${locationIdsKey}`

  useEffect(() => {
    const { project } = useAppStore.getState()
    const locs = project?.map.locations ?? []
    const bg = project?.map.background

    const bgNode: Node[] = bg
      ? [{
          id: 'map-background',
          type: 'mapImage' as const,
          position: { x: 0, y: 0 },
          data: {},
          draggable: false,
          selectable: false,
          focusable: false,
          zIndex: -1,
        }]
      : []

    setNodes(prev => {
      const prevLocMap = new Map(
        prev.filter(n => n.type === 'location').map(n => [n.id, n]),
      )
      const locNodes = locs.map(loc => prevLocMap.get(loc.id) ?? {
        id: loc.id,
        type: 'location' as const,
        position: loc.position,
        data: {},
      })
      return [...bgNode, ...locNodes]
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesSyncKey, setNodes])

  // Persist location position on drag stop.
  const handleNodeDragStop = useCallback((_: MouseEvent | TouchEvent, node: Node) => {
    if (node.type === 'location') {
      useAppStore.getState().updateLocation(node.id, { position: node.position })
    }
  }, [])

  // Persist viewport after pan/zoom ends.
  const handleMoveEnd = useCallback((_: MouseEvent | TouchEvent | null, vp: { x: number; y: number; zoom: number }) => {
    setMapViewport(vp)
  }, [setMapViewport])

  // Place new location near viewport centre.
  const handleAddLocation = useCallback(() => {
    const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    addLocation(pos)
  }, [addLocation, screenToFlowPosition])

  const handleBgFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await setBackgroundImage(file)
    e.target.value = ''
  }, [setBackgroundImage])

  // ESC: collapse expanded node.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useAppStore.setState({ expandedNodeId: null })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const mapBottomSlot = (
    <>
      <ToolbarButton onClick={handleAddLocation} title="New Location" variant="primary">＋</ToolbarButton>
      <ToolbarButton onClick={() => bgInputRef.current?.click()} title="Add background image">🖼</ToolbarButton>
      <ToolbarButton onClick={() => goTo('plot')} title="Switch to Plot View">📋</ToolbarButton>
    </>
  )

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        key={projectId}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodeDragStop={handleNodeDragStop}
        onMoveEnd={handleMoveEnd}
        defaultViewport={viewport}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} color="#d7dde5" />
      </ReactFlow>

      <Toolbar
        onNewProject={() => setShowSwitcher(true)}
        onSwitchProject={() => setShowSwitcher(true)}
        onSave={() => exportProject()}
        bottomSlot={mapBottomSlot}
      />

      <input
        ref={bgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBgFileChange}
      />

      {showSwitcher && <ProjectSwitcherModal onClose={() => setShowSwitcher(false)} />}
    </div>
  )
}

export default function MapView() {
  return (
    <ReactFlowProvider>
      <MapViewInner />
    </ReactFlowProvider>
  )
}
