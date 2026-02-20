# Zomba EMS — Multi-Incident Response Simulator

> A browser-based, multi-objective emergency vehicle routing dashboard built on sample urban network data. Models the full G(V=40, E=200) directed transport graph with time-dependent congestion, simultaneous multi-incident dispatch, Pareto-optimal route selection, and interactive network resilience analysis.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Research Context](#2-research-context)
3. [Dataset Description](#3-dataset-description)
4. [Architecture](#4-architecture)
5. [File Structure](#5-file-structure)
6. [Module Reference](#6-module-reference)
7. [Features](#7-features)
8. [Routing Engine](#8-routing-engine)
9. [UI Layer](#9-ui-layer)
10. [Resilience Analysis](#10-resilience-analysis)
11. [Node Highlighter](#11-node-highlighter)
12. [Running the Application](#12-running-the-application)
13. [Extending the System](#13-extending-the-system)
14. [Design System](#14-design-system)
15. [Known Limitations](#15-known-limitations)
16. [Glossary](#16-glossary)

---

## 1. Project Overview

This dashboard is a **decision-support prototype** for emergency vehicle routing in Zomba, Malawi. It was built as a research demonstration tool to accompany a multi-objective optimization study of urban emergency response networks.

The system is designed around four separable logical layers:

| Layer           | Purpose                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Graph Layer** | Cytoscape.js network rendering with real coordinates and time-dependent edge weights          |
| **State Layer** | Single source of truth for policy, incident queue, assignments, and vehicle capacity          |
| **Logic Layer** | Dijkstra shortest path, multi-objective scoring, Pareto dominance filtering, policy selection |
| **UI Layer**    | Incident panel, dispatch modal, edge tooltip, node panel, dispatch log                        |

The architecture is fully **institution-agnostic**: the routing engine operates on abstract categories (`response_center`, `facility`, `junction`, `incident`) derived from the underlying node types. Adding police stations, fire brigades, NGO depots, or any other node class requires only data changes — no routing code modifications.

---

## 2. Research Context

The model represents the **Zomba urban transport network** as a directed weighted graph:

```
G = (V, E)
|V| = 40 nodes   (3 hospitals, 4 markets, 33 intersections)
|E| = 200 edges  (directed, weighted by time-dependent travel time)
```

Each edge carries four optimization-relevant attributes:

- **Travel time** — base free-flow time scaled by a time-of-day congestion multiplier
- **Operational cost** — fuel + maintenance + wage costs in Malawian Kwacha (MWK)
- **Reliability** — modelled via failure rate parameter γ ∈ [0.225, 0.6]
- **Criticality** — network centrality measure ρ ∈ [0, 1]

The routing engine implements a **multi-objective optimization** pipeline:

1. Compute all feasible routes from available response centers to each incident node using Dijkstra's algorithm with congested travel time as the edge weight
2. Evaluate each route on all four objectives (time, cost, reliability, balance)
3. Filter to the **Pareto-optimal (non-dominated) set**
4. Apply the active routing policy to select a single solution from the Pareto front

This allows the system to demonstrate how policy choice (minimise time vs. minimise cost vs. maximise reliability vs. balanced Pareto) leads to meaningfully different route assignments — which is the core argument of the underlying research.

---

## 3. Dataset Description

All data is embedded in `js/data.js` and sourced from the simulation dataset for Zomba.

### 3.1 Nodes (`CY_NODES` — 40 nodes)

| Type           | Count | Role                                                                       |
| -------------- | ----- | -------------------------------------------------------------------------- |
| `hospital`     | 3     | Response centers; ambulance bases; routing origin points                   |
| `market`       | 4     | High-congestion facility nodes; market roads carry 2–2.5× peak multipliers |
| `intersection` | 33    | Standard network junctions; subdivided into CBD and peri-urban zones       |

Each node carries: `id`, `label`, `node_type`, `zone` (CBD / residential / peri-urban), `has_incident`, `is_base`, and 2D coordinates mapped to pixel positions.

### 3.2 Edges (`CY_EDGES` — 200 directed edges)

| Field                  | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| `road_type`            | `trunk`, `primary`, or `residential`                         |
| `lanes`                | Integer 1–4                                                  |
| `length_km`            | Physical road length                                         |
| `free_speed_kmh`       | Free-flow design speed                                       |
| `base_travel_time_min` | Free-flow travel time                                        |
| `is_market_road`       | Boolean — market roads get higher peak multipliers           |
| `criticality` (ρ)      | Network criticality score ∈ [0, 1]; mean = 0.108             |
| `gamma` (γ)            | Failure rate parameter; values: 0.225, 0.25, 0.375, 0.4, 0.6 |
| `rel_class`            | Reliability class: `medium` (γ ≤ 0.25) or `low`              |
| `total_cost`           | Total operational cost per edge traversal in MWK             |
| `fuel_cost`            | Fuel component of total cost                                 |

### 3.3 Incidents (`INCIDENTS` — 15 incidents)

Distributed across 15 unique nodes. Each carries: `incident_id`, `node_id`, `call_time_hours`, `call_time_formatted`, `severity` (critical / urgent / moderate / minor), `priority` (1–4), `service_time_min`, and `description`.

### 3.4 Vehicles (`VEHICLES` — 5 ambulances)

| Field                           | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `vehicle_id`                    | `AMB_01` through `AMB_05`                            |
| `base_node`                     | Node ID of the hospital this vehicle is stationed at |
| `priority_rank`                 | Dispatch priority (1 = highest)                      |
| `crew_size`                     | Integer                                              |
| `fuel_capacity_L`               | Tank size                                            |
| `avg_fuel_consumption_L_per_km` | Consumption rate for cost modelling                  |

### 3.5 Time Profiles (`TIME_PROFILES` — 5 periods)

| Period         | Hours       | Normal × | Market × | Description                                       |
| -------------- | ----------- | -------- | -------- | ------------------------------------------------- |
| `night`        | 00:00–06:00 | 1.0      | 1.0      | Free flow; baseline                               |
| `morning_peak` | 06:00–09:00 | 1.5      | 2.3      | School + commuter rush                            |
| `midday`       | 09:00–15:00 | 1.2      | 1.8      | Moderate market activity                          |
| `evening_peak` | 15:00–19:00 | 1.6      | 2.5      | Worst congestion; market roads nearly grid-locked |
| `late_evening` | 19:00–24:00 | 1.1      | 1.2      | Winding down                                      |

Congestion transitions are **interpolated smoothly** in the final 15 minutes of each period to avoid hard color jumps on the graph.

---

## 4. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         index.html                           │
│  (layout shell — no logic, all structure and script tags)    │
└────────────────┬─────────────────────────────────────────────┘
                 │  loads in order:
    ┌────────────▼────────────────────────────────────────┐
    │  js/data.js          Raw simulation data (85 KB)    │
    │  js/graph.js         Graph Layer                    │
    │  js/state.js         State Layer                    │
    │  js/routing.js       Logic Layer                    │
    │  js/modal.js         UI Layer — Modal               │
    │  js/ui.js            UI Layer — Panels              │
    │  js/resilience.js    Feature Module                 │
    │  js/highlighter.js   Feature Module                 │
    │  js/controls.js      Orchestration (runs last)      │
    └─────────────────────────────────────────────────────┘

    css/main.css            All visual styles (no JS inline styles
                            except Cytoscape element data bindings)
```

### Data flow on incident dispatch:

```
User clicks "▶ Dispatch" on incident card
  → Routing.dispatchSingle(nodeId)
    → State.getPolicy()
    → getEligibleCenters()           [State.getCenterUnits > 0]
    → evaluateRoute(center, incident) per center
        → cy.elements().dijkstra()
        → sum path: time, cost, gamma, edgeCount
    → paretoFilter(solutions)
    → selectByPolicy(paretoSet, policy)
    → _commitAssignment(selected, policy)
        → State.decrementCenter()
        → State.dispatchVehicle()
        → _highlightPath()
        → State.addAssignment()
        → UI.refreshDispatchLog()
        → UI.refreshVehicleList()
        → UI.updateIncidentStatus()
```

---

## 5. File Structure

```
ems-v4/
├── index.html              Main HTML shell (markup only, no logic)
├── css/
│   └── main.css            Complete stylesheet (~33 KB)
└── js/
    ├── data.js             Embedded simulation data (~85 KB)
    │                       CY_NODES, CY_EDGES, INCIDENTS, VEHICLES,
    │                       TIME_PROFILES, reliability_params, costs
    ├── graph.js            Graph Layer — Cytoscape init + event binding
    ├── state.js            State Layer — policy, queue, assignments
    ├── routing.js          Logic Layer — Dijkstra, Pareto, dispatch
    ├── modal.js            UI Layer — fullscreen blur modal
    ├── ui.js               UI Layer — incident list, dispatch log, panels
    ├── resilience.js       Feature — edge removal resilience analysis
    ├── highlighter.js      Feature — node type/zone highlighting
    └── controls.js         Orchestration — bootstraps all modules
```

The standalone deliverable (`zomba_ems_v4.html`) is a single self-contained HTML file with all CSS and JavaScript inlined. It requires no server, no build step, and no internet connection beyond the initial Google Fonts and Cytoscape.js CDN loads.

---

## 6. Module Reference

### `data.js`

Pure data. Exports global constants: `CY_NODES`, `CY_EDGES`, `INCIDENTS`, `VEHICLES`, `TIME_PROFILES`. No functions. Replace this file entirely to swap in a new network dataset.

---

### `graph.js` — Graph Layer

**Exposes:** `window.Graph`

| Method                              | Signature                       | Description                                                                             |
| ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| `init()`                            | `→ cy`                          | Builds Cytoscape instance with all elements and styles; binds hover/click events        |
| `setHour(h)`                        | `(number) → void`               | Recolors all edges for fractional hour h ∈ [0, 24]; interpolates congestion multipliers |
| `getCongestion()`                   | `→ {count, avgTime, totalCost}` | Live network stats for the header and sidebar                                           |
| `reapplyBaseStyles()`               | `→ void`                        | Restores base edge colors after Routing.clearAll() removes path highlights              |
| `multToColor(m)`                    | `(number) → string`             | Maps congestion multiplier to a CSS `rgb()` color along the 5-stop gradient             |
| `getMultiplierForHour(h, isMarket)` | `(number, bool) → number`       | Returns the congestion multiplier for a given hour and road type                        |
| `cy`                                | property                        | Live Cytoscape instance                                                                 |

**Node model:** Each node carries a `category` field computed via `State.getCategory()`:

| `node_type`                   | `category`        |
| ----------------------------- | ----------------- |
| `hospital`                    | `response_center` |
| `market`                      | `facility`        |
| `intersection`                | `junction`        |
| any with `has_incident: true` | `incident`        |

This abstraction means the routing engine never references "hospitals" directly.

**Cytoscape CSS classes in use:**

| Class        | Applied to | Effect                                              |
| ------------ | ---------- | --------------------------------------------------- |
| `.hovered`   | edges      | Brightens glow on hover                             |
| `.candidate` | edges      | Amber dashed + glow (resilience mode)               |
| `.severed`   | edges      | `display: none` (removed edges)                     |
| `.hl-active` | nodes      | Custom border + shadow from data fields             |
| `.hl-pulse`  | nodes      | Animated shadow opacity via `requestAnimationFrame` |

---

### `state.js` — State Layer

**Exposes:** `window.State`

Single source of truth. All other modules read state through getters and mutate through named methods.

| Method                                                                            | Description                                                             |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `init()`                                                                          | Initialises vehicle status map and center capacity from `VEHICLES` data |
| `getPolicy()` / `setPolicy(p, btn)`                                               | Active routing policy; also updates UI button highlight                 |
| `enqueue(id)` / `dequeue(id)` / `clearQueue()` / `isQueued(id)` / `getQueue()`    | Incident queue management; auto-updates badge counts                    |
| `addAssignment(a)` / `clearAssignments()` / `getAssignments()`                    | Assignment log                                                          |
| `getCenterUnits(id)` / `decrementCenter(id)`                                      | Per-center available unit tracking                                      |
| `dispatchVehicle(id)` / `getVehicleStatus(id)` / `getAvailableVehiclesAt(nodeId)` | Per-vehicle status                                                      |
| `getCategory(nodeData)`                                                           | Maps node_type → abstract category                                      |
| `nextColor()`                                                                     | Returns next route color from the 8-color pool                          |

---

### `routing.js` — Logic Layer

**Exposes:** `window.Routing`

| Method                              | Description                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `dispatchSingle(incidentId)`        | Evaluates all eligible centers → Pareto filter → policy selection → commit                                                             |
| `dispatchQueue()`                   | Sorts queue by severity, greedily assigns centers, commits all                                                                         |
| `evaluateRoute(center, incident)`   | Returns `{center, incident, path, time, cost, reliability, balance, edgeCount}`                                                        |
| `paretoFilter(solutions)`           | Returns non-dominated subset; dominance tested on time, cost, reliability, balance                                                     |
| `selectByPolicy(paretoSet, policy)` | Returns single solution: `time` → min time; `cost` → min cost; `reliability` → max reliability; `pareto` → weighted balanced composite |
| `clearAll()`                        | Removes all path styles, restores base edge colors, resets state                                                                       |
| `getEdgePercentiles(edgeData)`      | Returns percentile rank of an edge on time, cost, criticality, reliability vs all 200 edges                                            |
| `buildEdgeStats()`                  | Pre-sorts edge arrays for binary-search percentile lookup                                                                              |

**Edge weight function:** `w(e) = base_travel_time_min × currentMult`
The `currentMult` is stored as a data attribute on each Cytoscape edge and updated by `Graph.setHour()`.

**Pareto dominance definition:**
Solution A dominates Solution B if and only if A is at least as good as B on all four objectives and strictly better on at least one:

```
dominates(A, B) ≡
  A.time ≤ B.time   AND
  A.cost ≤ B.cost   AND
  (1 − A.reliability) ≤ (1 − B.reliability)   AND
  A.balance ≤ B.balance   AND
  (at least one strict inequality)
```

**Balanced Pareto selection:** When policy = `pareto`, scores are normalized within the Pareto set and combined as a weighted composite: 40% travel time + 30% cost + 30% inverse reliability.

---

### `modal.js` — UI Layer (Modal)

**Exposes:** `window.Modal`

| Method                                        | Description                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `open(html)`                                  | Opens the fullscreen blur overlay with arbitrary content                                   |
| `close()`                                     | Closes the modal                                                                           |
| `closeOnOverlay(event)`                       | Closes only if click was on the dark backdrop, not the modal box                           |
| `showEdge(edgeData)`                          | Renders full edge analytics: metrics, cost breakdown, percentile bar charts                |
| `showIncident(incidentData, nodeId)`          | Renders dispatch dialog: all centers evaluated, Pareto badges, per-center dispatch buttons |
| `dispatchFromModal(incidentNodeId, centerId)` | Triggers a forced dispatch to a specific center chosen in the modal                        |

The modal uses `backdrop-filter: blur(10px)` to visually blur the graph behind it, signalling a modal context shift without hiding the network data entirely.

---

### `modal.js` — Edge Modal Content

Shows for every edge click:

- Source → Target, Edge ID, road class
- Transport metrics: length, lanes, free speed, base time, current congested time, congestion status label
- Cost breakdown: total cost, fuel cost (in MWK)
- Reliability: class, γ value
- Criticality ρ: value, class label (Minimal / Low / Medium / High), filled bar from 0→1
- **Percentile bars**: where this edge ranks vs all 200 edges on travel time, cost, criticality, and failure rate

---

### `modal.js` — Incident Dispatch Modal Content

Shows for every incident node click:

- Incident ID, severity badge (color-coded), node, call time, service duration
- Description text
- **Per-center dispatch cards**: one card per eligible hospital showing time, cost, reliability, hop count, available units
- Each card is border-highlighted: green = recommended by active policy, cyan = Pareto-optimal, dim = non-optimal
- A ★ RECOMMENDED badge and per-center DISPATCH buttons
- Pareto front size and active policy shown in the header
- "+ ADD TO DISPATCH QUEUE" button for multi-incident batching

---

### `ui.js` — UI Layer (Panels)

**Exposes:** `window.UI`, `window.Tooltip`

`UI` methods:

| Method                                 | Description                                                |
| -------------------------------------- | ---------------------------------------------------------- |
| `init()`                               | Builds incident list, vehicle list, dispatch log           |
| `refreshIncidentList()`                | Rebuilds all incident cards with current queue state       |
| `refreshDispatchLog()`                 | Renders all active assignments in the right panel          |
| `refreshVehicleList()`                 | Updates vehicle chips with busy/available status           |
| `toggleQueue(nodeId, incidentId)`      | Adds or removes an incident from the dispatch queue        |
| `flyToIncident(nodeId, incidentId)`    | Animates Cytoscape camera to the incident node             |
| `updateIncidentStatus(nodeId, status)` | Dims dispatched cards                                      |
| `showNodePanel(node)`                  | Opens bottom-left node detail panel for non-incident nodes |
| `closeNodePanel()`                     | Closes node detail panel                                   |
| `applyFilter(sev)`                     | Hides incident cards not matching the severity filter      |

Each **incident card** in the left panel contains:

- Severity badge, incident ID, call time
- Node ID, service time, priority
- Three action buttons: **▶ Dispatch** (single), **+ Queue / − Queue** (toggle), **⊙ Locate** (fly to on graph)

---

### `resilience.js` — Resilience Analysis Module

**Exposes:** `window.Resilience`

| Method                | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `toggle()`            | Opens/closes the resilience panel; injects Cytoscape candidate/severed styles on first open |
| `setMode(m)`          | Switches filter between `rho` (criticality) and `gamma` (reliability)                       |
| `nudge(delta)`        | Adjusts threshold by ±0.05; syncs input and slider                                          |
| `restoreEdge(edgeId)` | Restores one removed edge; re-evaluates if it should be a candidate                         |
| `restoreAll()`        | Restores all removed edges and resets the removed list                                      |
| `init()`              | Wires threshold input ↔ slider bidirectional sync                                           |

**Threshold input ↔ slider sync:** Both controls are fully bidirectional. Typing a value in the number input updates the slider fill and position. Dragging the slider updates the number input text. Both clamp to [0, 1] (or [0, 0.6] in gamma mode).

---

### `highlighter.js` — Node Highlighter Module

**Exposes:** `window.Highlighter`

| Method                  | Description                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `toggle()`              | Opens/closes the highlighter panel; injects Cytoscape `.hl-active` style on first open |
| `toggleType(type, btn)` | Adds/removes a node type from the active selection                                     |
| `toggleZone(zone, btn)` | Adds/removes a zone filter (AND logic with type filter)                                |
| `setStyle(s, btn)`      | Sets highlight style: `glow`, `pulse`, or `both`                                       |
| `clearAll()`            | Clears all selections and removes all highlights                                       |
| `init()`                | Populates node-type count badges from CY_NODES                                         |

**Multi-selection logic:** If both type and zone filters are active, only nodes matching **both** are highlighted (AND semantics). If only one filter type is active, it applies alone.

**Pulse animation:** Implemented via `requestAnimationFrame` loop that oscillates the `hlOpacity` data attribute between 0.4 and 1.0 using `Math.abs(Math.sin(phase))`. This drives the Cytoscape shadow opacity without CSS animations, which don't apply to canvas-rendered elements.

Per-type highlight colors:

| Node type    | Border               | Shadow   |
| ------------ | -------------------- | -------- |
| Hospital     | `#f02040` (red)      | Red      |
| Market       | `#f0a500` (amber)    | Amber    |
| Intersection | `#00b8e0` (cyan)     | Cyan     |
| Incident     | `#ff3366` (hot pink) | Hot pink |

Per-zone highlight colors:

| Zone        | Border                  |
| ----------- | ----------------------- |
| CBD         | `#00e898` (green)       |
| Residential | `#8080ff` (blue-purple) |
| Peri-Urban  | `#ff9900` (orange)      |

---

### `controls.js` — Orchestration

Runs immediately as an IIFE on load. Initialises all modules in dependency order:

```
State.init()
Graph.init() + cy.fit()
Routing.buildEdgeStats()
UI.init()
Resilience.init()
Highlighter.init()
paintSliderZones()
time slider listener → Graph.setHour() + refreshStats()
```

---

## 7. Features

### 7.1 Time-Dependent Congestion

A 24-hour slider in a **dedicated time bar** below the header controls the simulation time. The slider spans the full viewport width for precision control. As the slider moves:

- Every edge's `currentMult` is recalculated using the active time profile
- Edge colors transition along a 5-stop gradient: free-flow green → lime → amber → orange → jam red
- Edge widths are scaled by criticality ρ, not congestion, so high-criticality corridors remain visually prominent
- The header "Congested" counter and average travel time update in real time
- The slider track itself shows a color-coded zone background (dark blue = night, brown = peaks)

Transitions between time periods are **smoothly interpolated** over the last 15 minutes of each slot to avoid hard color jumps.

### 7.2 Edge Hover Tooltip

Appears on edge hover. Shows:

- Source → Target, Edge ID
- Road type, lanes, market road flag
- Length (km)
- Base travel time (min)
- Current congested time (highlighted in congestion color)
- Congestion multiplier (×)
- Operational cost (MWK)
- Reliability class and γ value
- Criticality ρ with a filled color bar

### 7.3 Edge Click — Full Analytics Modal

Fullscreen blur overlay showing:

- All tooltip data plus free-flow speed
- Congestion status label (FREE FLOW / MODERATE / HEAVY / SEVERE)
- Criticality ρ class label and full 0→1 progress bar
- **Percentile rank bars** — how this edge compares to all 200 edges on travel time, cost, criticality ρ, and failure rate γ

### 7.4 Single Incident Dispatch

Click **▶ Dispatch** on any incident card:

1. Dijkstra runs from each eligible hospital
2. Solutions are Pareto-filtered
3. Active policy selects one
4. Route is drawn on graph in a unique color with a glow shadow
5. Entry appears in the Dispatch Log with scores

### 7.5 Incident Node Click — Dispatch Modal

Click any incident node on the graph:

- Modal opens with full incident details
- All response centers evaluated and shown as cards
- Pareto-optimal centers marked with ⬡ badge
- Policy-recommended center marked with ★ RECOMMENDED in green
- DISPATCH button per card (disabled if no units available)
- "+ ADD TO DISPATCH QUEUE" for multi-incident batching

### 7.6 Multi-Incident Queue Dispatch

1. Click **+ Queue** on multiple incident cards
2. Badge counter in the footer updates
3. Click **▶ DISPATCH ALL**
4. System sorts by severity (critical first), then greedily assigns one center per incident, preventing the same center from being assigned twice in one batch
5. All routes drawn simultaneously in different colors

### 7.7 Routing Policy Selector

A compact dropdown in the header offers four policies:

| Policy         | Algorithm                                                 |
| -------------- | --------------------------------------------------------- |
| ⏱ Time         | Select Pareto solution with minimum travel time           |
| 💰 Cost        | Select Pareto solution with minimum total cost            |
| ⚡ Reliability | Select Pareto solution with maximum route reliability     |
| ⬡ Pareto       | Balanced composite: 40% time + 30% cost + 30% reliability |

Policy change takes effect immediately for all subsequent dispatches.

### 7.8 Dispatch Log

Right panel tracks every completed dispatch with:

- Colored route swatch matching the graph path
- Incident ID, policy used
- Center assigned, vehicle dispatched
- Four scores: travel time, operational cost, reliability %, Pareto front size

### 7.9 Resilience Analysis Panel

Bottom-right of the graph. Activated by **⬡ Resilience** in the header.

- Enter a threshold in the number input (0.00–1.00) or drag the slider — both stay in sync
- ± nudge buttons for fine adjustment
- Switch between ρ (criticality) and γ (reliability) mode
- All edges meeting the threshold highlight as dashed amber
- Click any highlighted edge to remove it from the network (hidden, not deleted)
- Removed edges listed below with individual ↩ RESTORE buttons
- RESTORE ALL resets the network

### 7.10 Node Highlighter Panel

Bottom-left of the graph. Activated by **◎ Highlight** in the header.

- Select node types: Hospitals, Markets, Intersections, Incidents (multi-select)
- Select zones: CBD, Residential, Peri-Urban (AND logic with type filter)
- Three highlight styles: Glow (static shadow), Pulse (animated breathing), Both
- Count badges on each button show how many nodes of that type exist
- Status text shows how many nodes are currently highlighted
- ✕ Clear All removes all highlights instantly

---

## 8. Routing Engine

### 8.1 Eligibility Filter

A response center is eligible if:

1. `node_type === 'hospital'`
2. `State.getCenterUnits(id) > 0` (has available vehicles)
3. Not in the `excludedCenters` set (for multi-dispatch, prevents double-assignment)

### 8.2 Dijkstra Configuration

```js
cy.elements()
  .not(".severed")
  .dijkstra({
    root: center,
    weight: (edge) => edge.data("base_time") * edge.data("currentMult"),
    directed: false,
  });
```

Edges marked `.severed` (removed in resilience mode) are excluded from path computation, which allows the resilience analysis to show how route alternatives emerge when critical links are removed.

### 8.3 Route Scoring

For each feasible path:

| Objective     | Computation                                                     |
| ------------- | --------------------------------------------------------------- |
| `time`        | `dijkstra.distanceTo(incident)` — sum of congested edge weights |
| `cost`        | Sum of `total_cost` per edge in path                            |
| `reliability` | `1 − mean(gamma per edge)` — higher is better                   |
| `balance`     | `1 / availableUnits` — penalises overloading one center         |

### 8.4 Pareto Dominance

A solution A **dominates** B if A is no worse than B on all four objectives and strictly better on at least one. The Pareto-optimal set is the maximal subset where no solution is dominated by another.

For this dataset with three response centers, the Pareto front typically contains 1–3 solutions, making it computationally trivial (O(n²) pairwise comparison). The architecture is written to scale to larger center counts without algorithmic changes.

### 8.5 Greedy Multi-Incident Assignment

When dispatching a queue of k incidents:

1. Sort incidents by severity (critical → urgent → moderate → minor)
2. For incident i, find the best available center not yet committed in this batch
3. Commit assignment; mark center as used for this batch
4. Move to incident i+1

This is a greedy approximation of the optimal assignment problem. For a full symposium deployment, the Hungarian algorithm would provide optimal minimum-cost bipartite matching.

---

## 9. UI Layer

### 9.1 Layout Grid

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (56px): logo · stats · policy · tools          │
├─────────────────────────────────────────────────────────┤
│  TIME BAR (32px): clock · full-width slider             │
├──────────┬──────────────────────────────┬───────────────┤
│«        │         Graph (Cytoscape)    │       »       │
│Incidents│                              │ Legend        │
│ (256px) │                              │ Stats         │
│          │  [resilience panel]          │ Dispatch Log  │
│          │  [highlighter panel]         │ Vehicles      │
│          │  [node panel]                │ (220px)       │
├──────────┴──────────────────────────────┴───────────────┤
│  (no footer — graph extends full height)                │
└─────────────────────────────────────────────────────────┘
```

Both side panels are **collapsible** — click the `«` / `»` toggle button in the panel header to collapse a panel to a 36px strip. The graph area expands to fill the freed space, and Cytoscape resizes automatically.

Tool panels (resilience, highlighter) are positioned absolutely within the graph area — they do not push other content. The node panel anchors to bottom-left; the resilience panel to bottom-right.

### 9.2 Cytoscape Configuration

```js
cytoscape({
  container: document.getElementById("cy"),
  layout: { name: "preset" }, // uses actual survey coordinates
  minZoom: 0.3,
  maxZoom: 6,
});
```

Node positions are derived from the survey coordinates in `CY_NODES`, with x scaled ×75 and y-axis flipped (×75, inverted) to map to pixel space.

---

## 10. Resilience Analysis

The resilience module allows interactive **network fragility demonstration**:

1. Set threshold ρ ≥ 0.5 → the few high-criticality corridors (including the Market_4→Market_1 trunk at ρ=1.0 and several CBD arterials above ρ=0.8) highlight immediately
2. Remove 2–3 of these edges
3. Run a dispatch — Dijkstra now routes around the removed links
4. The resulting longer, slower, more expensive routes quantify the **cost of infrastructure failure**

This directly supports the research argument that ignoring criticality in routing policy leads to underestimating vulnerability: routes that appear optimal under normal conditions may fail entirely when key links are disrupted.

**Gamma mode** (reliability threshold): switching to γ mode highlights edges with high failure rates. Removing these simulates road closures due to disrepair or flooding — a common scenario in Zomba.

---

## 11. Node Highlighter

The highlighter serves a **presentation tool** role: rapidly drawing audience attention to specific node categories during a live demonstration.

**Typical demo sequence:**

1. Activate Glow → select Hospitals → show response center locations
2. Add Markets → show the high-congestion overlay relationship
3. Switch to Pulse → select Incidents → animate the emergency locations
4. Clear, switch to Zone → highlight CBD → show the density of the central area

Both type and zone filters can be active simultaneously, with AND semantics — only nodes matching both conditions are highlighted.

---

## 12. Running the Application

### Option A: Open directly

Open `zomba_ems_v4.html` in any modern browser. No server required.

Requires internet connection for:

- Google Fonts: `Barlow Condensed`, `Share Tech Mono`
- Cytoscape.js CDN: `https://unpkg.com/cytoscape/dist/cytoscape.min.js`

### Option B: Serve locally (recommended for development)

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

Working from the source directory (`ems-v4/`), the modular files load independently, making browser devtools debugging straightforward — each module appears as a separate source file.

### Browser requirements

Tested in Chrome 120+, Firefox 121+, Safari 17+. Requires:

- ES2020 (optional chaining, nullish coalescing)
- CSS `backdrop-filter` (blur modal — degrades gracefully in Firefox without `about:config` flag)
- `requestAnimationFrame` (pulse animation)
- No WebGL, no WebAssembly, no service workers

---

## 13. Extending the System

### Add a new node type (e.g. fire brigade)

1. Add nodes to `CY_NODES` in `data.js` with `node_type: 'fire_station'`
2. Add vehicle entries to `VEHICLES` with corresponding `base_node`
3. In `state.js`, extend `getCategory()`:
   ```js
   if (d.node_type === "fire_station") return "response_center";
   ```
4. In `graph.js`, add a style entry for `node[nodeType="fire_station"]`
5. In `highlighter.js`, add a button and swatch to `hl-type-grid` in `index.html`

No routing code changes required.

### Add a new routing policy

In `routing.js`, extend `selectByPolicy()`:

```js
case 'balanced_speed_cost':
  return paretoSet.reduce((b,c) =>
    (c.time * 0.6 + c.cost * 0.0001) < (b.time * 0.6 + b.cost * 0.0001) ? c : b
  );
```

Add a `<button>` in the `policy-btns` div in `index.html`.

### Replace the dataset

Swap `js/data.js` with a file exporting the same constants (`CY_NODES`, `CY_EDGES`, `INCIDENTS`, `VEHICLES`, `TIME_PROFILES`) in the same schema. The entire application adapts automatically.

### Add a Python backend

The routing engine is a direct port of standard graph algorithms. To offload to a backend:

1. POST the incident node ID and current edge weights to a Python/NetworkX endpoint
2. Receive the path as a list of edge IDs
3. In `routing.js`, replace the `cy.elements().dijkstra()` call with a `fetch()` to your endpoint

---

## 14. Design System

### Typography

| Role         | Font             | Weights            |
| ------------ | ---------------- | ------------------ |
| Display / UI | Barlow Condensed | 300, 400, 600, 700 |
| Data / Mono  | Share Tech Mono  | 400                |

### Color Palette

| Token       | Value     | Use                                 |
| ----------- | --------- | ----------------------------------- |
| `--bg`      | `#060e18` | Main background                     |
| `--panel`   | `#0a1828` | Panel backgrounds                   |
| `--border`  | `#112035` | Default borders                     |
| `--border2` | `#1c3355` | Elevated borders                    |
| `--accent`  | `#00b8e0` | Primary cyan — interactive elements |
| `--green`   | `#00d98b` | Available, free-flow, positive      |
| `--amber`   | `#f0a500` | Warning, resilience mode, queued    |
| `--red`     | `#f02040` | Critical, removed, error            |
| `--gold`    | `#e8c000` | Trunk roads                         |
| `--text-hi` | `#b8d8f0` | High-contrast text                  |
| `--text`    | `#6898b8` | Body text                           |
| `--text-lo` | `#2a4560` | Muted labels                        |

### Congestion Gradient

| Multiplier | Color     | Label        |
| ---------- | --------- | ------------ |
| ×1.0       | `#00d98b` | Free flow    |
| ×1.2       | `#80cc00` | Light        |
| ×1.5       | `#f0a500` | Moderate     |
| ×2.0       | `#f06000` | Heavy        |
| ×2.5       | `#f01838` | Severe / jam |

### Route Colors (dispatch pool)

8 colors cycle in assignment order: `#00ccff`, `#00e898`, `#f0c000`, `#cc80ff`, `#ff6080`, `#ff9940`, `#40ffdd`, `#ff40a0`

### Grid Texture

Body background uses a subtle 44×44px CSS grid pattern at 2% opacity to give depth without competing with the graph:

```css
background-image:
  linear-gradient(rgba(0, 184, 224, 0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 184, 224, 0.02) 1px, transparent 1px);
background-size: 44px 44px;
```

---

## 15. Known Limitations

- **Dijkstra is undirected in practice.** The network data is directed, but Cytoscape's built-in Dijkstra with `directed: false` is used for robustness given the small network size. A directed implementation would produce more accurate routing in some corridors.
- **Greedy multi-dispatch is not globally optimal.** The greedy severity-first assignment is a good heuristic but does not guarantee minimum total system travel time across all incidents simultaneously. The Hungarian algorithm would give the optimal bipartite matching.
- **Congestion is not re-routed per vehicle.** All dispatches in a batch use the same edge weights. In a real system, the first dispatched vehicle would affect remaining capacity, changing effective travel times.
- **No real-time simulation.** The dashboard models a snapshot in time, not a continuous simulation. Vehicles do not move on the graph.
- **Backdrop-filter (modal blur)** degrades without the effect in some Firefox configurations. The modal remains fully functional — only the visual blur is lost.
- **CDN dependency.** The bundled HTML requires Cytoscape.js from `unpkg.com` and Google Fonts at load time.

---

## 16. Glossary

| Term                      | Definition                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **G(V, E)**               | Graph with vertex set V and edge set E                                                                         |
| **Dijkstra's algorithm**  | Shortest path algorithm; O((V + E) log V) with a priority queue                                                |
| **Pareto-optimal set**    | Set of solutions where no solution can be improved on one objective without being worsened on another          |
| **Dominance**             | Solution A dominates B if A ≥ B on all objectives and A > B on at least one                                    |
| **ρ (criticality)**       | Edge criticality score ∈ [0, 1]; higher values indicate links whose removal most disrupts network connectivity |
| **γ (gamma)**             | Edge failure rate parameter; higher values indicate less reliable roads                                        |
| **Reliability**           | `1 − mean(γ)` along a path; higher is better                                                                   |
| **Congestion multiplier** | Factor applied to base travel time; 1.0 = free flow, 2.5 = severe congestion                                   |
| **MWK**                   | Malawian Kwacha; currency unit for operational costs                                                           |
| **Response center**       | Abstract term for any node capable of dispatching emergency units (hospitals in this dataset)                  |
| **Incident node**         | A network node at which an emergency event has been reported                                                   |
| **Candidate edge**        | An edge whose ρ or γ value meets the resilience threshold; shown as dashed amber                               |
| **Severed edge**          | A candidate edge the user has clicked to remove from the network                                               |
# ems-presentation
