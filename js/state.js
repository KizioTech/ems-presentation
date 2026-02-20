/**
 * state.js  —  State Layer
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for all application state.
 * Other modules read from State and call State.set* to mutate.
 *
 * Exposes: window.State
 */
window.State = (() => {
  // ── Core state ─────────────────────────────────────────────────
  const state = {
    policy: "time", // 'time' | 'cost' | 'reliability' | 'pareto'
    queue: [], // incident IDs queued for multi-dispatch
    assignments: [], // [{ assignId, incidentId, centerId, vehicleId, path, color, scores }]
    // Vehicle runtime status (id → units available)
    vehicleStatus: {}, // vehicleId → 'available' | 'dispatched'
    centerUnits: {}, // centerId  → available unit count
  };

  // ── Route colour pool ──────────────────────────────────────────
  const ROUTE_COLORS = [
    "#00ccff", // cyan
    "#00e898", // green
    "#f0c000", // gold
    "#cc80ff", // purple
    "#ff6080", // pink
    "#ff9940", // orange
    "#40ffdd", // teal
    "#ff40a0", // magenta
  ];
  let colorIdx = 0;

  function nextColor() {
    return ROUTE_COLORS[colorIdx++ % ROUTE_COLORS.length];
  }

  function resetColors() {
    colorIdx = 0;
  }

  // ── Initialise vehicle + center capacity ───────────────────────
  // Called once after graph.init() so CY_NODES + VEHICLES are loaded.
  function initCapacity() {
    // Count vehicles per base node
    VEHICLES.forEach((v) => {
      state.vehicleStatus[v.vehicle_id] = "available";
      const base = v.base_node;
      state.centerUnits[base] = (state.centerUnits[base] || 0) + 1;
    });
  }

  // ── Policy ─────────────────────────────────────────────────────
  function setPolicy(p) {
    state.policy = p;
    // Sync dropdown value
    const sel = document.getElementById("policy-select");
    if (sel) sel.value = p;
    // Update sidebar label
    const el = document.getElementById("ls-policy");
    if (el) el.textContent = p.toUpperCase();
  }

  function getPolicy() {
    return state.policy;
  }

  // ── Incident queue ─────────────────────────────────────────────
  function enqueue(incidentId) {
    if (!state.queue.includes(incidentId)) {
      state.queue.push(incidentId);
      _onQueueChange();
    }
  }

  function dequeue(incidentId) {
    state.queue = state.queue.filter((id) => id !== incidentId);
    _onQueueChange();
  }

  function clearQueue() {
    state.queue = [];
    _onQueueChange();
  }

  function isQueued(incidentId) {
    return state.queue.includes(incidentId);
  }

  function getQueue() {
    return [...state.queue];
  }

  function _onQueueChange() {
    const n = state.queue.length;
    const badge = document.getElementById("dq-count");
    const btn = document.getElementById("dq-dispatch-btn");
    const hs = document.getElementById("hs-queued");
    if (badge) badge.textContent = n;
    if (btn) btn.disabled = n === 0;
    if (hs) hs.textContent = n;
  }

  // ── Assignments ────────────────────────────────────────────────
  function addAssignment(assignment) {
    state.assignments.push(assignment);
    const el = document.getElementById("hs-dispatched");
    if (el) el.textContent = state.assignments.length;
  }

  function clearAssignments() {
    state.assignments = [];
    resetColors();
    // Restore vehicle capacity
    initCapacity();
    const el = document.getElementById("hs-dispatched");
    if (el) el.textContent = 0;
  }

  function getAssignments() {
    return [...state.assignments];
  }

  // ── Center capacity ────────────────────────────────────────────
  function getCenterUnits(centerId) {
    return state.centerUnits[centerId] || 0;
  }

  function decrementCenter(centerId) {
    if (state.centerUnits[centerId] > 0) state.centerUnits[centerId]--;
  }

  // Dispatch a specific vehicle
  function dispatchVehicle(vehicleId) {
    state.vehicleStatus[vehicleId] = "dispatched";
  }

  function getVehicleStatus(vehicleId) {
    return state.vehicleStatus[vehicleId] || "available";
  }

  function getAvailableVehiclesAt(nodeId) {
    return VEHICLES.filter(
      (v) =>
        v.base_node === nodeId &&
        state.vehicleStatus[v.vehicle_id] === "available",
    );
  }

  // ── Generalized node model adapter ────────────────────────────
  // Maps raw node_type → abstract category for the routing engine.
  // This lets the routing engine work with any institution type.
  function getCategory(nodeData) {
    if (nodeData.node_type === "hospital") return "response_center";
    if (nodeData.node_type === "market") return "facility";
    if (nodeData.has_incident) return "incident";
    return "junction";
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    initCapacity();
  }

  return {
    getPolicy,
    setPolicy,
    enqueue,
    dequeue,
    clearQueue,
    isQueued,
    getQueue,
    addAssignment,
    clearAssignments,
    getAssignments,
    getCenterUnits,
    decrementCenter,
    dispatchVehicle,
    getVehicleStatus,
    getAvailableVehiclesAt,
    getCategory,
    nextColor,
    init,
  };
})();
