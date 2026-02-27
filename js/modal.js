/**
 * modal.js  —  UI Layer (Modal)
 * ─────────────────────────────────────────────────────────────────
 * Manages the fullscreen blur overlay modal.
 * Shows:
 *   - Edge detailed analytics (on edge click)
 *   - Incident dispatch dialog (on incident node click)
 *
 * Exposes: window.Modal
 */
window.Modal = (() => {

  // ── Severity colors ────────────────────────────────────────────
  const SEV_COLOR = {
    critical: '#f01838', urgent: '#f07800',
    moderate: '#e8b800', minor:  '#30cc80',
  };

  // ── Open / close ───────────────────────────────────────────────
  function open(contentHTML) {
    document.getElementById('modal-content').innerHTML = contentHTML;
    document.getElementById('modal-overlay').classList.add('open');
  }

  function close() {
    document.getElementById('modal-overlay').classList.remove('open');
  }

  function closeOnOverlay(event) {
    if (event.target === document.getElementById('modal-overlay')) close();
  }

  // ══════════════════════════════════════════════════════════════
  // EDGE MODAL
  // Shows edge full analytics + percentile bars
  // ══════════════════════════════════════════════════════════════
  function showEdge(edgeData) {
    const d    = edgeData;
    const mult = d.currentMult || 1;
    const currT = (d.base_time * mult).toFixed(2);
    const pct   = Routing.getEdgePercentiles(d);

    // Congestion status label
    const congLabel = mult >= 2.0 ? 'SEVERE'  :
                      mult >= 1.5 ? 'HEAVY'   :
                      mult >= 1.2 ? 'MODERATE': 'FREE FLOW';
    const congColor = mult >= 2.0 ? '#f01838' :
                      mult >= 1.5 ? '#f06000' :
                      mult >= 1.2 ? '#f0a500' : '#00d98b';

    // Reliability class text
    const dispGamma = (d.dynamicGamma ?? (d.gamma || 0)).toFixed(3);
    const relText = d.rel_class === 'medium' ? 'MEDIUM (stable)' : `LOW (γ=${dispGamma})`;

    // Road type description
    const roadDesc = d.road_type === 'trunk'    ? `Trunk · ${d.lanes}-lane arterial` :
                     d.road_type === 'primary'  ? `Primary · ${d.lanes}-lane` :
                                                  `Residential · ${d.lanes}-lane`;

    const html = `
      <div class="modal-title">Edge Analysis</div>
      <div class="modal-subtitle">
        ${d.source} → ${d.target} &nbsp;·&nbsp; Edge #${d.edge_id}
        &nbsp;·&nbsp; ${roadDesc}
        ${d.is_market_road ? '&nbsp;·&nbsp; <span style="color:var(--amber)">MARKET ROAD</span>' : ''}
      </div>

      <div class="modal-grid">
        <!-- Left: basic metrics -->
        <div>
          <div class="modal-section-head">Transport Metrics</div>
          <div class="modal-kv">
            <div class="modal-row"><span>Length</span><span>${(d.length_km||0).toFixed(3)} km</span></div>
            <div class="modal-row"><span>Lanes</span><span>${d.lanes}</span></div>
            <div class="modal-row"><span>Free Speed</span><span>${d.free_speed_kmh || '—'} km/h</span></div>
            <div class="modal-row"><span>Base Travel Time</span><span>${(d.base_time||0).toFixed(2)} min</span></div>
            <div class="modal-row">
              <span>Current Time</span>
              <span style="color:${congColor}">${currT} min (×${mult.toFixed(2)})</span>
            </div>
            <div class="modal-row">
              <span>Congestion Status</span>
              <span style="color:${congColor};font-weight:700">${congLabel}</span>
            </div>
          </div>

          <div class="modal-section-head" style="margin-top:14px">Cost &amp; Reliability</div>
          <div class="modal-kv">
            <div class="modal-row"><span>Total Cost</span><span>${Math.round(d.total_cost||0).toLocaleString()} MWK</span></div>
            <div class="modal-row"><span>Fuel Cost</span><span>${Math.round(d.fuel_cost||0).toLocaleString()} MWK</span></div>
            <div class="modal-row">
              <span>Reliability Class</span>
              <span style="color:${d.rel_class==='medium'?'var(--green)':'var(--accent)'}">${relText}</span>
            </div>
            <div class="modal-row">
              <span>Failure Rate γ</span>
              <span>${dispGamma}</span>
            </div>
          </div>
        </div>

        <!-- Right: criticality + percentiles -->
        <div>
          <div class="modal-section-head">Network Criticality</div>
          <div class="modal-kv" style="margin-bottom:14px">
            <div class="modal-row"><span>Criticality ρ</span><span style="color:${_critColor(d.dynamicCrit ?? d.criticality)}">${(d.dynamicCrit ?? (d.criticality || 0)).toFixed(4)}</span></div>
            <div class="modal-row"><span>Class</span><span>${_critClass(d.dynamicCrit ?? d.criticality)}</span></div>
          </div>
          <!-- ρ bar -->
          <div style="margin-bottom:14px">
            <div class="pct-track" style="height:6px">
              <div class="pct-fill" style="width:${(d.dynamicCrit ?? (d.criticality || 0))*100}%;background:${_critColor(d.dynamicCrit ?? d.criticality)}"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:.52rem;color:var(--text-lo);margin-top:3px">
              <span>ρ = 0</span><span>ρ = 1.0</span>
            </div>
          </div>

          <div class="modal-section-head">Percentile Rank vs All 200 Edges</div>
          <div class="modal-bars">
            ${_pctBar('Travel Time',   pct.time,        'Higher = slower road', 'var(--accent)')}
            ${_pctBar('Cost',          pct.cost,        'Higher = more expensive', 'var(--amber)')}
            ${_pctBar('Criticality ρ', pct.criticality, 'Higher = more critical', 'var(--red)')}
            ${_pctBar('Failure Rate γ',pct.reliability, 'Higher = less reliable', 'var(--urgent)')}
          </div>
        </div>
      </div>
    `;
    open(html);
  }

  // ══════════════════════════════════════════════════════════════
  // INCIDENT DISPATCH MODAL
  // Shows incident info + dispatch options per center
  // ══════════════════════════════════════════════════════════════
  function showIncident(incidentData, nodeId) {
    const inc     = incidentData;
    const sevCol  = SEV_COLOR[inc.severity] || '#888';
    const policy  = State.getPolicy();

    // Evaluate routes from all eligible centers
    const incNode  = Graph.cy.getElementById(nodeId);
    const centers  = Graph.cy.nodes().filter(n => n.data('node_type') === 'hospital');
    const solutions = [];
    centers.forEach(c => {
      const result = Routing.evaluateRoute(c, incNode);
      if (result) solutions.push(result);
    });

    // Pareto front
    const pareto   = Routing.paretoFilter(solutions);
    const paretoIds = new Set(pareto.map(s => s.center.id()));
    const selected  = Routing.selectByPolicy(pareto, policy);
    const selectedId = selected?.center.id();

    // Sort: Pareto first, then by time
    solutions.sort((a,b) => {
      const ap = paretoIds.has(a.center.id()) ? 0 : 1;
      const bp = paretoIds.has(b.center.id()) ? 0 : 1;
      return ap !== bp ? ap - bp : a.time - b.time;
    });

    const cardsHtml = solutions.map(s => {
      const cId    = s.center.id();
      const cData  = s.center.data();
      const units  = State.getCenterUnits(cId);
      const isPto  = paretoIds.has(cId);
      const isSel  = cId === selectedId;
      const badge  = isSel  ? `<span style="color:var(--green);font-size:.6rem;font-family:var(--font-mono)"><i class="fa-solid fa-star"></i> RECOMMENDED</span>` :
                     isPto  ? `<span style="color:var(--accent);font-size:.6rem;font-family:var(--font-mono)"><i class="fa-solid fa-circle-nodes"></i> PARETO</span>` :
                               `<span style="color:var(--text-lo);font-size:.6rem;font-family:var(--font-mono)">NON-OPTIMAL</span>`;
      const border = isSel ? 'var(--green)' : isPto ? 'var(--accent)' : 'var(--border2)';
      const avail  = units > 0 ? 'DISPATCH' : 'NO UNITS';
      const canDispatch = units > 0 && !State.isQueued(nodeId);

      return `
        <div class="dispatch-card" style="border-color:${border}">
          <div class="dc-label">Dispatch Centre</div>
          <div class="dc-val">${cData.label || cId}</div>
          <div class="dc-sub" style="margin-bottom:6px">${units} unit${units!==1?'s':''} available · ${badge}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;font-size:.72rem">
            <div><span style="color:var(--text-lo)">Time </span>
                 <span style="font-family:var(--font-mono);color:var(--text-hi)">${s.time.toFixed(1)}min</span></div>
            <div><span style="color:var(--text-lo)">Cost </span>
                 <span style="font-family:var(--font-mono);color:var(--text-hi)">${Math.round(s.cost).toLocaleString()}</span></div>
            <div><span style="color:var(--text-lo)">Rel. </span>
                 <span style="font-family:var(--font-mono);color:var(--text-hi)">${(s.reliability*100).toFixed(0)}%</span></div>
            <div><span style="color:var(--text-lo)">Hops </span>
                 <span style="font-family:var(--font-mono);color:var(--text-hi)">${s.edgeCount}</span></div>
          </div>
          <button
            onclick="Modal.dispatchFromModal('${nodeId}','${cId}'); Modal.close();"
            ${canDispatch?'':'disabled'}
            style="width:100%;padding:5px;background:${canDispatch?`rgba(from ${border} r g b / .12)`:
'rgba(255,255,255,.03)'};border:1px solid ${canDispatch?border:'var(--border2)'};
border-radius:3px;color:${canDispatch?border:'var(--text-lo)'};font-family:var(--font-ui);
font-size:.72rem;font-weight:700;letter-spacing:1px;cursor:${canDispatch?'pointer':'not-allowed'};transition:all .12s">
            ${avail}
          </button>
        </div>`;
    }).join('');

    const html = `
      <div class="modal-title">Incident Dispatch</div>
      <div class="modal-subtitle" style="display:flex;align-items:center;gap:10px">
        <span style="background:rgba(${_hexRgb(sevCol)},.15);border:1px solid ${sevCol};color:${sevCol};
          padding:2px 8px;border-radius:2px;font-family:var(--font-mono);font-size:.65rem;font-weight:700;text-transform:uppercase">
          ${inc.severity}
        </span>
        <span>${inc.incident_id} · Node ${nodeId} · Called ${inc.call_time_formatted}</span>
        <span style="margin-left:auto;font-size:.8rem">Service: ${inc.service_time_min} min</span>
      </div>

      ${inc.description ? `<p style="font-size:.82rem;color:var(--text);margin-bottom:14px;padding:8px 10px;
        background:rgba(0,0,0,.2);border-radius:4px;border-left:3px solid ${sevCol}">${inc.description}</p>` : ''}

      <div class="modal-dispatch-section">
        <div class="modal-dispatch-title">
          Available Dispatch Centres
          &nbsp;·&nbsp; Policy: <span style="color:var(--accent)">${policy.toUpperCase()}</span>
          &nbsp;·&nbsp; Pareto front: <span style="color:var(--green)">${pareto.length} solution${pareto.length!==1?'s':''}</span>
        </div>
        <div class="modal-dispatch-cards">${cardsHtml}</div>
      </div>

      <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);
        display:flex;align-items:center;gap:10px">
        <button onclick="State.enqueue('${nodeId}'); UI.refreshIncidentList(); Modal.close();"
          style="padding:6px 16px;background:rgba(240,165,0,.12);border:1px solid var(--amber);
          border-radius:3px;color:var(--amber);font-family:var(--font-ui);font-size:.75rem;
          font-weight:700;letter-spacing:1px;cursor:pointer">
          + ADD TO DISPATCH QUEUE
        </button>
        <span style="font-size:.72rem;color:var(--text-lo)">
          Queue it for multi-incident simultaneous dispatch
        </span>
      </div>
    `;
    open(html);
  }

  // ── Dispatch from within the modal ────────────────────────────
  function dispatchFromModal(incidentNodeId, centerId) {
    // Force-dispatch via a specific center by temporarily overriding
    const incNode  = Graph.cy.getElementById(incidentNodeId);
    const center   = Graph.cy.getElementById(centerId);
    if (!incNode.length || !center.length) return;

    const result = Routing.evaluateRoute(center, incNode);
    if (!result) return;

    const policy = State.getPolicy();
    Routing.commitSpecific(centerId, incidentNodeId);
  }

  // fallback commit
  function _commit(selected, policy) {
    Routing.dispatchSingle(selected.incident.id());
  }

  // ══════════════════════════════════════════════════════════════
  // NODE MODAL (Non-incident)
  // Shows connectivity, base units, and incidents at a node
  // ══════════════════════════════════════════════════════════════
  function showNode(node) {
    const d     = node.data();
    const raw   = CY_NODES.find(n => n.data.id === d.id)?.data || d;
    const incs  = INCIDENTS.filter(i => i.node_id === d.id);
    const vehs  = VEHICLES.filter(v => v.base_node === d.id);
    const units = State.getCenterUnits(d.id);

    let html = `
      <div class="modal-title">${raw.label || d.id}</div>
      <div class="modal-subtitle">
        ${d.id} · ${(raw.node_type||'').toUpperCase()}
        ${raw.category ? ' · ' + raw.category.toUpperCase() : ''}
        · ${(raw.zone||'').toUpperCase()} ZONE
        ${units > 0 ? `· <span style="color:var(--green)">${units} unit${units!==1?'s':''} avail</span>` : ''}
      </div>
      <div class="modal-grid">
    `;

    // Left column
    html += `<div>`;
    if (vehs.length) {
      html += `<div class="modal-section-head">Based Units</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          ${vehs.map(v => `<span style="background:rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;font-family:var(--font-mono);font-size:0.8rem;color:var(--text-hi)">${v.vehicle_id}</span>`).join('')}
        </div>`;
    }

    if (incs.length) {
      html += `<div class="modal-section-head">Active Incidents</div>`;
      incs.forEach(inc => {
        const sc = SEV_COLOR[inc.severity] || '#888';
        html += `
          <div style="display:flex;align-items:center;padding:8px;background:rgba(0,0,0,0.2);border:1px solid ${sc};margin-bottom:6px;border-radius:4px">
            <span style="background:rgba(0,0,0,.3);border:1px solid ${sc};color:${sc};font-family:var(--font-mono);font-size:0.6rem;padding:2px 6px;margin-right:10px">
              ${inc.severity.toUpperCase()}
            </span>
            <span style="font-size:.85rem;color:var(--text-hi)">${inc.incident_id}</span>
            <span style="font-family:var(--font-mono);font-size:.7rem;color:var(--text-lo);margin-left:auto">
              ${inc.call_time_formatted}
            </span>
          </div>`;
      });
    }
    
    // Right column
    const edges  = Graph.cy.getElementById(d.id).connectedEdges();
    const outE   = edges.filter(e => e.data('source') === d.id);
    html += `</div><div>
      <div class="modal-section-head">Connectivity</div>
      <div style="display:flex;gap:20px;padding:14px;background:rgba(0,0,0,0.2);border-radius:4px">
        <div><div style="font-family:var(--font-mono);font-size:1.4rem;color:var(--text-hi)">${outE.length}</div>
             <div style="font-size:.7rem;color:var(--text-lo);letter-spacing:1px">OUT</div></div>
        <div><div style="font-family:var(--font-mono);font-size:1.4rem;color:var(--text-hi)">${edges.length-outE.length}</div>
             <div style="font-size:.7rem;color:var(--text-lo);letter-spacing:1px">IN</div></div>
        <div><div style="font-family:var(--font-mono);font-size:1.4rem;color:var(--amber)">${outE.filter(e=>e.data('is_market_road')).length}</div>
             <div style="font-size:.7rem;color:var(--text-lo);letter-spacing:1px">MKT</div></div>
      </div>
    </div></div>`; // close grid

    open(html);
  }

  // ══════════════════════════════════════════════════════════════
  // DISPATCHED ROUTE MODAL
  // Shows information about an active route 
  // ══════════════════════════════════════════════════════════════
  function showRoute(info) {
    const rankLabel = info.rank === 1 ? '1ST CHOICE' : info.rank === 2 ? '2ND CHOICE' : '3RD CHOICE';
    const rankColor = info.rank === 1 ? '#00e898' : info.rank === 2 ? '#f0a500' : '#6898b8';
    
    let html = `
      <div class="modal-title">Dispatched Route Analytics</div>
      <div class="modal-subtitle">
        ${info.centerLabel} &rarr; Node ${info.incidentId}
        &nbsp;·&nbsp; <span style="color:${rankColor}">${rankLabel}</span>
      </div>
      
      <p style="font-size:1rem;color:var(--text-hi);margin-bottom:20px;padding:12px;background:rgba(0,0,0,0.2);border-left:4px solid ${rankColor};border-radius:4px">
        ${info.reason}
      </p>

      <div class="modal-section-head">Routing Metrics</div>
      <div class="modal-grid">
        <div class="modal-kv">
          <div class="modal-row"><span>Estimated Time</span><span style="font-size:1rem;color:var(--text-hi)">${info.time.toFixed(1)} min</span></div>
          <div class="modal-row"><span>Total Cost</span><span style="font-size:1rem;color:var(--text-hi)">${Math.round(info.cost).toLocaleString()} MWK</span></div>
        </div>
        <div class="modal-kv">
          <div class="modal-row"><span>Route Reliability</span><span style="font-size:1rem;color:var(--text-hi)">${(info.reliability*100).toFixed(0)}%</span></div>
          <div class="modal-row"><span>Edge Count (Hops)</span><span style="font-size:1rem;color:var(--text-hi)">${info.edgeCount}</span></div>
        </div>
      </div>
    `;

    open(html);
  }

  // ── Helpers ────────────────────────────────────────────────────
  function _pctBar(label, pct, hint, color) {
    return `
      <div class="pct-row">
        <div class="pct-label">
          <span>${label}</span>
          <span style="color:${color}">${pct}th %ile</span>
        </div>
        <div class="pct-track">
          <div class="pct-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div style="font-size:.58rem;color:var(--text-lo);margin-top:2px">${hint}</div>
      </div>`;
  }

  function _critColor(rho) {
    return rho >= .75 ? '#f01838' : rho >= .5 ? '#f06000' : rho >= .25 ? '#f0a500' : 'var(--text-lo)';
  }

  function _critClass(rho) {
    return rho >= .75 ? 'HIGH — bottleneck corridor' :
           rho >= .5  ? 'MEDIUM — significant link' :
           rho >= .25 ? 'LOW — alternative route'   : 'MINIMAL';
  }

  function _hexRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  return { open, close, closeOnOverlay, showEdge, showIncident, showNode, showRoute, dispatchFromModal };

})();
