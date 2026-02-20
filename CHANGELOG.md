# Changelog

All notable changes to the Model City EMS Dashboard are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v4.2.0] - 2026-02-20

### Added

- **Multi-Route Ranked Visualization**: Dispatching now shows the top 3 optimal routes (1st, 2nd, 3rd choice).
- **Style Differentiating**: Routes are styled with white solid (1st), dashed (2nd), and dotted (3rd) lines.
- **Sequential Route Animation**: Routes animate edge-by-edge from source to destination.
- **Interactive Route Info**: Clicking a dispatched route edge shows a detailed popup with time, cost, reliability, and AI selection reasoning.
- **Dispatch Centre Renaming**: All "Hospitals" renamed to "Dispatch Centres" to reflect multi-agency coverage (Police, Fire, EMS).
- **Vehicle Generalization**: "Ambulances" (AMB*) renamed to "Vehicles" (VEH*) for consistent terminology.

### Fixed

- **Scrollable Side Panels**: Fixed right panel layout to allow vertical scrolling when list items exceed height.

## [v4.1.0] - 2026-02-20

### Added

- **Collapsible Side Panels**: Both left and right panels can now be minimized.
- **Time Bar**: Dedicated row for time controls.
- **Dropdowns**: Consolidated routing and severity controls.

# Documentation Updates

### 9.1 Layout Grid

The UI is organized as a three-row, three-column responsive grid:

- **Row 1**: Header (56px) - Logo, stats, policy, tools
- **Row 2**: Time Bar (32px) - Global time slider and period indicator
- **Row 3**: App Body - Left Panel (256px), Graph (Flexible), Right Panel (220px)

### 9.2 Collapsible Panels

Side panels (Incidents and Dispatch Centre/Legend) can be collapsed to a 36px strip to maximize the graph area.

- Clicking the toggle collapses the panel to a 36px vertical strip showing a rotated label and the toggle icon
- Clicking again expands the panel to its original width
- CSS `grid-template-columns` transitions smoothly (300ms ease) during collapse/expand
- `Graph.cy.resize()` called after transition to recalculate graph viewport
- `window.togglePanel(side)` global function added to `controls.js`
- `.side-panel.collapsed` CSS state hides all inner content except the panel header

### 9.3 Multi-Route Visualization

Dispatched routes are visualized as white lines with ranked styles:

- **Solid**: Primary (Chosen) route.
- **Dashed**: 2nd most optimal according to policy.
- **Dotted**: 3rd most optimal.
  Clicking any route edge reveals the **Route Info Popup** with performance metrics.(`«` / `»`) in the panel header

### Added — Time Bar

- Time slider moved from the header into a **dedicated 32px time bar** below the header, spanning the full viewport width
- Clock display (`HH:MM`) and period label remain alongside the slider
- Slider now has the full bar width (minus clock) available, preventing overflow
- New CSS variable `--timebar-h` (32px) added; `body` grid updated to 3-row layout: `header → time-bar → body`

### Changed — Routing Policy → Dropdown

- Replaced four policy pill buttons (`⏱ Time`, `💰 Cost`, `⚡ Reliability`, `⬡ Pareto`) with a single themed `<select>` dropdown
- Custom SVG caret arrow, cyan accent border, dark panel-themed option list
- `State.setPolicy()` updated to accept a single `policy` argument (no button ref); syncs dropdown value
- Space saved in header allows room for future tool buttons

### Changed — Severity Filter → Dropdown

- Replaced five filter pill buttons (`All / CRIT / URG / MOD / MIN`) with a themed `<select>` dropdown in the left panel
- Each option uses an emoji indicator for severity color coding
- `UI._initFilters()` simplified — event now wired via `onchange` in HTML
- `UI.applyFilter()` updated to sync the dropdown value
- Space saved in the filter bar reduces vertical footprint of the incident panel

### Changed — `index.html`

