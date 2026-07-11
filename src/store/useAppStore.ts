import { create } from 'zustand'
import type { Project, PlotCard, Location, RelationshipLink, Viewport } from '../types/model'
import { SCHEMA_VERSION } from '../types/model'
import { id as newId } from '../lib/id'
import { fileToImageRef, revokeObjectURL } from '../lib/images'
import {
  scheduleSave,
  saveProjectNow,
  loadProject,
  listProjects as dbListProjects,
  getLastActiveProjectId,
  setLastActiveProjectId,
  type ProjectMeta,
} from '../db/persistence'

export interface LinkingContext {
  sourceView: 'plot' | 'map'
  sourceId: string
}

export interface AppState {
  // persisted (mirrored to IndexedDB)
  project: Project | null

  // transient UI state
  activeView: 'plot' | 'map'
  focusedNodeId: string | null
  expandedNodeId: string | null
  selectedLinkId: string | null
  linking: LinkingContext | null
  linkingFrom: string | null  // same-view plot card link mode

  // project lifecycle
  newProject(name: string): Promise<void>
  switchProject(id: string): Promise<void>
  listProjects(): Promise<ProjectMeta[]>
  exportProject(): Promise<void>
  importProject(file: File): Promise<void>

  // viewport
  setPlotViewport(viewport: Viewport): void
  setMapViewport(viewport: Viewport): void

  // plot mutations
  addPlotCard(position?: { x: number; y: number }): void
  updatePlotCard(id: string, patch: Partial<PlotCard>): void
  removePlotCard(id: string): void
  addLink(source: string, target: string): void
  updateLink(id: string, patch: Partial<RelationshipLink>): void
  removeLink(id: string): void

  // map mutations
  setBackgroundImage(file: File): Promise<void>
  addLocation(position?: { x: number; y: number }): void
  updateLocation(id: string, patch: Partial<Location>): void
  removeLocation(id: string): void

  // cross-view linking
  beginLinking(ctx: LinkingContext): void
  completeLinking(targetId: string): void
  cancelLinking(): void
  addCrossRef(cardId: string, locationId: string): void
  removeCrossRef(cardId: string, locationId: string): void

  // same-view link mode
  beginSameViewLink(sourceId: string): void
  cancelSameViewLink(): void

  // navigation
  goTo(view: 'plot' | 'map', focusNodeId?: string): void

  // internal
  _boot(): Promise<void>
}

function emptyProject(name: string): Project {
  const now = new Date().toISOString()
  return {
    id: newId(),
    name,
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    plot: { cards: [], links: [], viewport: { x: 0, y: 0, zoom: 1 } },
    map: { background: null, locations: [], viewport: { x: 0, y: 0, zoom: 1 } },
  }
}

function touch(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() }
}

function nextCardPosition(project: Project): { x: number; y: number } {
  const n = project.plot.cards.length
  return { x: 100 + (n % 5) * 220, y: 100 + Math.floor(n / 5) * 180 }
}

function nextLocationPosition(project: Project): { x: number; y: number } {
  const n = project.map.locations.length
  return { x: 200 + (n % 5) * 150, y: 200 + Math.floor(n / 5) * 150 }
}

