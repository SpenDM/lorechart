# MVP Task Breakdown — Plot & Map

Built to be handed to coding agents. Each task has a stable **ID**, a goal, **acceptance criteria** (AC), **dependencies** (Dep), and the **files** it touches. Read `ARCHITECTURE.md` first — it defines the data model, store shape, and component tree these tasks implement. Conventions: all data mutations go through Zustand store actions; images are `Blob`s in IndexedDB referenced by `blobId`; both views are react-flow instances driven by the store.

Legend: `[ ]` todo · AC = acceptance criteria · Dep = depends on.

---

## Phase 1 — Project setup & deploy skeleton  (Milestone M0)

### T1.1 — Scaffold Vite + React + TS
- Init Vite React-TS app. Add Tailwind. Confirm dev server runs.
- **AC:** `npm run dev` serves a hello page; `npm run build` emits `dist/`.
- **Files:** project root, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `index.css`.

### T1.2 — Install core deps
- Add `@xyflow/react`, `zustand`, `dexie`, `uuid` (+ types).
- **AC:** all import without error; versions pinned in `package.json`.
- **Dep:** T1.1.

### T1.3 — Cloudflare Pages config
- Add `public/_redirects` = `/*  /index.html  200`. Document build cmd `npm run build` / output `dist`.
- **AC:** repo builds on Pages; default `*.pages.dev` URL serves the app; refresh on any path doesn't 404.
- **Dep:** T1.1.

### T1.4 — Folder structure stub
- Create the directory tree from ARCHITECTURE §8 with empty/placeholder files and the `types/model.ts` interfaces filled in.
- **AC:** `types/model.ts` compiles with all interfaces from ARCHITECTURE §3.
- **Dep:** T1.1.

---

## Phase 2 — Data model, store & persistence  (Milestone M1)

### T2.1 — Type definitions
- Implement every interface in ARCHITECTURE §3 in `types/model.ts`; add `SCHEMA_VERSION = 1`.
- **AC:** exported types used across the app; no `any` in the model.

### T2.2 — Dexie database
- Implement `db/db.ts` with `projects`, `blobs`, `meta` stores per ARCHITECTURE §5.1.
- **AC:** DB opens; can put/get a Project and a Blob in a scratch test.
- **Dep:** T2.1.

### T2.3 — Image helpers
- `lib/images.ts`: `fileToImageRef(file) -> {blobId,width,height,mime}` (stores blob, reads natural dimensions), `imageRefToObjectURL(ref)`, and an object-URL registry with `revoke()` on replace/unmount.
- **AC:** uploading an image yields an `ImageRef`; rendering it via object URL works; no leaked URLs (revoked).
- **Dep:** T2.2.

### T2.4 — Zustand store skeleton + selectors
- `store/useAppStore.ts` with the `AppState` shape from ARCHITECTURE §4 (actions can be stubs initially). Add `selectors.ts`.
- **AC:** components can read `project`, `activeView`, etc.
- **Dep:** T2.1.

### T2.5 — Autosave
- `db/persistence.ts`: debounced (~600ms) write of active `project` to Dexie. Every mutating action bumps `updatedAt` and schedules a save. Save on drag-stop, not every drag tick.
- **AC:** edits persist; reload restores them; rapid edits don't fire a write per keystroke.
- **Dep:** T2.2, T2.4.

### T2.6 — Boot / load
- On app start, read `meta.lastActiveProjectId`, load that Project into the store; if none, leave `project = null` (empty state handled in T8.1).
- **AC:** last-open project auto-loads on refresh.
- **Dep:** T2.5.

### T2.7 — New / switch project actions
- Implement `newProject(name)`, `switchProject(id)`, `listProjects()`. Persist `lastActiveProjectId` in `meta`.
- **AC:** can create multiple projects and switch; switching loads correct data; new project starts empty.
- **Dep:** T2.5.

---

## Phase 3 — Plot View core  (Milestone M2)

### T3.1 — PlotView react-flow shell
- `views/PlotView.tsx`: full-page `<ReactFlow>` with controlled `nodes`/`edges` derived from `project.plot`; pan/zoom; persist `viewport`.
- **AC:** canvas fills page; pan/zoom works; viewport restored on reload.
- **Dep:** T2.6.

### T3.2 — Shared WorldNode component
- `components/nodes/WorldNode.tsx`: collapsed (title + image + chain-link button) and expanded (title + image + description + cross-ref list slot + chain-link). Drives editing via store actions passed by the wrapping node type. Matches wireframe 02.
- **AC:** collapsed/expanded toggle on body click; title & description editable; image slot shows placeholder when null.
- **Dep:** T3.1.

