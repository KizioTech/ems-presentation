/**
 * controls.js  —  Orchestration Layer
 * ─────────────────────────────────────────────────────────────────
 * Runs last. Bootstraps all modules in dependency order and wires
 * the time-of-day slider.
 *
 * Load order guarantee (from index.html):
 *   data → graph → state → routing → modal → ui → resilience → highlighter → controls
 */
(function boot() {

  // ── 1. Init state (vehicle capacity, etc.) ───────────────────
  State.init();

  // ── 2. Init graph (builds Cytoscape, binds events) ──────────
  Graph.init();
  Graph.cy.fit(undefined, 30);

  // ── 3. Pre-compute edge stats for modal percentiles ──────────
  Routing.buildEdgeStats();

  // ── 4. Init UI panels ────────────────────────────────────────
  UI.init();

  // ── 5. Init tool panels ───────────────────────────────────────
  Resilience.init();
  Highlighter.init();

  // ── 6. Paint time-zone stripes on slider ─────────────────────
  _paintSliderZones();

  // ── 7. Wire time slider ──────────────────────────────────────
  const slider = document.getElementById('time-slider');
  slider.addEventListener('input', _onTimeChange);
  _onTimeChange();   // set initial t=00:00 state


  // ── Time change ───────────────────────────────────────────────
  function _onTimeChange() {
    const minutes = parseInt(slider.value, 10);
    const hour    = minutes / 60;

    // Clock
    const hh = String(Math.floor(hour)).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    document.getElementById('time-display').textContent = `${hh}:${mm}`;

    // Period
    const profile = TIME_PROFILES.find(p =>
      hour >= parseFloat(p.start_hour) && hour < parseFloat(p.end_hour)
    ) || TIME_PROFILES[TIME_PROFILES.length-1];
    document.getElementById('period-label').textContent =
      profile.time_period.replace(/_/g,' ').toUpperCase();

    // Slider fill
    const pct = (minutes/1440)*100;
    slider.style.background =
      `linear-gradient(to right, var(--accent) ${pct}%, var(--border2) ${pct}%)`;

    // Update graph + stats
    Graph.setHour(hour);
    Routing.buildEdgeStats();
    _refreshStats(profile);
    Routing.updateActiveRoutes(hour);
  }

  function _refreshStats(profile) {
    const { count, avgTime, totalCost } = Graph.getCongestion();
    const cc = count>80 ? 'var(--red)' : count>40 ? 'var(--amber)' : 'var(--green)';

    document.getElementById('hs-cong') &&
      (document.getElementById('hs-cong').textContent = count,
       document.getElementById('hs-cong').style.color = cc);
    document.getElementById('hs-avgtime').textContent = avgTime + ' min';
    document.getElementById('ls-period').textContent  = profile.time_period.replace(/_/g,' ').toUpperCase();
    document.getElementById('ls-normal').textContent  = profile.multiplier_normal;
    document.getElementById('ls-market').textContent  = profile.multiplier_market;
    document.getElementById('ls-cong').textContent    = count;
    document.getElementById('ls-cong').style.color    = cc;
    document.getElementById('ls-policy').textContent  = State.getPolicy().toUpperCase();
  }

  function _paintSliderZones() {
    const container = document.getElementById('slider-zones');
    if (!container) return;
    const ZONE_COLORS = {
      night:'#1a3a5c', morning_peak:'#5a2800', midday:'#3a3000',
      evening_peak:'#5a1800', late_evening:'#1a2a1a',
    };
    TIME_PROFILES.forEach(p => {
      const start = parseFloat(p.start_hour);
      const end   = parseFloat(p.end_hour);
      const pct   = ((end-start)/24)*100;
      const div   = document.createElement('div');
      div.style.cssText = `width:${pct}%;height:100%;background:${ZONE_COLORS[p.time_period]||'#222'}`;
      div.title = p.time_period.replace(/_/g,' ');
      container.appendChild(div);
    });
  }

})();

// ── Panel collapse/expand ─────────────────────────────────────────
window.togglePanel = function(side) {
  const panel = document.getElementById(side === 'left' ? 'left-panel' : 'right-panel');
  const body  = document.getElementById('app-body');
  const btn   = document.getElementById(side === 'left' ? 'left-toggle' : 'right-toggle');
  const isCollapsed = panel.classList.toggle('collapsed');
  body.classList.toggle(side + '-collapsed', isCollapsed);

  if (side === 'left') {
    btn.innerHTML = isCollapsed ? '<i class="fa-solid fa-angles-right"></i>' : '<i class="fa-solid fa-angles-left"></i>';
  } else {
    btn.innerHTML = isCollapsed ? '<i class="fa-solid fa-angles-left"></i>' : '<i class="fa-solid fa-angles-right"></i>';
  }

  // Resize Cytoscape after CSS transition completes (300ms)
  setTimeout(() => { if (Graph.cy) Graph.cy.resize(); }, 320);
};

// ── Hard Reset ────────────────────────────────────────────────────
window.hardReset = function() {
  if (window.Routing && window.Routing.clearAll) Routing.clearAll();
  const slider = document.getElementById('time-slider');
  if (slider) {
    slider.value = 0;
    slider.dispatchEvent(new Event('input'));
  }
  if (window.State && window.State.setPolicy) State.setPolicy('time');
  const policySelect = document.getElementById('policy-select');
  if (policySelect) policySelect.value = 'time';
  
  if (window.Highlighter && window.Highlighter.clearAll) Highlighter.clearAll();
  if (window.Resilience && window.Resilience.restoreAll) Resilience.restoreAll();
};
