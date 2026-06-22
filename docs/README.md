# Plot & Map — Planning Package

Handoff documents for building the MVP. Stack: **React + Vite + @xyflow/react + Zustand + Dexie/IndexedDB**, deployed on **Cloudflare Pages**.

## Read in this order
1. **ARCHITECTURE.md** — tech stack, data model, store shape, persistence, react-flow plan, cross-view state machine, folder structure, deployment.
2. **PROJECT_PLAN.md** — scope, milestones (M0–M7), risks, **open decisions/clarifying questions**, future backlog.
3. **TASK_BREAKDOWN.md** — granular, agent-ready tasks (T1.1 … T9.1) with acceptance criteria, dependencies, and files.

## Wireframes (`/wireframes`)
- `01-plot-view.svg` — Plot canvas + floating left toolbar (top/bottom sections).
- `02-plot-card-states.svg` — Plot Card collapsed vs expanded (Location node is identical).
- `03-link-line-description.svg` — clickable relationship line with editable description.
- `04-map-view.svg` — Map canvas, background image, Location markers, toolbar.
- `05-cross-view-linking.svg` — selection-mode flow for linking across views.

## Before implementation starts
Answer **Q1–Q10** in PROJECT_PLAN.md §5. The architecture picks sensible defaults, so none of them block scaffolding — but Q1 (cross-ref directionality), Q6 (TypeScript), and Q7 (link UX) most shape the task specs.