### T3.3 — PlotCardNode
- `components/nodes/PlotCardNode.tsx` wraps `WorldNode`, wires to `updatePlotCard`. Register in `nodeTypes`.
- **AC:** a Plot Card renders, is draggable, edits persist; `expandedNodeId` controls which is open.
- **Dep:** T3.2.

### T3.4 — Image upload on a node
- `components/overlays/ImageUploader.tsx` (or inline picker). Clicking the image area uploads → `fileToImageRef` → store patch.
- **AC:** image appears on card and survives reload; replacing revokes old object URL.
- **Dep:** T3.3, T2.3.

### T3.5 — Toolbar (shared) + top section
- `components/Toolbar/Toolbar.tsx` floating left, two sections. Top section: New Project, Switch Project, Save(export). Bottom section is view-specific (passed in). Matches wireframe 01.
- **AC:** toolbar floats over canvas on left; top buttons wired (New, Switch open modal; Save stubs to T7.1).
- **Dep:** T3.1.

### T3.6 — Plot bottom toolbar + Add Card
- Bottom section for Plot View: "New Plot Card" (`addPlotCard`, spawns near viewport center) and "Switch to Map View" (`goTo('map')`).
- **AC:** clicking + adds a blank card; map button switches view.
- **Dep:** T3.5, T3.3.

### T3.7 — Project Switcher modal
- `components/overlays/ProjectSwitcherModal.tsx`: lists projects (`listProjects`), select to switch, button to create new, **Import…** entry (wired in T7.2).
- **AC:** can switch/create from modal; current project indicated.
- **Dep:** T2.7, T3.5.

---

## Phase 4 — Relationship lines  (Milestone M3)

### T4.1 — Same-view link mode (chain-link button)
- Chain-link on a card enters "pick target card" mode (transient store flag). Next card click → `addLink(source,target)`. Esc/click-empty cancels. (Default UX per Q7: click-then-click.)
- **AC:** can connect two cards; self-link & duplicate links prevented.
- **Dep:** T3.3.

### T4.2 — RelationshipEdge custom edge
- `components/edges/RelationshipEdge.tsx`: rendered for `links`; visible clickable hit area; selecting sets `selectedLinkId`. Register in `edgeTypes`. Matches wireframe 03.
- **AC:** line renders between the right cards, follows nodes when dragged, is clickable.
- **Dep:** T4.1, T3.1.

### T4.3 — Edge description editor
- On `selectedLinkId`, show a small popover near the edge midpoint with an editable description bound to `updateLink`.
- **AC:** clicking a line opens the editor; text persists; clicking away closes it.
- **Dep:** T4.2.

### T4.4 — Delete link
- Small delete control on selected edge → `removeLink` (default Q8: include, with confirm).
- **AC:** line removed from canvas and data.
- **Dep:** T4.2.

---

## Phase 5 — Map View core  (Milestone M4)

### T5.1 — MapView react-flow shell
- `views/MapView.tsx`: `<ReactFlow>` driven by `project.map`; pan/zoom; persist viewport.
- **AC:** canvas fills page; toolbar present; pan/zoom works.
- **Dep:** T2.6, T3.5.

### T5.2 — MapImageNode (background)
- `components/nodes/MapImageNode.tsx`: non-draggable, non-selectable, bottom z-order node at origin sized to image natural dimensions. Hidden when `background` is null.
- **AC:** uploaded map renders in flow-space; markers pan/zoom with it.
- **Dep:** T5.1, T2.3.

### T5.3 — Add background image tool
- Map bottom-toolbar button → upload → `setBackgroundImage(file)`; replacing revokes old URL.
- **AC:** image appears as background; replace works; persists across reload.
- **Dep:** T5.2.

### T5.4 — LocationNode
- `components/nodes/LocationNode.tsx` reuses `WorldNode`, styled as a pin/marker (wireframe 04), wired to `updateLocation`.
- **AC:** add/move/edit a Location; expand shows description + plot-ref list slot.
- **Dep:** T3.2, T5.1.

### T5.5 — Map bottom toolbar
- "New Location" (`addLocation`), "Add background image" (T5.3), "Switch to Plot View" (`goTo('plot')`).
- **AC:** all three wired; matches wireframe 04.
- **Dep:** T5.4, T5.3.

---

## Phase 6 — Cross-view linking & navigation  (Milestone M5) — highest complexity

