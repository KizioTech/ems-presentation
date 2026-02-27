/**
 * resilience.js
 * ─────────────────────────────────────────────────────────────────
 * Resilience analysis module: lets users set a criticality / 
 * reliability threshold via a number input OR a slider (both stay 
 * in sync), highlights matching edges, and lets them click to 
 * remove those edges from the network one at a time.
 *
 * Exposes: window.Resilience
 *   .toggle()            – open / close the panel
 *   .setMode(m)          – switch between 'rho' and 'gamma'
 *   .nudge(delta)        – ±0.05 buttons next to the input
 *   .restoreEdge(id)     – restore one removed edge
 *   .restoreAll()        – restore all removed edges
 */
window.Resilience = (() => {

  // ── State ──────────────────────────────────────────────────────
  let active       = false;
  let mode         = 'rho';   // 'rho' | 'gamma'
  let threshold    = 0.30;
  let removedEdges = [];      // [{ edgeId, data }]

  // ── DOM refs (cached after first use) ─────────────────────────
  const $ = id => document.getElementById(id);

  // ── Cytoscape extra styles ─────────────────────────────────────
  // Injected once when the panel first opens.
  let stylesInjected = false;

  function injectCyStyles() {
    if (stylesInjected) return;
    Graph.cy.style()
      .selector('edge.candidate')
      .style({
        'line-color':         '#f0a500',
        'target-arrow-color': '#f0a500',
        'line-style':         'dashed',
        'line-dash-pattern':  [8, 4],
        'width':              6,
        'opacity':            1,
        'shadow-blur':        16,
        'shadow-color':       '#f0a500',
        'shadow-opacity':     .85,
        'shadow-offset-x':    0,
        'shadow-offset-y':    0,
        'z-index':            10,
      })
      .selector('edge.severed')
      .style({ 'display': 'none' })
      .update();
    stylesInjected = true;
  }

  // ── Panel toggle ───────────────────────────────────────────────
  function toggle() {
    active = !active;
    $('resilience-toggle').classList.toggle('active', active);
    $('resilience-panel').classList.toggle('show', active);

    if (active) {
      injectCyStyles();
      updateCandidates();
      Graph.cy.on('tap', 'edge.candidate', onEdgeTap);
    } else {
      Graph.cy.off('tap', 'edge.candidate', onEdgeTap);
      clearCandidates();
    }
  }

  // ── Threshold sync: input ↔ slider ────────────────────────────
  function initControls() {
    const input  = $('threshold-input');
    const slider = $('rho-slider');

    // Number input → update threshold + slider
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      if (isNaN(v)) return;
      threshold = Math.max(0, Math.min(1, v));
      syncSliderToThreshold();
      if (active) updateCandidates();
    });

    // Blur: clamp and format the displayed value
    input.addEventListener('blur', () => {
      const v = parseFloat(input.value);
      threshold = isNaN(v) ? threshold : Math.max(0, Math.min(1, v));
      input.value = threshold.toFixed(2);
      syncSliderToThreshold();
      if (active) updateCandidates();
    });

    // Range slider → update threshold + input
    slider.addEventListener('input', () => {
      threshold = parseFloat(slider.value);
      input.value = threshold.toFixed(2);
      syncSliderFill();
      if (active) updateCandidates();
    });

    // Initial fill
    syncSliderToThreshold();
  }

  function syncSliderToThreshold() {
    const slider = $('rho-slider');
    slider.value = threshold;
    syncSliderFill();
  }

  function syncSliderFill() {
    const slider = $('rho-slider');
    const max    = parseFloat(slider.max) || 1;
    const pct    = (threshold / max) * 100;
    slider.style.background =
      `linear-gradient(to right, var(--amber) ${pct}%, var(--border2) ${pct}%)`;
  }

  // ── Nudge buttons (± 0.05) ─────────────────────────────────────
  function nudge(delta) {
    threshold = Math.max(0, Math.min(1, +(threshold + delta).toFixed(2)));
    $('threshold-input').value = threshold.toFixed(2);
    syncSliderToThreshold();
    if (active) updateCandidates();
  }

  // ── Mode switch (ρ / γ) ────────────────────────────────────────
  function setMode(m) {
    mode = m;
    $('mode-rho').classList.toggle('active',   m === 'rho');
    $('mode-gamma').classList.toggle('active', m === 'gamma');
    $('res-mode-label').textContent = m === 'rho' ? 'ρ CRITICALITY' : 'γ RELIABILITY';

    // Adjust slider max for gamma (practical max ≈ 0.6)
    const slider = $('rho-slider');
    if (m === 'gamma') {
      slider.max = '0.6';
      if (threshold > 0.6) { threshold = 0.3; $('threshold-input').value = '0.30'; }
    } else {
      slider.max = '1';
    }
    syncSliderToThreshold();
    if (active) updateCandidates();
  }

  // ── Highlight candidate edges ──────────────────────────────────
  function updateCandidates() {
    Graph.cy.edges().not('.severed').removeClass('candidate');

    let count = 0;
    Graph.cy.edges().not('.severed').forEach(edge => {
      const d   = edge.data();
      const val = mode === 'rho' ? (d.dynamicCrit ?? (d.criticality || 0)) : (d.dynamicGamma ?? (d.gamma || 0));
      if (val >= threshold) {
        edge.addClass('candidate');
        count++;
      }
    });

    $('rho-candidate-count').textContent = count;
    $('res-removed-inline').textContent  = removedEdges.length + ' removed';
  }

  function clearCandidates() {
    Graph.cy.edges().removeClass('candidate');
    $('rho-candidate-count').textContent = '0';
  }

  // ── Edge click → remove ────────────────────────────────────────
  function onEdgeTap(evt) {
    const edge = evt.target;
    if (!edge.hasClass('candidate')) return;

    const d = edge.data();
    removedEdges.push({ edgeId: edge.id(), data: d });

    edge.removeClass('candidate');
    edge.addClass('severed');

    updateCandidates();
    renderRemovedList();
  }

  // ── Restore individual edge ────────────────────────────────────
  function restoreEdge(edgeId) {
    const edge = Graph.cy.getElementById(edgeId);
    edge.removeClass('severed');
    removedEdges = removedEdges.filter(r => r.edgeId !== edgeId);

    // Re-check if it should become a candidate again
    if (active) {
      const d   = edge.data();
      const val = mode === 'rho' ? (d.dynamicCrit ?? (d.criticality || 0)) : (d.dynamicGamma ?? (d.gamma || 0));
      if (val >= threshold) edge.addClass('candidate');
    }

    updateCandidates();
    renderRemovedList();
  }

  // ── Restore all ────────────────────────────────────────────────
  function restoreAll() {
    removedEdges.forEach(r => {
      Graph.cy.getElementById(r.edgeId).removeClass('severed');
    });
    removedEdges = [];
    updateCandidates();
    renderRemovedList();
  }

  // ── Render removed-edges list ──────────────────────────────────
  function renderRemovedList() {
    const list = $('removed-list');
    $('removed-count').textContent = removedEdges.length;

    if (!removedEdges.length) {
      list.innerHTML = '<div class="list-empty">No edges removed yet</div>';
      return;
    }

    list.innerHTML = removedEdges.map(r => {
      const d   = r.data;
      const rho = (d.dynamicCrit ?? (d.criticality || 0)).toFixed(3);
      const gam = (d.dynamicGamma ?? (d.gamma       || 0)).toFixed(3);
      const len = (d.length_km   || 0).toFixed(2);
      const rt  = (d.road_type   || '').toUpperCase();
      const val = mode === 'rho' ? `ρ=${rho}` : `γ=${gam}`;
      return `
        <div class="removed-item">
          <div class="removed-item-info">
            <div class="removed-item-route">${d.source} → ${d.target}</div>
            <div class="removed-item-meta">${rt} · ${len}km · γ=${gam}</div>
          </div>
          <div class="removed-item-val">${val}</div>
          <button class="restore-one-btn"
                  onclick="Resilience.restoreEdge('${r.edgeId}')">↩</button>
        </div>`;
    }).join('');
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    initControls();
  }

  return { toggle, setMode, nudge, restoreEdge, restoreAll, init };

})();
