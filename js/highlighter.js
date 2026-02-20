/**
 * highlighter.js
 * ─────────────────────────────────────────────────────────────────
 * Node Highlighter: lets users select node types (hospital, market,
 * intersection, incident) and/or zones (CBD, residential, peri-urban)
 * and applies a glowing / pulsing border highlight on matched nodes.
 *
 * Highlight styles:
 *   glow  – bright border + static shadow
 *   pulse – animated pulsing shadow ring
 *   both  – glow + pulse combined
 *
 * Exposes: window.Highlighter
 *   .toggle()              – open / close panel
 *   .toggleType(t, btn)    – toggle a node-type filter
 *   .toggleZone(z, btn)    – toggle a zone filter
 *   .setStyle(s, btn)      – change highlight style
 *   .clearAll()            – remove all highlights
 */
window.Highlighter = (() => {

  // ── State ──────────────────────────────────────────────────────
  let active         = false;
  let activeTypes    = new Set();   // 'hospital' | 'market' | 'intersection' | 'incident'
  let activeZones    = new Set();   // 'CBD' | 'residential' | 'peri-urban'
  let highlightStyle = 'glow';      // 'glow' | 'pulse' | 'both'

  // Per-style colour config  (type → { border, shadow })
  const TYPE_COLORS = {
    hospital:     { border: '#f02040', shadow: 'rgba(240,32,64,',  size: 20 },
    market:       { border: '#f0a500', shadow: 'rgba(240,165,0,',  size: 18 },
    intersection: { border: '#00b8e0', shadow: 'rgba(0,184,224,',  size: 14 },
    incident:     { border: '#ff3366', shadow: 'rgba(255,51,102,', size: 22 },
  };

  const ZONE_COLORS = {
    CBD:          { border: '#00e898', shadow: 'rgba(0,232,152,' },
    residential:  { border: '#8080ff', shadow: 'rgba(128,128,255,' },
    'peri-urban': { border: '#ff9900', shadow: 'rgba(255,153,0,' },
  };

  // ── DOM helper ─────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── Cytoscape style injection ──────────────────────────────────
  // We add a dynamic CSS class 'hl-glow', 'hl-pulse' to matched nodes
  // and define the Cytoscape style once per session.
  let stylesInjected = false;

  function injectCyStyles() {
    if (stylesInjected) return;

    // We'll use per-node data attributes to drive colors instead of
    // fixed classes, so we only need one selector each.
    Graph.cy.style()
      .selector('node.hl-active')
      .style({
        'border-width':    3.5,
        'border-color':    'data(hlBorder)',
        'shadow-blur':     'data(hlBlur)',
        'shadow-color':    'data(hlShadow)',
        'shadow-opacity':  'data(hlOpacity)',
        'shadow-offset-x': 0,
        'shadow-offset-y': 0,
      })
      .update();

    stylesInjected = true;
  }

  // ── Panel toggle ───────────────────────────────────────────────
  function toggle() {
    active = !active;
    $('highlighter-toggle').classList.toggle('active', active);
    $('highlighter-panel').classList.toggle('show', active);

    if (active) {
      injectCyStyles();
      applyHighlights();
    } else {
      removeAllHighlights();
    }
  }

  // ── Type toggle ────────────────────────────────────────────────
  function toggleType(type, btn) {
    if (activeTypes.has(type)) {
      activeTypes.delete(type);
      btn.classList.remove('active');
    } else {
      activeTypes.add(type);
      btn.classList.add('active');
    }
    applyHighlights();
  }

  // ── Zone toggle ────────────────────────────────────────────────
  function toggleZone(zone, btn) {
    if (activeZones.has(zone)) {
      activeZones.delete(zone);
      btn.classList.remove('active');
    } else {
      activeZones.add(zone);
      btn.classList.add('active');
    }
    applyHighlights();
  }

  // ── Style setter ───────────────────────────────────────────────
  function setStyle(s, btn) {
    highlightStyle = s;
    document.querySelectorAll('.hl-style-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyHighlights();
  }

  // ── Core: apply/remove highlights ─────────────────────────────
  function applyHighlights() {
    if (!active) return;

    // Clear all first
    removeAllHighlights();

    if (activeTypes.size === 0 && activeZones.size === 0) {
      updateStatus(0);
      return;
    }

    let count = 0;

    Graph.cy.nodes().forEach(node => {
      const d = node.data();

      // Determine if this node matches any active type filter
      let typeMatch = false;
      let typeColor = null;

      if (activeTypes.size > 0) {
        // 'incident' = has_incident flag
        if (activeTypes.has('incident') && d.has_incident) {
          typeMatch = true; typeColor = TYPE_COLORS.incident;
        }
        if (activeTypes.has(d.node_type)) {
          typeMatch = true; typeColor = TYPE_COLORS[d.node_type];
        }
      }

      // Zone match
      let zoneMatch = false;
      let zoneColor = null;
      if (activeZones.size > 0 && activeZones.has(d.zone)) {
        zoneMatch = true; zoneColor = ZONE_COLORS[d.zone];
      }

      // Logic: if both filters active → AND match; if only one → that one
      let matched = false;
      let color   = null;
      if (activeTypes.size > 0 && activeZones.size > 0) {
        matched = typeMatch && zoneMatch;
        color   = typeColor;    // type color takes precedence
      } else if (activeTypes.size > 0) {
        matched = typeMatch; color = typeColor;
      } else {
        matched = zoneMatch; color = zoneColor;
      }

      if (matched && color) {
        highlightNode(node, color);
        count++;
      }
    });

    updateStatus(count);

    // Pulse animation: we drive it with a CSS animation added to highlighted
    // node elements via the DOM overlay (cy uses canvas, so we inject an 
    // absolutely-positioned div shimmer overlay for the pulse effect).
    if (highlightStyle === 'pulse' || highlightStyle === 'both') {
      schedulePulse();
    }
  }

  function highlightNode(node, color) {
    const isGlow  = highlightStyle === 'glow'  || highlightStyle === 'both';
    const isPulse = highlightStyle === 'pulse' || highlightStyle === 'both';

    const blur    = isGlow ? color.size || 16 : 8;
    const opacity = isGlow ? 0.85 : 0.5;

    node.data('hlBorder',  color.border);
    node.data('hlShadow',  color.shadow + '1)');  // solid shadow color
    node.data('hlBlur',    blur);
    node.data('hlOpacity', opacity);
    node.addClass('hl-active');

    if (isPulse) node.addClass('hl-pulse');
  }

  function removeAllHighlights() {
    Graph.cy.nodes().removeClass('hl-active hl-pulse');
    clearPulseOverlays();
  }

  // ── Pulse shimmer overlay ──────────────────────────────────────
  // Cytoscape renders on canvas so CSS animations don't apply directly.
  // We simulate pulse by repeatedly toggling shadow opacity via requestAnimationFrame.
  let pulseFrame   = null;
  let pulsePhase   = 0;

  function schedulePulse() {
    cancelPulse();
    (function tick() {
      pulsePhase += 0.04;
      const osc = 0.4 + 0.6 * Math.abs(Math.sin(pulsePhase));   // 0.4→1.0

      Graph.cy.nodes('.hl-pulse').forEach(node => {
        node.data('hlOpacity', osc);
      });
      Graph.cy.style().update();
      pulseFrame = requestAnimationFrame(tick);
    })();
  }

  function cancelPulse() {
    if (pulseFrame) { cancelAnimationFrame(pulseFrame); pulseFrame = null; }
  }

  function clearPulseOverlays() {
    cancelPulse();
  }

  // ── Clear all ──────────────────────────────────────────────────
  function clearAll() {
    activeTypes.clear();
    activeZones.clear();
    document.querySelectorAll('.hl-type-btn, .hl-zone-btn')
      .forEach(b => b.classList.remove('active'));
    removeAllHighlights();
    updateStatus(0);
  }

  // ── Status text ────────────────────────────────────────────────
  function updateStatus(count) {
    const el = $('hl-status');
    if (!el) return;
    if (count === 0) {
      el.textContent = 'No nodes highlighted';
      el.style.color = 'var(--text-lo)';
    } else {
      el.textContent = `${count} node${count !== 1 ? 's' : ''} highlighted`;
      el.style.color = 'var(--accent)';
    }
  }

  // ── Update counts in the buttons ──────────────────────────────
  function updateTypeCounts() {
    const counts = { hospital: 0, market: 0, intersection: 0, incident: 0 };
    CY_NODES.forEach(n => {
      const d = n.data;
      if (d.node_type === 'hospital')    counts.hospital++;
      if (d.node_type === 'market')      counts.market++;
      if (d.node_type === 'intersection')counts.intersection++;
      if (d.has_incident)                counts.incident++;
    });
    Object.entries(counts).forEach(([type, c]) => {
      const el = $(`hl-count-${type}`);
      if (el) el.textContent = c;
    });
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    updateTypeCounts();
  }

  return { toggle, toggleType, toggleZone, setStyle, clearAll, init };

})();