### T6.1 — CrossRefList component
- `components/refs/CrossRefList.tsx`: bullet list of referenced items (resolve ids → titles) + "＋ link new item" button. Used in both node types (mapRefs / plotRefs).
- **AC:** lists current refs; empty state clean; each bullet is a clickable navigation control.
- **Dep:** T3.2.

### T6.2 — Begin/cancel linking (selection mode)
- `beginLinking(ctx)` sets `linking` and switches to the other view; `cancelLinking()` clears it. Render `LinkingBanner` overlay (wireframe 05) while active; highlight candidate nodes.
- **AC:** clicking "＋ link new item" on a Plot Card switches to Map View showing the banner; Cancel returns without changes.
- **Dep:** T6.1, T5.4, T3.3.

### T6.3 — Complete linking (write both sides)
- While `linking` active, a node click in the target view calls `completeLinking(targetId)` → `addCrossRef` writes both `mapRefs` and `plotRefs` (bidirectional per Q1), returns to source view, re-opens & focuses source node.
- **AC:** linking from a card adds the location to its list AND the card to the location's list; returns to the originating card expanded.
- **Dep:** T6.2.

### T6.4 — Navigate via a ref
- Clicking an existing bullet → `goTo(otherView, refId)`; target view centers on and expands that node (`focusedNodeId`).
- **AC:** clicking a map ref on a card opens Map View centered on that Location, expanded; symmetric from Locations.
- **Dep:** T6.1, T5.4.

### T6.5 — Remove a cross-ref
- Delete control on a bullet → `removeCrossRef` clears both sides.
- **AC:** removed from both lists.
- **Dep:** T6.1.

---

## Phase 7 — Export / Import  (Milestone M6)

### T7.1 — Export (manual Save)
- `exportProject()`: clone project, inline each image blob as base64, wrap `{schemaVersion, exportedAt, project}`, download `${name}.json`. Wire to top-toolbar Save button.
- **AC:** clicking Save downloads a valid JSON containing all data + images.
- **Dep:** T2.3, T3.5.

### T7.2 — Import
- `importProject(file)`: parse, validate `schemaVersion` (+migrations hook), decode base64 → blobs (new blobIds), assign new project id, persist, switch. Entry in Switch Project modal (Q5).
- **AC:** importing a previously exported file recreates the project (cards, locations, links, refs, images) as a new project.
- **Dep:** T7.1, T2.7.

### T7.3 — Round-trip test
- Manual/automated check: create rich project → export → import → assert structural equality (minus ids/timestamps).
- **AC:** no data loss across round-trip.
- **Dep:** T7.2.

---

## Phase 8 — Integrity, empty states & polish  (Milestone M7)

### T8.1 — Empty / first-run state
- When `project === null`, show a "Create your first project" screen; same for an empty canvas hint.
- **AC:** brand-new user sees a clear path to start.
- **Dep:** T2.6, T3.7.

### T8.2 — Delete cards/locations with cleanup
- `removePlotCard` removes its links and pulls its id from all `Location.plotRefs`; `removeLocation` pulls from all `PlotCard.mapRefs` (ARCHITECTURE §3 integrity).
- **AC:** after deletion, no dangling refs or orphan lines anywhere.
- **Dep:** T6.3, T4.1.

### T8.3 — Data-is-local notice
- Small unobtrusive note (e.g., in Switch Project modal) that data lives in this browser and export is the backup.
- **AC:** notice present.

### T8.4 — QA pass against wireframes
- Verify each screen matches wireframes 01–05 and all ACs hold; fix layout/z-index/object-URL leaks.
- **AC:** all milestones' ACs pass in a clean browser profile.
- **Dep:** all prior.

---

## Phase 9 — Domain & launch

### T9.1 — Custom domain on Cloudflare Pages
- Add the GoDaddy domain in Pages; set DNS records in GoDaddy (or move nameservers to Cloudflare); confirm HTTPS.
- **AC:** app loads on the custom domain over HTTPS; pushes to `main` auto-deploy.
- **Dep:** T1.3.

---

## Suggested agent assignment
- **Agent A (foundation):** Phase 1 → 2. Hand off a working store+persistence.
- **Agent B (Plot):** Phase 3 → 4.
- **Agent C (Map):** Phase 5 (can start once T3.2 `WorldNode` exists).
- **Agent D (the hard one):** Phase 6 — give it sole ownership; it spans both views and the store.
- **Agent E (portability + ship):** Phase 7 → 8 → 9.

Critical-path order: T1.x → T2.x → T3.1–T3.3 (unlocks B, C, D) → T6.x → T7.x → T9.1.