- Removed inline time control from `header-right`
- Added `.time-bar` section between header and app body
- Added `id=\"app-body\"` to main body grid div for JS-driven class toggling
- Panel headers now include `.panel-toggle-btn` buttons
- Filter bar uses `<select>` with `<label>` instead of button group

### Changed — `css/main.css`

- Added `.time-bar` styles, `.policy-select`, `.sev-filter-select`, `.filter-label`
- Added `.panel-toggle-btn` and `.side-panel.collapsed` state rules
- Added `.app-body.left-collapsed`, `.app-body.right-collapsed` grid overrides
- Added `transition: grid-template-columns .3s ease` to `.app-body`
- Updated `body` grid to 3-row layout with `--timebar-h`
- Old `.time-control` scoped styles replaced with `.time-bar` scoped equivalents

### Changed — `js/state.js`

- `setPolicy(p)` signature simplified (removed `btn` parameter); syncs `#policy-select` dropdown

### Changed — `js/ui.js`

- `_initFilters()` simplified — no button event wiring needed
- `applyFilter()` now syncs `#sev-filter-select` dropdown value

### Changed — `js/controls.js`

- Added `window.togglePanel(side)` function for panel collapse/expand

---

## [v4.0.0] — 2026-02-20 — Multi-Incident Response Simulator

Complete architectural rebuild. Introduced four formal logical layers (Graph, State, Logic, UI) following the _Operational Multi-Incident Response Simulation UI_ specification. The system is now a generalized institutional response network simulator, not a hospital-specific tool.

### Added — Architecture

- **`state.js`** — New dedicated State Layer module. Centralizes all mutable application state: routing policy, incident queue, dispatch assignments, per-vehicle status, and per-center unit capacity. All other modules access state through named getters/setters; no module holds its own state.
- **`routing.js`** — New dedicated Logic Layer module. Contains the complete routing pipeline: Dijkstra shortest path, multi-objective route evaluation, Pareto dominance filtering, policy-based selection, greedy multi-incident assignment, and path highlighting.
- **`modal.js`** — New dedicated UI Layer module for the fullscreen blur overlay modal. Separate from the tooltip and panel system.
- Script load order enforced in `index.html`: `data → graph → state → routing → modal → ui → resilience → highlighter → controls`

### Added — Generalized Node Model

- Every Cytoscape node now carries a `category` field computed via `State.getCategory()`: hospitals → `response_center`, markets → `facility`, intersections → `junction`, incident nodes → `incident`
- Routing engine filters by `category === 'response_center'` and `availableUnits > 0`, never by `node_type === 'hospital'` directly
- Adding new institution types (police, fire brigade, NGO) requires only new data entries and a one-line addition to `getCategory()` — zero routing code changes

### Added — Routing Engine

- **Dijkstra** shortest path using `cy.elements().not('.severed').dijkstra()` with congested travel time as edge weight, excluding resilience-severed edges from path computation
- **Multi-objective route evaluation** per center→incident pair: `time` (sum of congested edge weights), `cost` (sum of total_cost MWK), `reliability` (1 − mean γ), `balance` (1 / availableUnits)
- **Pareto dominance filter** — non-dominated subset; A dominates B iff A is no worse on all four objectives and strictly better on at least one
- **Policy-based selection** from Pareto front:
  - `time` → minimum travel time
  - `cost` → minimum operational cost
  - `reliability` → maximum route reliability
  - `pareto` → balanced composite (40% time + 30% cost + 30% reliability), normalized within the Pareto set
- **Edge percentile ranking** — pre-sorted arrays for binary-search O(log n) lookup; each edge reports its percentile rank on time, cost, criticality, and failure rate vs all 200 edges
- **Greedy multi-incident assignment** — sorts queue by severity (critical first), greedily commits one center per incident, prevents double-assignment in same batch

### Added — Single Incident Dispatch

