/**
 * demo.js  —  Symposium Demo Script
 * ─────────────────────────────────────────────────────────────────
 * One-click scripted demo for live presentations.
 * Loads AFTER controls.js (added at bottom of index.html).
 *
 * Usage: Demo.run()   — triggered by the ▶ DEMO button in the header
 *
 * What it does:
 *   1. Hard-resets all state
 *   2. Expands collapsed side panels
 *   3. Sets time to 07:00 (morning peak — heavy congestion visible)
 *   4. Queues three geographically spread incidents:
 *        INC_006  node 6  — CRITICAL  (Market_3, CBD)
 *        INC_004  node 37 — CRITICAL  (Node_37, residential NW)
 *        INC_015  node 19 — URGENT    (Node_19, residential SE)
 *   5. After 900 ms pause (audience sees queue state), DISPATCH ALL
 *
 * After the demo the presenter can:
 *   • Click ⟳ RESET, change policy, hit ▶ DEMO again to compare routes
 *   • Use the resilience panel to remove critical edges and re-dispatch
 */
window.Demo = (() => {

  // Node IDs to queue — chosen for geographic spread + severity impact
  // and to produce one long route per dispatch centre
  const DEMO_NODES  = ['6', '37', '19'];  // critical, critical, urgent
  const DEMO_TIME   = 420;                // 07:00 — morning_peak period
  const DEMO_POLICY = 'time';             // start with fastest-route policy

  // ── Public: run demo ────────────────────────────────────────────
  function run() {

    // 1. Full reset first (clears routes, vehicles, queue, time)
    window.hardReset();

    // 2. Expand side panels so the audience sees incident list + log
    const body = document.getElementById('app-body');
    if (body) {
      if (body.classList.contains('left-collapsed'))  window.togglePanel('left');
      if (body.classList.contains('right-collapsed')) window.togglePanel('right');
    }

    // 3. Set time to morning peak so congestion colours are vivid
    const slider = document.getElementById('time-slider');
    if (slider) {
      slider.value = DEMO_TIME;
      slider.dispatchEvent(new Event('input'));
    }

    // 4. Set routing policy
    State.setPolicy(DEMO_POLICY);

    // 5. Queue incidents — amber left-border appears on each card
    DEMO_NODES.forEach(nid => {
      if (!State.isQueued(nid)) State.enqueue(nid);
    });
    UI.refreshIncidentList();

    // 6. Dispatch all after a visible pause (audience sees queue state)
    setTimeout(() => {
      Routing.dispatchQueue();
    }, 900);
  }

  return { run };

})();
