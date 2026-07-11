import type { AppState } from './useAppStore'

export const selectProject = (s: AppState) => s.project
export const selectActiveView = (s: AppState) => s.activeView
export const selectPlotCards = (s: AppState) => s.project?.plot.cards ?? []
export const selectPlotLinks = (s: AppState) => s.project?.plot.links ?? []
export const selectPlotViewport = (s: AppState) => s.project?.plot.viewport ?? { x: 0, y: 0, zoom: 1 }
export const selectLocations = (s: AppState) => s.project?.map.locations ?? []
export const selectBackground = (s: AppState) => s.project?.map.background ?? null
export const selectMapViewport = (s: AppState) => s.project?.map.viewport ?? { x: 0, y: 0, zoom: 1 }
export const selectExpandedNodeId = (s: AppState) => s.expandedNodeId
export const selectSelectedLinkId = (s: AppState) => s.selectedLinkId
export const selectLinking = (s: AppState) => s.linking
export const selectFocusedNodeId = (s: AppState) => s.focusedNodeId
export const selectSetPlotViewport = (s: AppState) => s.setPlotViewport
export const selectSetMapViewport = (s: AppState) => s.setMapViewport