- **▶ Dispatch** button on each incident card runs full Pareto pipeline and draws route immediately
- Route drawn with unique color from 8-color pool; glow shadow applied; incident node border changes to route color
- Entry added to Dispatch Log with all four scores and Pareto front size

### Added — Multi-Incident Queue

- **+ Queue / − Queue** toggle buttons on each incident card; bidirectional toggle
- Incident cards visually marked as queued (amber left border, amber background tint)
- Footer counter badge showing number of queued incidents; DISPATCH ALL button enables only when queue > 0
- **▶ DISPATCH ALL** triggers `Routing.dispatchQueue()` — severity-sorted greedy assignment over all queued incidents
- Queue cleared automatically after batch dispatch

### Added — Routing Policy Header Controls

- Policy block in header: ⏱ Time / 💰 Cost / ⚡ Reliability / ⬡ Pareto — four pill buttons
- Active policy stored in `State.getPolicy()`; displayed in sidebar Live Stats panel
- Policy change takes effect for all subsequent dispatches immediately

### Added — Incident Dispatch Modal (new modal type)

- Clicking any incident node opens the fullscreen blur modal instead of the node panel
- Modal shows: severity badge, incident ID, node, call time, service duration, description
- Per-center dispatch cards showing time / cost / reliability / hop count / available units
- **Pareto badge** (⬡ cyan) on non-dominated centers
- **★ RECOMMENDED** badge (green) on the policy-selected center
- Per-card DISPATCH button (disabled if no units); clicking dispatches and closes modal
- Pareto front size and active policy shown in subheader
- "+ ADD TO DISPATCH QUEUE" button for adding from the modal

### Added — Edge Analytics Modal (enhanced from v3 tooltip-only)

- Clicking any edge opens the fullscreen blur modal (previously: only hover tooltip existed)
- Modal grid layout: transport metrics left column, criticality + percentile bars right column
- **Percentile bar charts** — four horizontal bars showing this edge's rank among all 200 edges: travel time, cost, criticality ρ, failure rate γ
- Congestion status label: FREE FLOW / MODERATE / HEAVY / SEVERE with matching color
- Criticality class label: MINIMAL / LOW — alternative route / MEDIUM — significant link / HIGH — bottleneck corridor
- Full ρ bar from 0→1 with threshold-appropriate color

### Added — Fullscreen Blur Modal

- `backdrop-filter: blur(10px)` overlay covering the full viewport
- Clicking outside the modal box closes it
- Smooth `fadeIn` + `slideIn` CSS animations on open
- Scrollable content area for long incident cards
- `modal-close-btn` always visible in top-right corner
- Modal content completely replaced on each `Modal.open()` call

### Added — Dispatch Log (right panel)

- Running log of all completed dispatches
- Each entry: colored route swatch, incident ID, policy used, center and vehicle assigned, severity badge, and four scores (time / cost / reliability / Pareto front size)
- Updated by `UI.refreshDispatchLog()` after every `_commitAssignment()`

### Added — Vehicle Status Tracking

- `State.vehicleStatus` map tracks `available` vs `dispatched` per vehicle ID
- `State.getAvailableVehiclesAt(nodeId)` returns vehicles at a center that are still available
- Vehicle list in right panel shows 🟢 available / 🔴 DISPATCHED status
- `UI.refreshVehicleList()` called after every dispatch

### Added — Header Stats (new fields)

- "Queued" counter — number of incidents in the dispatch queue
- "Dispatched" counter — total completed dispatches this session
- "Avg Route" — average congested travel time across all network edges

### Changed — `graph.js`

- Added `category` field to all node data objects (computed via `State.getCategory()`)
- Added `reapplyBaseStyles()` public method — restores base edge colors after `Routing.clearAll()` removes inline styles applied by path highlighting
- Edge click event now calls `Modal.showEdge(d)` instead of opening the node panel
- Node click event now checks `d.has_incident`; if true, calls `Modal.showIncident()` instead of `UI.showNodePanel()`
- All Cytoscape style selectors consolidated into `buildStyle()` including candidate, severed, hl-active classes (previously scattered across modules)

