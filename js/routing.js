/**
 * routing.js  —  Logic Layer
 * ─────────────────────────────────────────────────────────────────
 * Implements the full routing pipeline:
 *
 *   1. dispatchSingle(incidentId)      → one incident, best center
 *   2. dispatchQueue()                 → all queued, greedy + Pareto
 *   3. evaluateRoute(center, incident) → multi-objective scoring
 *   4. paretoFilter(solutions)         → non-dominated set
 *   5. selectByPolicy(paretoSet)       → pick by active policy
 *   6. clearAll()                      → reset graph + state
 *   7. commitSpecific(center,incident) → force-commit a chosen pair
 *
 * Exposes: window.Routing
 */
window.Routing = (() => {

  // ── Pre-compute global edge stats for percentile ranking ───────
  let edgeStats = null;
  let activeRankedRoutes = [];

  function buildEdgeStats() {
    const times  = CY_EDGES.map(e => (e.data.base_time || 0) * (e.data.currentMult || 1));
    const costs  = CY_EDGES.map(e => e.data.total_cost || 0);
    const crits  = CY_EDGES.map(e => e.data.dynamicCrit ?? (e.data.criticality || 0));
    const gammas = CY_EDGES.map(e => e.data.dynamicGamma ?? (e.data.gamma || 0));
    edgeStats = {
      time:        { arr: times.slice().sort((a,b)=>a-b), min:Math.min(...times), max:Math.max(...times) },
      cost:        { arr: costs.slice().sort((a,b)=>a-b), min:Math.min(...costs), max:Math.max(...costs) },
      criticality: { arr: crits.slice().sort((a,b)=>a-b), min:Math.min(...crits), max:Math.max(...crits) },
      reliability: { arr: gammas.slice().sort((a,b)=>a-b), min:Math.min(...gammas), max:Math.max(...gammas) },
    };
  }

  function percentileRank(arr, value) {
    let lo = 0, hi = arr.length;
    while (lo < hi) { const mid = (lo+hi)>>1; if(arr[mid]<=value) lo=mid+1; else hi=mid; }
    return Math.round((lo / arr.length) * 100);
  }

  function getEdgePercentiles(edgeData) {
    if (!edgeStats) buildEdgeStats();
    return {
      time:        percentileRank(edgeStats.time.arr,        (edgeData.base_time || 0) * (edgeData.currentMult || 1)),
      cost:        percentileRank(edgeStats.cost.arr,        edgeData.total_cost    || 0),
      criticality: percentileRank(edgeStats.criticality.arr, edgeData.dynamicCrit ?? (edgeData.criticality || 0)),
      reliability: percentileRank(edgeStats.reliability.arr, edgeData.dynamicGamma ?? (edgeData.gamma || 0)),
    };
  }

  // ── Edge weight function (congested travel time) ───────────────
  function edgeWeight(edge) {
    const d    = edge.data();
    const mult = d.currentMult || 1;
    return (d.base_time || 1) * mult;
  }

  // ── Find eligible response centers ────────────────────────────
  function getEligibleCenters(excludeIds = new Set()) {
    return Graph.cy.nodes().filter(n => {
      const d = n.data();
      return d.node_type === 'hospital' &&
             State.getCenterUnits(d.id) > 0 &&
             !excludeIds.has(d.id);
    });
  }

  // ── Evaluate one route: time + cost + reliability + balance ────
  function evaluateRoute(center, incident) {
    const dijkstra = Graph.cy.elements().not('.severed').dijkstra({
      root:    center,
      weight:  edgeWeight,
      directed: false,
    });

    const distTime = dijkstra.distanceTo(incident);
    const path     = dijkstra.pathTo(incident);

    if (!path || path.length === 0 || !isFinite(distTime)) return null;

    let totalCost = 0, totalGamma = 0, edgeCount = 0;
    path.edges().forEach(e => {
      const d = e.data();
      totalCost  += d.total_cost    || 0;
      totalGamma += d.dynamicGamma ?? (d.gamma || 0);
      edgeCount++;
    });

    const avgGamma   = edgeCount > 0 ? totalGamma / edgeCount : 0;
    const balance    = 1 / Math.max(1, State.getCenterUnits(center.data('id')));
    const reliability= 1 - avgGamma;

    return {
      center, incident, path,
      time:        distTime,
      cost:        totalCost,
      reliability: reliability,
      balance:     balance,
      edgeCount,
    };
  }

  // ── Pareto filtering ───────────────────────────────────────────
  function dominates(a, b) {
    const relA = 1 - a.reliability, relB = 1 - b.reliability;
    return (
      a.time    <= b.time    &&
      a.cost    <= b.cost    &&
      relA      <= relB      &&
      a.balance <= b.balance &&
      (
        a.time    < b.time    ||
        a.cost    < b.cost    ||
        relA      < relB      ||
        a.balance < b.balance
      )
    );
  }

  function paretoFilter(solutions) {
    return solutions.filter((s1, i) =>
      !solutions.some((s2, j) => j !== i && dominates(s2, s1))
    );
  }

  // ── Policy selection from Pareto set ──────────────────────────
  function selectByPolicy(paretoSet, policy) {
    if (!paretoSet || paretoSet.length === 0) return null;
    if (paretoSet.length === 1) return paretoSet[0];

    switch (policy) {
      case 'time':        return paretoSet.reduce((b,c) => c.time < b.time ? c : b);
      case 'cost':        return paretoSet.reduce((b,c) => c.cost < b.cost ? c : b);
      case 'reliability': return paretoSet.reduce((b,c) => c.reliability > b.reliability ? c : b);
      case 'pareto':      return selectBalanced(paretoSet);
      default:            return paretoSet[0];
    }
  }

  function selectBalanced(set) {
    const times  = set.map(s => s.time);
    const costs  = set.map(s => s.cost);
    const rels   = set.map(s => s.reliability);
    const range  = (arr) => Math.max(...arr) - Math.min(...arr) || 1;
    const norm   = (v, arr) => (v - Math.min(...arr)) / range(arr);

    return set.reduce((best, s) => {
      const score = 0.4 * norm(s.time, times) +
                    0.3 * norm(s.cost, costs) +
                    0.3 * (1 - norm(s.reliability, rels));
      s._balanceScore = score;
      return (!best || score < best._balanceScore) ? s : best;
    }, null);
  }

  // ── Single dispatch ────────────────────────────────────────────
  function dispatchSingle(incidentId) {
    const incidentNode = Graph.cy.getElementById(incidentId);
    if (!incidentNode.length) return;

    const centers = getEligibleCenters();
    if (!centers.length) {
      console.warn('No available dispatch centres');
      return;
    }

    const solutions = [];
    centers.forEach(center => {
      const result = evaluateRoute(center, incidentNode);
      if (result) solutions.push(result);
    });

    if (!solutions.length) return;

    const policy   = State.getPolicy();
    const pareto   = policy === 'pareto' ? paretoFilter(solutions) : solutions;
    const ranked   = _rankByPolicy([...solutions], policy);
    const topRoutes = ranked.slice(0, 3);

    topRoutes.forEach((s, i) => {
      s._rank    = i + 1;
      s._reason  = _getSelectionReason(s, topRoutes, policy, i);
    });

    const animDelay = 80;
    let totalDelay = 0;

    for (let i = topRoutes.length - 1; i >= 0; i--) {
      const route = topRoutes[i];
      const rank  = route._rank;
      _highlightPath(route.path, rank, route.incident.id(), route);
      _animateRoute(route.path, rank, totalDelay);
      totalDelay += route.path.edges().length * animDelay + 400;

      activeRankedRoutes.push({
        path:       route.path,
        rank:       rank,
        incidentId: route.incident.id(),
        policy:     policy,
        centerId:   route.center.id(),
        solution:   route
      });
    }

    const selected = topRoutes[0];
    _commitAssignment(selected, policy, pareto);
  }

  // ── Commit a SPECIFIC center→incident pair (used by modal) ─────
  // This is the public-facing version that modal.js calls when the
  // user clicks DISPATCH on a specific center card.
  function commitSpecific(centerId, incidentNodeId) {
    const center   = Graph.cy.getElementById(centerId);
    const incident = Graph.cy.getElementById(incidentNodeId);

    if (!center.length || !incident.length) return;
    if (State.getCenterUnits(centerId) < 1) return;

    const result = evaluateRoute(center, incident);
    if (!result) return;

    const policy = State.getPolicy();

    // Evaluate all centers so we can build a proper Pareto set for the log
    const allSolutions = [];
    Graph.cy.nodes().filter(n => n.data('node_type') === 'hospital').forEach(c => {
      const r = evaluateRoute(c, incident);
      if (r) allSolutions.push(r);
    });
    const pareto = paretoFilter(allSolutions);

    // Rank and annotate
    const ranked = _rankByPolicy([...allSolutions], policy);
    const forcedRank = ranked.findIndex(s => s.center.id() === centerId) + 1 || 1;
    result._rank   = forcedRank;
    result._reason = forcedRank === 1
      ? `Manually selected & policy-optimal (${policy.toUpperCase()})`
      : `Manually selected from modal — rank #${forcedRank} by ${policy.toUpperCase()} policy`;

    // Draw routes (show top 3 ranked, with chosen center highlighted)
    const topRoutes = ranked.slice(0, 3);
    topRoutes.forEach((s, i) => {
      s._rank    = i + 1;
      s._reason  = _getSelectionReason(s, topRoutes, policy, i);
    });

    // Ensure our forced selection is drawn as rank 1 if it wasn't already
    const chosenInTop = topRoutes.find(s => s.center.id() === centerId);
    const drawSet = chosenInTop ? topRoutes : [result, ...topRoutes.slice(0, 2)];

    let totalDelay = 0;
    for (let i = drawSet.length - 1; i >= 0; i--) {
      const route = drawSet[i];
      _highlightPath(route.path, route._rank, route.incident.id(), route);
      _animateRoute(route.path, route._rank, totalDelay);
      totalDelay += route.path.edges().length * 80 + 400;
      activeRankedRoutes.push({
        path: route.path, rank: route._rank,
        incidentId: route.incident.id(), policy,
        centerId: route.center.id(), solution: route,
      });
    }

    _commitAssignment(result, policy, pareto);
  }

  // ── Rank solutions by policy ──────────────────────────────────
  function _rankByPolicy(solutions, policy) {
    switch (policy) {
      case 'time':        return solutions.sort((a,b) => a.time - b.time);
      case 'cost':        return solutions.sort((a,b) => a.cost - b.cost);
      case 'reliability': return solutions.sort((a,b) => b.reliability - a.reliability);
      case 'pareto':
        _computeBalanceScores(solutions);
        return solutions.sort((a,b) => (a._balanceScore||0) - (b._balanceScore||0));
      default:            return solutions.sort((a,b) => a.time - b.time);
    }
  }

  function _computeBalanceScores(set) {
    const times = set.map(s => s.time);
    const costs = set.map(s => s.cost);
    const rels  = set.map(s => s.reliability);
    const range = (arr) => Math.max(...arr) - Math.min(...arr) || 1;
    const norm  = (v, arr) => (v - Math.min(...arr)) / range(arr);
    set.forEach(s => {
      s._balanceScore = 0.4 * norm(s.time, times) +
                        0.3 * norm(s.cost, costs) +
                        0.3 * (1 - norm(s.reliability, rels));
    });
  }

  function _getSelectionReason(route, allRoutes, policy, rankIdx) {
    if (rankIdx === 0) {
      switch (policy) {
        case 'time':        return `Fastest route — ${route.time.toFixed(1)} min travel time`;
        case 'cost':        return `Cheapest route — ${Math.round(route.cost).toLocaleString()} MWK total cost`;
        case 'reliability': return `Most reliable — ${(route.reliability*100).toFixed(0)}% route reliability`;
        case 'pareto':      return `Best balanced composite (40% time + 30% cost + 30% reliability)`;
        default:            return 'Optimal route by selected policy';
      }
    }
    const label    = rankIdx === 1 ? '2nd' : '3rd';
    const best     = allRoutes[0];
    const timeDiff = ((route.time - best.time) / best.time * 100).toFixed(0);
    const costDiff = ((route.cost - best.cost) / (best.cost||1) * 100).toFixed(0);
    return `${label} choice — ${timeDiff > 0 ? '+' : ''}${timeDiff}% time, ${costDiff > 0 ? '+' : ''}${costDiff}% cost vs optimal`;
  }

  // ── Route click data storage ──────────────────────────────────
  const _routeClickData = new Map();

  function _storeRouteClickData(path, route) {
    path.edges().forEach(e => {
      _routeClickData.set(e.id(), {
        rank:        route._rank,
        reason:      route._reason,
        time:        route.time,
        cost:        route.cost,
        reliability: route.reliability,
        centerId:    route.center.data('id'),
        centerLabel: route.center.data('label') || route.center.data('id'),
        incidentId:  route.incident.data('id'),
        edgeCount:   route.edgeCount,
      });
    });
  }

  function getRouteClickData(edgeId) {
    return _routeClickData.get(edgeId) || null;
  }

  // ── Draw path on graph (ranked) ───────────────────────────────
  const RANK_STYLES = {
    1: { lineStyle: 'solid',  width: 6, dashPattern: null,    opacity: 1    },
    2: { lineStyle: 'dashed', width: 4, dashPattern: [12, 6], opacity: 0.85 },
    3: { lineStyle: 'dotted', width: 3, dashPattern: [3, 5],  opacity: 0.7  },
  };

  function _highlightPath(path, rank, incidentId, routeData) {
    const rs    = RANK_STYLES[rank] || RANK_STYLES[3];
    const color = '#ffffff';

    path.forEach((el, i) => {
      if (el.isEdge()) {
        const prevNode  = path[i-1];
        const isForward = el.source().id() === prevNode.id();

        const style = {
          'line-color':         color,
          'width':              rs.width,
          'opacity':            el.style('opacity') || 0,
          'shadow-blur':        rank === 1 ? 14 : 8,
          'shadow-color':       color,
          'shadow-opacity':     rank === 1 ? .6 : .3,
          'shadow-offset-x':   0,
          'shadow-offset-y':   0,
          'z-index':            30 - rank,
          'source-arrow-shape': isForward ? 'none' : 'triangle',
          'target-arrow-shape': isForward ? 'triangle' : 'none',
          'source-arrow-color': color,
          'target-arrow-color': color,
        };
        if (rs.dashPattern) {
          style['line-style']        = 'dashed';
          style['line-dash-pattern'] = rs.dashPattern;
        }
        el.style(style);
        el.addClass(`route-rank route-rank-${rank}`);
      }
    });

    if (rank === 1) {
      const incNode = Graph.cy.getElementById(incidentId);
      if (incNode.length) {
        incNode.style({
          'border-color':   color,
          'border-width':   4,
          'shadow-blur':    20,
          'shadow-color':   color,
          'shadow-opacity': .8,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0,
        });
      }
    }

    if (routeData) _storeRouteClickData(path, routeData);
    _updateRouteLegend();
  }

  // ── Animate route edge-by-edge ────────────────────────────────
  function _animateRoute(path, rank, startDelay) {
    const rs      = RANK_STYLES[rank] || RANK_STYLES[3];
    const edgeArr = [];
    path.edges().forEach(e => edgeArr.push(e));

    edgeArr.forEach((edge, i) => {
      setTimeout(() => {
        edge.style({ 'opacity': rs.opacity });
      }, startDelay + i * 80);
    });
  }

  // ── Multi-incident greedy dispatch ────────────────────────────
  function dispatchQueue() {
    const queue = State.getQueue();
    if (!queue.length) return;

    const SEV_ORDER = { critical:1, urgent:2, moderate:3, minor:4 };
    const sorted = queue.map(id => INCIDENTS.find(i => i.node_id === id)).filter(Boolean);
    sorted.sort((a,b) => (SEV_ORDER[a.severity]||9) - (SEV_ORDER[b.severity]||9));

    const assignedCenters = new Set();
    const policy = State.getPolicy();
    let cumulativeDelay = 0;

    sorted.forEach(inc => {
      const incidentNode = Graph.cy.getElementById(inc.node_id);
      if (!incidentNode.length) return;

      const centers = getEligibleCenters(assignedCenters);
      if (!centers.length) return;

      const solutions = [];
      centers.forEach(center => {
        const result = evaluateRoute(center, incidentNode);
        if (result) solutions.push(result);
      });

      if (!solutions.length) return;

      const pareto    = policy === 'pareto' ? paretoFilter(solutions) : solutions;
      const ranked    = _rankByPolicy([...solutions], policy);
      const topRoutes = ranked.slice(0, 3);

      topRoutes.forEach((s, i) => {
        s._rank   = i + 1;
        s._reason = _getSelectionReason(s, topRoutes, policy, i);

        activeRankedRoutes.push({
          path: s.path, rank: s._rank,
          incidentId: s.incident.id(), policy,
          centerId: s.center.id(), solution: s,
        });
      });

      const animDelay = 80;
      for (let i = topRoutes.length - 1; i >= 0; i--) {
        const route = topRoutes[i];
        _highlightPath(route.path, route._rank, route.incident.id(), route);
        _animateRoute(route.path, route._rank, cumulativeDelay);
        cumulativeDelay += route.path.edges().length * animDelay + 400;
      }

      const selected = topRoutes[0];
      assignedCenters.add(selected.center.data('id'));
      _commitAssignment(selected, policy, pareto);
    });

    State.clearQueue();
    UI.refreshIncidentList();
    _updateQueueBadge();
  }

  // ── Commit an assignment ───────────────────────────────────────
  function _commitAssignment(selected, policy, paretoSet) {
    const color    = '#ffffff';
    const centerId = selected.center.data('id');
    const incId    = selected.incident.data('id');

    State.decrementCenter(centerId);

    const vehicles = State.getAvailableVehiclesAt(centerId);
    const vehicle  = vehicles[0];
    if (vehicle) State.dispatchVehicle(vehicle.vehicle_id);

    const assignment = {
      assignId:   `DISP-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      incidentId:  incId,
      centerId,
      vehicleId:   vehicle?.vehicle_id,
      color,
      policy,
      paretoSize:  paretoSet.length,
      scores: {
        time:        +selected.time.toFixed(2),
        cost:        +selected.cost.toFixed(0),
        reliability: +(selected.reliability * 100).toFixed(1),
        balance:     +selected.balance.toFixed(3),
      },
      incident: INCIDENTS.find(i => i.node_id === incId),
    };
    State.addAssignment(assignment);

    UI.refreshDispatchLog();
    UI.refreshVehicleList();
    UI.updateIncidentStatus(incId, 'dispatched');
  }

  // ── Dynamic update for live simulation ─────────────────────────
  function updateActiveRoutes(hour) {
    if (!activeRankedRoutes.length) return;

    activeRankedRoutes.forEach(r => {
      const newSol = evaluateRoute(
        Graph.cy.getElementById(r.centerId),
        Graph.cy.getElementById(r.incidentId)
      );
      if (!newSol) return;

      const oldPathIds = r.path.map(el => el.id());
      const newPathIds = newSol.path.map(el => el.id());
      const pathsMatch = oldPathIds.length === newPathIds.length &&
                         oldPathIds.every((id, idx) => id === newPathIds[idx]);

      if (!pathsMatch) {
        r.path.forEach(el => {
          if (el.isEdge()) {
            el.removeClass('route-rank');
            el.removeClass(`route-rank-${r.rank}`);
            el.removeStyle();
          }
        });
        r.path     = newSol.path;
        r.solution = newSol;
        r.solution._rank   = r.rank;
        r.solution._reason = _getSelectionReason(newSol, [newSol], r.policy, r.rank-1);
        _highlightPath(r.path, r.rank, r.incidentId, r.solution);
      } else {
        r.solution.time = newSol.time;
        r.solution.cost = newSol.cost;
        _storeRouteClickData(r.path, r.solution);
      }

      if (r.rank === 1) {
        const assignments = State.getAssignments();
        const found = assignments.find(a => a.incidentId === r.incidentId);
        if (found) {
          found.scores.time = +r.solution.time.toFixed(2);
          found.scores.cost = +r.solution.cost.toFixed(0);
        }
      }
    });

    _updateRouteLegend();
    UI.refreshDispatchLog();
  }

  // ── Route legend ───────────────────────────────────────────────
  function _updateRouteLegend() {
    const assignments = State.getAssignments();
    const legend = document.getElementById('route-legend');
    const items  = document.getElementById('route-legend-items');
    if (!legend || !items) return;

    if (!assignments.length) {
      legend.style.display = 'none';
      return;
    }

    legend.style.display = 'block';
    items.innerHTML = assignments.map(a => {
      const inc   = a.incident;
      const label = inc ? `${a.incidentId.slice(-4)} → ${a.centerId}` : a.assignId;
      const sev   = inc?.severity || '';
      return `
        <div class="rl-item">
          <div class="rl-swatch" style="background:#fff;box-shadow:0 0 6px rgba(255,255,255,.6)"></div>
          <span class="rl-label">${label} <span style="font-size:.6rem;color:var(--text-lo)">[${sev}]</span></span>
          <span class="rl-time">${a.scores.time}min</span>
        </div>`;
    }).join('');
  }

  // ── Reset everything ──────────────────────────────────────────
  function clearAll() {
    Graph.cy.edges().removeStyle();
    Graph.cy.edges().removeClass('route-rank route-rank-1 route-rank-2 route-rank-3');
    Graph.cy.nodes().removeStyle();
    Graph.reapplyBaseStyles();

    State.clearAssignments();
    State.clearQueue();

    activeRankedRoutes = [];
    _routeClickData.clear();

    const popup = document.getElementById('route-info-popup');
    if (popup) popup.remove();

    UI.refreshIncidentList();
    UI.refreshDispatchLog();
    UI.refreshVehicleList();
    _updateRouteLegend();
    _updateQueueBadge();
  }

  function _updateQueueBadge() {
    const n     = State.getQueue().length;
    const badge = document.getElementById('dq-count');
    const btn   = document.getElementById('dq-dispatch-btn');
    const hs    = document.getElementById('hs-queued');
    if (badge) badge.textContent = n;
    if (btn)   btn.disabled = n === 0;
    if (hs)    hs.textContent = n;
  }

  // ── Public API ─────────────────────────────────────────────────
  return {
    dispatchSingle,
    dispatchQueue,
    clearAll,
    getEdgePercentiles,
    evaluateRoute,
    paretoFilter,
    selectByPolicy,
    edgeWeight,
    buildEdgeStats,
    getRouteClickData,
    updateActiveRoutes,
    commitSpecific,       // ← NEW: used by modal dispatchFromModal
  };

})();
