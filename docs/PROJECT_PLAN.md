# Project Plan — Plot & Map MVP

## 1. Goal
Ship a single-user, browser-based tool with two cross-referencing canvases (Plot View, Map View), local persistence (IndexedDB autosave), and manual JSON export/import — deployed as a static site on Cloudflare Pages with a custom GoDaddy domain.

## 2. MVP scope

**In scope**
- Plot View: full-page react-flow canvas; floating left toolbar (top: new/switch/save · bottom: new card/switch-to-map).
- Plot Cards: editable title + image; expand to reveal description + Map-reference bullet list; chain-link button to draw relationship lines.
- Relationship lines: clickable, editable description.
- Map View: full-page canvas; upload background map image; Location markers in custom positions; same toolbar (bottom: new location/add image/switch-to-plot).
- Locations: same behavior as Plot Cards; bullet list references Plot Cards.
- Bidirectional cross-view linking + click-to-navigate.
- Multiple projects (create / switch); autosave to IndexedDB; manual JSON export + import.
- Deploy to Cloudflare Pages on custom domain.

**Out of scope (MVP)** — accounts, sync, multiplayer, server, undo/redo, search, rich text, mobile layout. (Tracked in §6.)

## 3. Milestones

| # | Milestone | Outcome | Maps to task phases |
|---|---|---|---|
| M0 | **Skeleton deployed** | Empty React+Vite app live on Cloudflare Pages w/ custom domain | Phase 1, 9 |
| M1 | **Data + persistence** | Store, Dexie, autosave, new/switch project working (no UI polish) | Phase 2 |
| M2 | **Plot View core** | Add/move/edit Plot Cards, expand/collapse, toolbar | Phase 3 |
| M3 | **Relationships** | Draw + click + edit relationship lines | Phase 4 |
| M4 | **Map View core** | Background image upload, add/move/edit Locations | Phase 5 |
| M5 | **Cross-view linking** | Bidirectional refs + navigation between views | Phase 6 |
| M6 | **Export/Import** | Manual JSON save & load with images | Phase 7 |
| M7 | **Polish + ship** | Empty states, integrity cleanup, QA pass | Phase 8 |

A natural build order is M0 → M1 → M2 → M4 (Plot and Map core share components) → M3 → M5 → M6 → M7. Agents can parallelize M3 and M4 once M2's shared `WorldNode` exists.

## 4. Risks & watch-items
- **react-flow background image in flow-space.** Putting the map as a bottom-z non-draggable node is the chosen approach; verify zoom/pan feels right early (M4 spike).
- **Cross-view linking surviving a view switch.** Mitigated by holding `linking` context in the store, not component state. This is the highest-complexity task — give it its own focused agent pass.
- **Object URL leaks.** Every `URL.createObjectURL` for an image must be revoked on unmount/replace; centralize in `lib/images.ts`.
- **Autosave thrash** while dragging nodes. Debounce; consider not autosaving on every drag-tick (save on drag-stop).
- **Export file size** with several embedded map images (base64). Acceptable for MVP; revisit zip export if files get unwieldy.
- **localStorage vs IndexedDB clearing.** Communicate to users (small note in UI) that data is browser-local and export is their real backup.

## 5. Open decisions / clarifying questions
These don't block the build — the architecture picks a sensible default for each — but your answers will refine it. Defaults in **bold**.

- **Q1 — Cross-ref directionality.** When I link a Plot Card to a Location, should it be **one bidirectional link (auto-appears in both bullet lists)**, or two independent one-way lists? Default assumes bidirectional.
- **Q2 — Relationship line direction.** Are plot relationships **undirected (plain line)** or directed (arrowhead source→target)? Default undirected; the data model stores source/target either way, so adding arrows later is trivial.
- **Q3 — Export format.** **Single self-contained `.json` with base64 images** (portable, larger) vs a `.zip` (smaller, more code)? Default base64.
- **Q4 — Multiple projects open?** Confirm: one active project at a time, with new/switch (no tabs)? Default **one at a time**.
- **Q5 — Import entry point.** Where should "Import project from file" live — inside the **Switch Project modal** ("Import…") and/or the New Project flow? Default: in the Switch Project modal.
- **Q6 — TypeScript?** Strongly recommended given the reference-heavy model. Confirm **yes**; if you'd rather plain JS, say so and I'll adjust the task specs.
- **Q7 — Same-view card linking UX.** For the chain-link button, do you prefer **click-button-then-click-target-card** (no drag), or react-flow's native drag-from-handle to connect? Default click-then-click (clearer, less fiddly).
- **Q8 — Delete affordances.** Not in your spec but needed: OK to add a small delete/trash control on cards, locations, and lines (with confirm)? Default **yes**.
- **Q9 — Description format.** Plain text vs lightweight markdown for card/location descriptions? Default **plain text** for MVP.
- **Q10 — Styling library.** Tailwind acceptable, or do you have a preference (CSS Modules, vanilla)? Default **Tailwind**.

## 6. Future enhancements (post-MVP backlog)
Accounts + cloud sync (would add a backend: Cloudflare D1/Workers or a small API); real-time collaboration; undo/redo; global search across cards/locations; tags & filtering; rich-text/markdown descriptions; multiple maps per project; node grouping/folders; mobile/touch layout; auto-layout for plot graphs; PNG/PDF export of a view; templates.