### Changed — `ui.js`

- Incident cards redesigned: three-row layout (badge+ID+time / meta / action buttons)
- Action buttons per card: ▶ Dispatch, + Queue / − Queue (toggle), ⊙ Locate
- `refreshIncidentList()` rebuilds full card list from scratch (preserves queue state from `State`)
- `updateIncidentStatus(nodeId, 'dispatched')` dims dispatched cards
- `toggleQueue()` exported for HTML onclick use

### Changed — `controls.js`

- Bootstrap sequence extended: `State.init()` before `Graph.init()`; `Routing.buildEdgeStats()` before `UI.init()`
- All module init calls explicitly ordered with comments

### Changed — `index.html`

- Added modal overlay markup at top of body (above header, below `<body>`)
- Added routing policy buttons block between stats and tool buttons
- Incident left panel now has dispatch footer with queue count and DISPATCH ALL button
- Right panel now has Dispatch Log section between Live Stats and Vehicles
- Node Highlighter panel re-ordered to load before Resilience panel in z-index stack

### Changed — `css/main.css`

- Added modal overlay, modal box, modal grid, modal card, percentile bar styles
- Added policy button, dispatch footer, dispatch log entry styles
- Added vehicle chip `.busy` variant (amber tint)
- Added route legend item styles (`.rl-item`, `.rl-swatch`, `.rl-time`)
- Incident card styles revised for three-row layout and action buttons

---

## [v3.0.0] — 2026-02-20 — Component Split + Threshold Input + Node Highlighter

Full component-based rebuild. Split from a monolithic HTML file into six separate source files. Added threshold number input synced with slider. Added node highlighter panel.

### Added — Component Structure

Project split from single HTML file into:

```
ems-v3/
├── index.html
├── css/main.css
└── js/
    ├── data.js
    ├── graph.js
    ├── ui.js
    ├── resilience.js   (new)
    ├── highlighter.js  (new)
    └── controls.js
```

### Added — Resilience Threshold Number Input

- `<input type="number">` field alongside the resilience slider
- Typing a value updates the slider fill and position immediately
- Dragging the slider updates the number input text
- `blur` event clamps and formats the input to two decimal places
- `±` nudge buttons (step ±0.05) flanking the input
- **Full bidirectional sync** between input and slider — previously the slider was the only control

### Added — Node Highlighter Panel (`highlighter.js`)

- New `⬡ HIGHLIGHT` tool button in header, opens panel from bottom-left of graph
- **Type selector** (2×2 grid): Hospitals, Markets, Intersections, Incidents — multi-select
- **Zone selector** (row): CBD, Residential, Peri-Urban — multi-select
- **Filter logic**: type AND zone (both active → only nodes matching both highlighted)
- **Style selector**: Glow (static shadow), Pulse (animated), Both
- **Pulse animation** via `requestAnimationFrame` loop oscillating `hlOpacity` data field between 0.4 and 1.0
- Count badges on type buttons populated from `CY_NODES`
- Status text showing number of highlighted nodes
- ✕ Clear All resets selections and removes all highlights
- Per-type highlight colors: hospital=red, market=amber, intersection=cyan, incident=pink
- Per-zone highlight colors: CBD=green, residential=blue-purple, peri-urban=orange
- Cytoscape `.hl-active` selector driven by per-node data fields (`hlBorder`, `hlShadow`, `hlBlur`, `hlOpacity`)

### Added — Gamma Mode in Resilience

- Mode toggle row: **ρ Criticality** / **γ Reliability**
- Slider max adjusts to 0.6 in gamma mode (practical γ range)
- Mode label above the input updates to match
- Mode label text: `ρ CRITICALITY` or `γ RELIABILITY`

### Changed — `resilience.js` (extracted from v2 inline script)