export const useAppStore = create<AppState>((set, get) => ({
  project: null,
  activeView: 'plot',
  focusedNodeId: null,
  expandedNodeId: null,
  selectedLinkId: null,
  linking: null,
  linkingFrom: null,

  async newProject(name) {
    const project = emptyProject(name)
    await saveProjectNow(project)
    await setLastActiveProjectId(project.id)
    set({ project, activeView: 'plot', expandedNodeId: null, selectedLinkId: null, linking: null })
  },

  async switchProject(id) {
    const project = await loadProject(id)
    if (!project) return
    await setLastActiveProjectId(id)
    set({ project, activeView: 'plot', expandedNodeId: null, selectedLinkId: null, linking: null })
  },

  listProjects() {
    return dbListProjects()
  },

  setPlotViewport(viewport) {
    const { project } = get()
    if (!project) return
    const updated = { ...project, plot: { ...project.plot, viewport } }
    set({ project: updated })
    scheduleSave(updated)
  },

  setMapViewport(viewport) {
    const { project } = get()
    if (!project) return
    const updated = { ...project, map: { ...project.map, viewport } }
    set({ project: updated })
    scheduleSave(updated)
  },

  async exportProject() {
    // T7.1 — Phase 7
    console.warn('exportProject not yet implemented')
  },

  async importProject(_file) {
    // T7.2 — Phase 7
    console.warn('importProject not yet implemented')
  },

  addPlotCard(position) {
    const { project } = get()
    if (!project) return
    const card: PlotCard = {
      id: newId(),
      title: '',
      image: null,
      description: '',
      position: position ?? nextCardPosition(project),
      mapRefs: [],
    }
    const updated = touch({ ...project, plot: { ...project.plot, cards: [...project.plot.cards, card] } })
    set({ project: updated })
    scheduleSave(updated)
  },

  updatePlotCard(id, patch) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: {
        ...project.plot,
        cards: project.plot.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  removePlotCard(id) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: {
        ...project.plot,
        cards: project.plot.cards.filter((c) => c.id !== id),
        links: project.plot.links.filter((l) => l.source !== id && l.target !== id),
      },
      map: {
        ...project.map,
        locations: project.map.locations.map((loc) => ({
          ...loc,
          plotRefs: loc.plotRefs.filter((r) => r !== id),
        })),
      },
    })
    set({ project: updated, expandedNodeId: null })
    scheduleSave(updated)
  },

  addLink(source, target) {
    const { project } = get()
    if (!project || source === target) return
    const exists = project.plot.links.some(
      (l) =>
        (l.source === source && l.target === target) ||
        (l.source === target && l.target === source),
    )
    if (exists) return
    const link: RelationshipLink = { id: newId(), source, target, description: '' }
    const updated = touch({ ...project, plot: { ...project.plot, links: [...project.plot.links, link] } })
    set({ project: updated })
    scheduleSave(updated)
  },

  updateLink(id, patch) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: {
        ...project.plot,
        links: project.plot.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  removeLink(id) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: { ...project.plot, links: project.plot.links.filter((l) => l.id !== id) },
    })
    set({ project: updated, selectedLinkId: null })
    scheduleSave(updated)
  },

  async setBackgroundImage(file) {
    const { project } = get()
    if (!project) return
    if (project.map.background) revokeObjectURL(project.map.background.blobId)
    const imageRef = await fileToImageRef(file)
    const updated = touch({ ...project, map: { ...project.map, background: imageRef } })
    set({ project: updated })
    scheduleSave(updated)
  },

  addLocation(position) {
    const { project } = get()
    if (!project) return
    const location: Location = {
      id: newId(),
      title: '',
      image: null,
      description: '',
      position: position ?? nextLocationPosition(project),
      plotRefs: [],
    }
    const updated = touch({
      ...project,
      map: { ...project.map, locations: [...project.map.locations, location] },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  updateLocation(id, patch) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      map: {
        ...project.map,
        locations: project.map.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  removeLocation(id) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      map: {
        ...project.map,
        locations: project.map.locations.filter((l) => l.id !== id),
      },
      plot: {
        ...project.plot,
        cards: project.plot.cards.map((card) => ({
          ...card,
          mapRefs: card.mapRefs.filter((r) => r !== id),
        })),
      },
    })
    set({ project: updated, expandedNodeId: null })
    scheduleSave(updated)
  },

  beginLinking(ctx) {
    const otherView = ctx.sourceView === 'plot' ? 'map' : 'plot'
    set({ linking: ctx, activeView: otherView })
  },

  completeLinking(targetId) {
    const { linking } = get()
    if (!linking) return
    const { sourceView, sourceId } = linking
    if (sourceView === 'plot') {
      get().addCrossRef(sourceId, targetId)
    } else {
      get().addCrossRef(targetId, sourceId)
    }
    set({ linking: null, activeView: linking.sourceView, expandedNodeId: sourceId, focusedNodeId: sourceId })
  },

  cancelLinking() {
    set({ linking: null })
  },

  addCrossRef(cardId, locationId) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: {
        ...project.plot,
        cards: project.plot.cards.map((c) =>
          c.id === cardId && !c.mapRefs.includes(locationId)
            ? { ...c, mapRefs: [...c.mapRefs, locationId] }
            : c,
        ),
      },
      map: {
        ...project.map,
        locations: project.map.locations.map((l) =>
          l.id === locationId && !l.plotRefs.includes(cardId)
            ? { ...l, plotRefs: [...l.plotRefs, cardId] }
            : l,
        ),
      },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  removeCrossRef(cardId, locationId) {
    const { project } = get()
    if (!project) return
    const updated = touch({
      ...project,
      plot: {
        ...project.plot,
        cards: project.plot.cards.map((c) =>
          c.id === cardId ? { ...c, mapRefs: c.mapRefs.filter((r) => r !== locationId) } : c,
        ),
      },
      map: {
        ...project.map,
        locations: project.map.locations.map((l) =>
          l.id === locationId ? { ...l, plotRefs: l.plotRefs.filter((r) => r !== cardId) } : l,
        ),
      },
    })
    set({ project: updated })
    scheduleSave(updated)
  },

  beginSameViewLink(sourceId) {
    set({ linkingFrom: sourceId, expandedNodeId: null, selectedLinkId: null })
  },

  cancelSameViewLink() {
    set({ linkingFrom: null })
  },

  goTo(view, focusNodeId) {
    set({ activeView: view, focusedNodeId: focusNodeId ?? null })
  },

  async _boot() {
    const lastId = await getLastActiveProjectId()
    if (!lastId) return
    const project = await loadProject(lastId)
    if (project) set({ project })
  },
}))
