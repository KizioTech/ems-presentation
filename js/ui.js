/**
 * ui.js  —  UI Layer (Panels)
 * ─────────────────────────────────────────────────────────────────
 * Manages all DOM-side panel rendering:
 *   - Incident list (severity filter, action buttons per card)
 *   - Dispatch log (right panel, updates after each assignment)
 *   - Vehicle list (with busy/available status)
 *   - Node detail panel (non-incident nodes)
 *   - Edge tooltip content
 *
 * Exposes: window.UI, window.Tooltip
 */
window.UI = (() => {

  const SEV_COLOR = {
    critical:'#f01838', urgent:'#f07800', moderate:'#e8b800', minor:'#30cc80',
  };

  // ── Incident List ───────────────────────────────────────────────
  let currentFilter = 'all';

  function buildIncidentList() {
    const container = document.getElementById('inc-list');
    container.innerHTML = '';

    const sorted = [...INCIDENTS].sort((a,b) =>
      parseInt(a.priority) - parseInt(b.priority)
    );

    sorted.forEach(inc => {
      const el = _makeIncidentCard(inc);
      container.appendChild(el);
    });

    _initFilters();
    applyFilter(currentFilter);
  }

  function _makeIncidentCard(inc) {
    const el = document.createElement('div');
    el.className = `inc-item sev-${inc.severity}`;
    el.id = `inc-item-${inc.incident_id}`;
    el.dataset.severity = inc.severity;
    el.dataset.nodeId   = inc.node_id;

    const isQ = State.isQueued(inc.node_id);

    el.innerHTML = `
      <div class="inc-top-row">
        <div class="inc-sev-badge">${inc.severity.slice(0,4).toUpperCase()}</div>
        <div class="inc-id">${inc.incident_id}</div>
        <div class="inc-time">${inc.call_time_formatted}</div>
      </div>
      <div class="inc-meta">Node ${inc.node_id} · Svc ${inc.service_time_min}min · P${inc.priority}</div>
      <div class="inc-actions">
        <button class="inc-act-btn single"
                title="Single dispatch — compute optimal route now"
                onclick="Routing.dispatchSingle('${inc.node_id}')">
          ▶ Dispatch
        </button>
        <button class="inc-act-btn ${isQ ? 'queue-remove' : 'queue-add'}"
                id="queue-btn-${inc.incident_id}"
                onclick="UI.toggleQueue('${inc.node_id}', '${inc.incident_id}')">
          ${isQ ? '− Queue' : '+ Queue'}
        </button>
        <button class="inc-act-btn"
                style="border-color:var(--border2);color:var(--text-lo)"
                title="Open on graph"
                onclick="UI.flyToIncident('${inc.node_id}', '${inc.incident_id}')">
          ⊙ Locate
        </button>
      </div>
    `;

    return el;
  }

  function refreshIncidentList() {
    buildIncidentList();
    applyFilter(currentFilter);
  }

  function updateIncidentStatus(nodeId, status) {
    // Mark matching card as dispatched
    const inc = INCIDENTS.find(i => i.node_id === nodeId);
    if (!inc) return;
    const el = document.getElementById(`inc-item-${inc.incident_id}`);
    if (!el) return;
    if (status === 'dispatched') {
      el.classList.add('dispatched');
      el.classList.remove('queued');
    }
  }

  // ── Queue toggle ─────────────────────────────────────────────────
  function toggleQueue(nodeId, incidentId) {
    if (State.isQueued(nodeId)) {
      State.dequeue(nodeId);
      const el = document.getElementById(`inc-item-${incidentId}`);
      if (el) el.classList.remove('queued');
    } else {
      State.enqueue(nodeId);
      const el = document.getElementById(`inc-item-${incidentId}`);
      if (el) el.classList.add('queued');
    }
    // Refresh the button text
    const btn = document.getElementById(`queue-btn-${incidentId}`);
    if (btn) {
      const isQ = State.isQueued(nodeId);
      btn.textContent = isQ ? '− Queue' : '+ Queue';
      btn.className = `inc-act-btn ${isQ ? 'queue-remove' : 'queue-add'}`;
    }
  }

  // ── Fly to node on graph ──────────────────────────────────────────
  function flyToIncident(nodeId, incidentId) {
    const node = Graph.cy.getElementById(nodeId);
    if (!node.length) return;
    document.querySelectorAll('.inc-item.active')
      .forEach(i => i.classList.remove('active'));
    const el = document.getElementById(`inc-item-${incidentId}`);
    if (el) el.classList.add('active');
    Graph.cy.animate({ center:{ eles:node }, zoom:2.6 }, { duration:380, easing:'ease-in-out-cubic' });
  }

  // ── Severity filter ────────────────────────────────────────────
  function _initFilters() {
    // Dropdown-based — wired via onchange in HTML, nothing extra needed here
  }

  function applyFilter(sev) {
    currentFilter = sev;
    // Sync dropdown
    const sel = document.getElementById('sev-filter-select');
    if (sel) sel.value = sev;
    let visible = 0;
    document.querySelectorAll('.inc-item').forEach(item => {
      const show = sev==='all' || item.dataset.severity===sev;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    document.getElementById('inc-count-badge').textContent = visible;
  }

  // ── Dispatch Log ───────────────────────────────────────────────
  function refreshDispatchLog() {
    const container  = document.getElementById('dispatch-log');
    const assignments = State.getAssignments();

    if (!assignments.length) {
      container.innerHTML = '<div class="list-empty">No active dispatches</div>';
      return;
    }

    container.innerHTML = assignments.map(a => {
      const inc    = a.incident;
      const sev    = inc?.severity || '—';
      const sevCol = SEV_COLOR[sev] || 'var(--text-lo)';
      const pLabel = a.policy.toUpperCase();

      return `
        <div class="dispatch-entry" style="border-left-color:${a.color}">
          <div class="de-route">
            <div class="de-swatch" style="background:${a.color};box-shadow:0 0 5px ${a.color}"></div>
            <div class="de-label">${inc?.incident_id || a.incidentId}</div>
            <div class="de-policy">${pLabel}</div>
          </div>
          <div class="de-meta">
            Node ${a.incidentId} → Center ${a.centerId}
            ${a.vehicleId ? '· ' + a.vehicleId : ''}
            <span style="color:${sevCol}">[${sev}]</span>
          </div>
          <div class="de-scores">
            <span class="de-score">⏱ <span>${a.scores.time}min</span></span>
            <span class="de-score">💰 <span>${a.scores.cost.toLocaleString()}</span></span>
            <span class="de-score">⚡ <span>${a.scores.reliability}%</span></span>
            <span class="de-score">⬡ <span>${a.paretoSize} Pareto</span></span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Vehicle List ───────────────────────────────────────────────
  function buildVehicleList() {
    _renderVehicleList();
  }

  function refreshVehicleList() {
    _renderVehicleList();
  }

  function _renderVehicleList() {
    const container = document.getElementById('veh-list');
    container.innerHTML = '';
    VEHICLES.forEach(v => {
      const status  = State.getVehicleStatus(v.vehicle_id);
      const busy    = status === 'dispatched';
      const base    = CY_NODES.find(n => n.data.id === v.base_node);
      const baseLabel = base ? base.data.label : `Node ${v.base_node}`;
      const el = document.createElement('div');
      el.className = 'veh-item';
      el.innerHTML = `
        <div class="veh-chip ${busy ? 'busy' : ''}">${v.vehicle_id}</div>
        <div>
          <div class="veh-name">${baseLabel}</div>
          <div class="veh-sub">${busy ? '🔴 DISPATCHED' : '🟢 available'} · crew ${v.crew_size}</div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // ── Node Panel (non-incident nodes) ───────────────────────────
  function showNodePanel(node) {
    const d     = node.data();
    const raw   = CY_NODES.find(n => n.data.id === d.id)?.data || d;
    const incs  = INCIDENTS.filter(i => i.node_id === d.id);
    const vehs  = VEHICLES.filter(v => v.base_node === d.id);
    const units = State.getCenterUnits(d.id);

    let html = `
      <div class="np-title">${raw.label || d.id}</div>
      <div class="np-sub">
        ${d.id} · ${(raw.node_type||'').toUpperCase()}
        ${raw.category ? ' · ' + raw.category.toUpperCase() : ''}
        · ${(raw.zone||'').toUpperCase()} ZONE
        ${units > 0 ? `· <span style="color:var(--green)">${units} unit${units!==1?'s':''} avail</span>` : ''}
      </div>
    `;

    if (vehs.length) {
      html += `<div class="np-section-head">Based Units</div>
        <div class="np-veh-row">
          ${vehs.map(v => `<span class="np-veh-chip">${v.vehicle_id}</span>`).join('')}
        </div>`;
    }

    if (incs.length) {
      html += `<div class="np-section-head">Active Incidents</div>`;
      incs.forEach(inc => {
        const sc = SEV_COLOR[inc.severity] || '#888';
        html += `
          <div class="np-inc-row">
            <span class="np-inc-badge" style="background:rgba(0,0,0,.3);border:1px solid ${sc};color:${sc}">
              ${inc.severity.toUpperCase()}
            </span>
            <span style="font-size:.78rem;color:var(--text-hi)">${inc.incident_id}</span>
            <span style="font-family:var(--font-mono);font-size:.6rem;color:var(--text-lo);margin-left:auto">
              ${inc.call_time_formatted}
            </span>
          </div>`;
      });
    }

    const edges  = Graph.cy.getElementById(d.id).connectedEdges();
    const outE   = edges.filter(e => e.data('source') === d.id);
    html += `
      <div class="np-section-head">Connectivity</div>
      <div style="display:flex;gap:14px">
        <div><div style="font-family:var(--font-mono);font-size:.9rem;color:var(--text-hi)">${outE.length}</div>
             <div style="font-size:.6rem;color:var(--text-lo);letter-spacing:1px">OUT</div></div>
        <div><div style="font-family:var(--font-mono);font-size:.9rem;color:var(--text-hi)">${edges.length-outE.length}</div>
             <div style="font-size:.6rem;color:var(--text-lo);letter-spacing:1px">IN</div></div>
        <div><div style="font-family:var(--font-mono);font-size:.9rem;color:var(--amber)">${outE.filter(e=>e.data('is_market_road')).length}</div>
             <div style="font-size:.6rem;color:var(--text-lo);letter-spacing:1px">MKT</div></div>
      </div>
    `;

    document.getElementById('node-panel-content').innerHTML = html;
    document.getElementById('node-panel').classList.add('show');
  }

  function closeNodePanel() {
    document.getElementById('node-panel').classList.remove('show');
    document.querySelectorAll('.inc-item.active').forEach(i => i.classList.remove('active'));
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    buildIncidentList();
    buildVehicleList();
    refreshDispatchLog();
  }

  return {
    init, refreshIncidentList, refreshDispatchLog, refreshVehicleList,
    toggleQueue, flyToIncident, updateIncidentStatus,
    showNodePanel, closeNodePanel, applyFilter,
  };

})();


// ══════════════════════════════════════════════════════════════════
// Tooltip module
// ══════════════════════════════════════════════════════════════════
window.Tooltip = (() => {

  function critColor(rho) {
    return rho >= .75 ? '#f01838' : rho >= .5 ? '#f06000' : rho >= .25 ? '#f0a500' : '#4488aa';
  }

  function showEdge(d) {
    const mult  = d.currentMult || 1;
    const currT = (d.base_time * mult).toFixed(2);
    const col   = Graph.multToColor(mult);
    const crit  = d.dynamicCrit || d.criticality || 0;

    document.getElementById('et-head').textContent =
      `${d.source} → ${d.target}  ·  e${d.edge_id}`;
    document.getElementById('et-road').textContent =
      `${(d.road_type||'').toUpperCase()}  ${d.lanes}L${d.is_market_road?' [MKT]':''}`;
    document.getElementById('et-len').textContent   = `${(d.length_km||0).toFixed(3)} km`;
    document.getElementById('et-btime').textContent = `${(d.base_time||0).toFixed(2)} min`;

    const ct = document.getElementById('et-ctime');
    ct.textContent = `${currT} min`; ct.style.color = col;

    const mt = document.getElementById('et-mult');
    mt.textContent = `×${mult.toFixed(2)}`; mt.style.color = col;

    document.getElementById('et-cost').textContent =
      `${Math.round(d.total_cost||0).toLocaleString()}`;

    const re = document.getElementById('et-rel');
    re.textContent = `${d.rel_class||'low'}  γ=${d.gamma||0}`;
    re.style.color = d.rel_class==='medium' ? '#00d98b' : '#4488aa';

    const cr = document.getElementById('et-crit');
    cr.textContent = `ρ=${crit.toFixed(4)}`; cr.style.color = critColor(crit);

    const bar = document.getElementById('et-crit-bar');
    bar.style.width      = `${Math.min(crit*100,100)}%`;
    bar.style.background = critColor(crit);
  }

  return { showEdge };

})();