- Extracted from monolithic HTML into standalone `resilience.js`
- `Resilience.nudge(delta)` added for ± buttons
- `Resilience.setMode(m)` now updates slider max and re-evaluates candidates
- `syncSliderToThreshold()` and `syncSliderFill()` internal helpers for bidirectional sync

### Changed — `graph.js` (extracted from v2 inline script)

- Extracted from monolithic HTML into standalone `graph.js`
- Added `reapplyBaseStyles()` stub (used in v4)

### Changed — `ui.js` (extracted from v2 inline script)

- Extracted into standalone `ui.js`
- `Tooltip` separated into its own module (`window.Tooltip`) in the same file

### Changed — `controls.js` (extracted from v2 inline script)

- Extracted into standalone `controls.js`
- Bootstrap sequence simplified: `Graph.init()` → `UI.init()` → `Resilience.init()` → `Highlighter.init()`

### Fixed

- Tool panels (resilience, highlighter) anchor to the corners of the graph area, not the viewport — prevents layout issues when the graph area is not full-width

---

## [v2.1.0] — 2026-02-20 — Popup Fix

### Fixed

- Removed `backdrop-filter: blur(8px)` from the node panel — this was causing the entire graph to be blurred when the panel was open
- Removed `backdrop-filter: blur(8px)` from the edge tooltip
- Removed `backdrop-filter: blur(8px)` from the header
- Node panel repositioned from floating overlay to flush bottom-left tray (anchored at `bottom:0; left:0`) with only a top border and right border, removing the visual intrusion on the graph
- Node panel width reduced from `min-width: 300px; max-width: 420px` to fixed `280px`
- Node panel typography compacted: title size 1rem → 0.9rem, meta font-size 0.62rem → 0.58rem, section head margins reduced

---

## [v2.0.0] — 2026-02-20 — Full Dashboard Rebuild

Major feature expansion. Transitioned from basic graph visualization to a full operations dashboard with time-dependent routing, resilience analysis, and interactive dispatch.

### Added — 24h Time Slider

- Continuous range input (0–1440 minutes) in the header controlling simulation time
- Slider track fill updates as a CSS gradient showing progress
- Slider zone background: color-coded stripes for each of the 5 time periods painted by `paintSliderZones()`
- Clock display updates in real time: `HH:MM` format
- Period label updates: NIGHT / AM PEAK / MIDDAY / PM PEAK / LATE EVE
- All 200 edge `currentMult` values recalculated on every `input` event
- Congestion transitions interpolated smoothly over the last ~15 minutes of each time slot

### Added — Smooth Congestion Color Gradient

- Edge congestion color replaced with a continuous 5-stop gradient: green (×1.0) → lime (×1.2) → amber (×1.5) → orange (×2.0) → red (×2.5)
- `multToColor(mult)` function linearly interpolates RGB values between adjacent stops
- Replaced the previous 4-band threshold system

### Added — Edge Width = Criticality ρ

- Edge width now encodes criticality: `width = base + ρ × 4`, capped at 9px
- Base widths: trunk=4px, primary=2.5px, residential=1.5px
- High-ρ corridors (e.g. Market_4→Market_1 at ρ=1.0) become visually thick and prominent

### Added — Severity Filter Chips

- Five filter buttons on the incident panel: All / CRIT / URG / MOD / MIN
- Active state highlighted in per-severity color
- Incident count badge updates to show visible count

### Added — Live Network Stats

- Header: "Congested" edges counter (threshold: ×1.3), "Avg Time" across all edges
- Right sidebar: Period, Normal multiplier, Market multiplier, Congested count, Avg time, Total network cost

### Added — Resilience Analysis Panel

- **⬡ RESILIENCE MODE** toggle button in header (amber theme)
- Panel slides up from bottom-right of graph on activation
- ρ threshold slider (0.0–1.0) highlights matching edges as dashed amber with orange glow
- Click highlighted edge → removes it from graph; appears in Removed Edges list
- Individual ↩ RESTORE buttons per removed edge
- RESTORE ALL button resets network
- Candidate count badge updates live

