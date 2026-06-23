// schemaVersion lets future migrations transform old saved/exported projects.
export const SCHEMA_VERSION = 1

export interface Project {
  id: string // uuid
  name: string
  schemaVersion: number
  createdAt: string // ISO
  updatedAt: string // ISO
  plot: PlotView
  map: MapView
}

export interface PlotView {
  cards: PlotCard[]
  links: RelationshipLink[]
  viewport: Viewport // restores pan/zoom
}

export interface MapView {
  background: ImageRef | null // the uploaded map image
  locations: Location[]
  viewport: Viewport
}

// PlotCard and Location are intentionally the SAME shape (a "WorldNode"),
// differing only by which list of cross-refs they hold. Share one component.
export interface WorldNodeBase {
  id: string
  title: string // editable, "" by default
  image: ImageRef | null // editable, null by default
  description: string // shown when expanded
  position: { x: number; y: number }
}

export interface PlotCard extends WorldNodeBase {
  mapRefs: string[] // Location ids referenced from this card
}

export interface Location extends WorldNodeBase {
  plotRefs: string[] // PlotCard ids referenced from this marker
}

// Relationship line between two plot cards (a react-flow edge).
export interface RelationshipLink {
  id: string
  source: string // PlotCard id
  target: string // PlotCard id
  description: string // editable, shown when the line is clicked
}

export interface ImageRef {
  blobId: string // key into the `blobs` IndexedDB store
  width: number
  height: number
  mime: string
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}