### Changed — Edge Tooltip

- Tooltip now shows 8 fields: road type+lanes+market flag, length, base time, current congested time (color-coded), multiplier (color-coded), cost (MWK), reliability class + γ, criticality ρ + filled bar

### Changed — Incident List

- Click on incident card flies the camera to the incident node on the graph (zoom 2.4, 380ms animation)

### Changed — Node Panel

- Click on non-incident node opens bottom-left overlay panel
- Shows: node name, ID, type, zone, based vehicles (chips), active incidents (severity badges), out/in edge count, market road count

---

## [v1.0.0] — 2026-02-20 — Initial Build

First working dashboard. Converted raw CSV simulation data into an interactive Cytoscape.js visualization with a dark NOC-style interface.

### Added — Data Embedding

- Python script processed 8 CSV files into JavaScript constants embedded in HTML:
  - `CY_NODES` (40 nodes with coordinates, type, zone, incident/base flags)
  - `CY_EDGES` (200 edges with road type, length, times, criticality, gamma, costs)
  - `INCIDENTS` (15 incidents with severity, priority, times)
  - `VEHICLES` (5 ambulances with base nodes, crew, fuel specs)
  - `TIME_PROFILES` (5 time periods with normal and market multipliers)
  - `RELIABILITY_PARAMS`, `OPERATIONAL_COSTS` lookup tables
- Node coordinates mapped to pixel space: `x × 75`, `y = (10 − y) × 75` (y-axis flipped)

### Added — Graph Visualization

- Cytoscape.js with `preset` layout (actual survey coordinates)
- **Hospitals**: 46px red-border circles with double border for bases, red glow shadow
- **Markets**: 34px amber diamond shapes with glow
- **CBD intersections**: 26px dark blue circles
- **Peri-urban intersections**: 26px dim navy circles
- **Incident nodes**: red pulsing border ring (CSS `@keyframes pulse-ring`)
- **Trunk roads**: 4–5px gold lines with glow
- **Primary roads**: 2.5px cyan lines with subtle glow
- **Residential roads**: 1.5px dim navy lines
- Edge arrows: `triangle` target arrow, `bezier` curves
- Edge width encodes lane count
- Initial edge color: period-appropriate congestion color

### Added — UI Layout

- 3-column grid: left panel (incidents) / center (graph) / right panel (legend + stats)
- Fixed 52px header with logo, stats bar, time controls
- Dark NOC aesthetic: `#060e18` background, `#00b8e0` cyan accent, `Share Tech Mono` + `Barlow Condensed`
- 44px CSS grid texture overlay at 2% opacity
- Corner bracket decorations on graph area

### Added — Incident Panel

- 15 incident cards sorted by priority
- Severity badges (CRIT / URG / MOD / MIN) color-coded
- Left border color per severity
- Click navigates camera to incident node

### Added — Ambulance Panel

- 5 vehicle entries in right panel: ID chip, base node name, priority rank, crew size

### Added — Time Period Selector

- 5 pill buttons for manual period selection: Night / AM Peak / Midday / PM Peak / Late Eve
- Edge colors update on period change via `refreshEdgeColors()`
- Period multipliers shown in right panel stats

### Added — Edge Hover Tooltip

- Appears on mouse hover; follows cursor
- Shows: source→target, edge ID, road type+lanes+market flag, length, base time, current congested time, multiplier, cost MWK, reliability class + γ, criticality ρ + color-coded bar

### Added — Node Detail Panel

- Click any node → bottom-center overlay with node info, incident badges, based vehicles

### Added — Legend

- Node types: hospital / market / CBD intersection / other intersection / incident location
- Road types: trunk / primary / residential / market road line samples
- Reliability: medium (green glow) / low variants

### Added — Congestion Scale

- Centered at the bottom of the graph: labeled gradient bar ×1.0 → ×2.5
