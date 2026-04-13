"""
Emergency Vehicle Routing Simulation
=====================================
Simultaneous Routing of Emergency Vehicles in Poorly Developed
and Congested Urban Networks — Zomba, Malawi

Author : Josophat Makawa (BSC/MAT/14/21)
Supervisor : Dr. E. Mwakilama
Institution : University of Malawi, Mathematical Sciences Department

Model
-----
Multi-Objective Label-Setting (MOLS) with three objectives:
  f1'(P) = sum [ tau_ij(t) + lambda * c_ij ]          (travel time + cost)
  f2(P)  = sum [ v*_ij(t) ]                           (reliability)
  f3(P)  = beta * sum [ rho_ij ]                      (resilience)

where the modified variability is:
  v*_ij(t) = tau_ij(t) * (tau_ij(t)/tau0_ij)^2 * gamma_ij * (1 + phi_ij)

Highway edges (E_H) carry constant travel time across all time periods.
Feeder edges (E_F) carry phi_ij > 0 reflecting Braess structural vulnerability.
"""

# ─────────────────────────────────────────────────────────────────────────────
# 0. Imports
# ─────────────────────────────────────────────────────────────────────────────
import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.lines import Line2D
from collections import defaultdict
import warnings
import os

warnings.filterwarnings("ignore")
plt.rcParams.update({"font.size": 10, "figure.dpi": 150})

# ─────────────────────────────────────────────────────────────────────────────
# 1. Data Loading
# ─────────────────────────────────────────────────────────────────────────────

# Works from any directory — resolves relative to this .py file
DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def _p(fn):
    return os.path.join(DATA_DIR, fn)

def load_data():
    return (pd.read_csv(_p("nodes.csv")),
            pd.read_csv(_p("edges.csv")),
            pd.read_csv(_p("time_dependent_travel.csv")),
            pd.read_csv(_p("reliability_params.csv")),
            pd.read_csv(_p("operational_costs.csv")),
            pd.read_csv(_p("vehicles.csv")),
            pd.read_csv(_p("incidents.csv")))

nodes, edges, tdt, rel, costs, vehicles, incidents = load_data()

# ── Braess extension: applied in memory, no renamed files needed ──────────────
np.random.seed(42)
HIGHWAY_IDS = {105, 22, 71, 11, 79, 160}
edges["is_highway"] = edges["edge_id"].isin(HIGHWAY_IDS)
newly_trunk = HIGHWAY_IDS - {105}
mask_new = edges["edge_id"].isin(newly_trunk)
edges.loc[mask_new, "road_type"]            = "trunk"
edges.loc[mask_new, "free_speed_kmh"]       = (edges.loc[mask_new, "free_speed_kmh"] * 1.35).round(1)
edges.loc[mask_new, "base_travel_time_min"] = (
    edges.loc[mask_new, "length_km"] / edges.loc[mask_new, "free_speed_kmh"] * 60).round(2)

hw_nodes = set(edges.loc[edges["is_highway"], "from_node"].tolist()
               + edges.loc[edges["is_highway"], "to_node"].tolist())
edges["is_feeder"] = (~edges["is_highway"]) & (
    edges["from_node"].isin(hw_nodes) | edges["to_node"].isin(hw_nodes))

hw_base = dict(zip(edges["edge_id"], edges["base_travel_time_min"]))
hw_mask = tdt["edge_id"].isin(HIGHWAY_IDS)
tdt.loc[hw_mask, "congestion_multiplier"]  = 1.0
tdt.loc[hw_mask, "actual_travel_time_min"] = tdt.loc[hw_mask, "edge_id"].map(hw_base).round(2)

edge_hw  = dict(zip(edges["edge_id"], edges["is_highway"]))
edge_fed = dict(zip(edges["edge_id"], edges["is_feeder"]))
rel["phi_braess"] = [
    0.0 if edge_hw.get(e, False)
    else (round(np.random.uniform(0.25, 0.70), 3) if edge_fed.get(e, False) else 0.0)
    for e in rel["edge_id"]]
rel["vulnerability_class"] = rel["edge_id"].map(
    lambda e: "highway" if edge_hw.get(e, False)
    else ("feeder" if edge_fed.get(e, False) else "standard"))

_FUEL_RATE, _FUEL_PRICE, _WAGE = 0.45, 1450, 8.5
_MAINT = {"trunk": 38, "primary": 55, "residential": 72}
costs = costs.merge(
    edges[["edge_id","road_type","length_km","base_travel_time_min"]],
    on="edge_id", how="left")
def _recalc(r):
    fuel  = _FUEL_RATE * r.base_travel_time_min * _FUEL_PRICE * (0.70 if r.road_type=="trunk" else 1.0)
    maint = _MAINT.get(r.road_type, 55) * r.length_km
    wage  = _WAGE * r.base_travel_time_min
    tot   = fuel + maint + wage
    return pd.Series({"fuel_cost_MWK": round(fuel,2), "maintenance_cost_MWK": round(maint,2),
                      "wage_cost_MWK": round(wage,2), "total_cost_MWK": round(tot,2),
                      "cost_per_km_MWK": round(tot/r.length_km,2) if r.length_km>0 else 0})
costs[["fuel_cost_MWK","maintenance_cost_MWK","wage_cost_MWK",
       "total_cost_MWK","cost_per_km_MWK"]] = costs.apply(_recalc, axis=1)
costs.drop(columns=["road_type","length_km","base_travel_time_min"], errors="ignore", inplace=True)

print("Data loaded. Braess extension applied in memory.")
print(f"  Highway edges : {edges['is_highway'].sum()}")
print(f"  Feeder  edges : {edges['is_feeder'].sum()}")
print(f"  Standard edges: {(~edges['is_highway'] & ~edges['is_feeder']).sum()}")


# ─────────────────────────────────────────────────────────────────────────────
# 2. Lookup Tables (fast O(1) access during MOLS)
# ─────────────────────────────────────────────────────────────────────────────

# Time period → (start_hour, end_hour)
PERIODS = [
    ("night",        0,   6),
    ("morning_peak", 6,   9),
    ("midday",       9,  15),
    ("evening_peak", 15, 19),
    ("late_evening", 19, 24),
]

def get_period(hour):
    """Return the time-period name for a given hour (0–24)."""
    hour = hour % 24
    for name, start, end in PERIODS:
        if start <= hour < end:
            return name
    return "night"

# (edge_id, period) → actual_travel_time_min
tdt_lookup = {}
for _, row in tdt.iterrows():
    tdt_lookup[(int(row["edge_id"]), row["time_period"])] = float(row["actual_travel_time_min"])

# edge_id → base travel time (tau0)
tau0 = dict(zip(edges["edge_id"].astype(int), edges["base_travel_time_min"].astype(float)))

# edge_id → gamma
gamma = dict(zip(rel["edge_id"].astype(int), rel["gamma"].astype(float)))

# edge_id → phi_braess (Braess structural vulnerability)
phi = dict(zip(rel["edge_id"].astype(int), rel["phi_braess"].astype(float)))

# edge_id → total operational cost (MWK)
cost_lookup = dict(zip(costs["edge_id"].astype(int), costs["total_cost_MWK"].astype(float)))

# edge_id → criticality rho
rho = dict(zip(edges["edge_id"].astype(int), edges["criticality_rho"].astype(float)))

# (from_node, to_node) → edge_id
edge_id_map = {(int(r["from_node"]), int(r["to_node"])): int(r["edge_id"])
               for _, r in edges.iterrows()}

# edge_id → is_highway
is_highway = dict(zip(edges["edge_id"].astype(int), edges["is_highway"].astype(bool)))
is_feeder  = dict(zip(edges["edge_id"].astype(int), edges["is_feeder"].astype(bool)))

# ─────────────────────────────────────────────────────────────────────────────
# 3. Graph Construction
# ─────────────────────────────────────────────────────────────────────────────

G_base = nx.DiGraph()

for _, n in nodes.iterrows():
    G_base.add_node(int(n["node_id"]),
                    pos=(float(n["x"]), float(n["y"])),
                    node_type=n["node_type"],
                    zone=n["zone"],
                    name=n["name"])

for _, e in edges.iterrows():
    eid = int(e["edge_id"])
    G_base.add_edge(int(e["from_node"]), int(e["to_node"]),
                    edge_id=eid,
                    base_tt=float(e["base_travel_time_min"]),
                    criticality=float(e["criticality_rho"]),
                    is_highway=bool(e["is_highway"]),
                    is_feeder=bool(e["is_feeder"]))

print(f"Graph: {G_base.number_of_nodes()} nodes, "
      f"{G_base.number_of_edges()} edges")
print(f"  Highway edges : {sum(is_highway.values())}")
print(f"  Feeder  edges : {sum(is_feeder.values())}")
print(f"  Standard edges: {sum(1 for v in is_highway.values() if not v) - sum(is_feeder.values())}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. Travel Time Functions
# ─────────────────────────────────────────────────────────────────────────────

def get_tau(edge_id, current_hour, G=None, congestion_updates=None):
    """
    Return actual travel time for edge_id at current_hour (fractional, 0–24).
    Highway edges: always tau0 (constant).
    Other edges: lookup from tdt_lookup, with optional congestion update.
    """
    period = get_period(current_hour)
    base   = tdt_lookup.get((edge_id, period), tau0.get(edge_id, 1.0))

    if congestion_updates and edge_id in congestion_updates:
        base = base * (1.0 + congestion_updates[edge_id])
    return base


def get_v_star(edge_id, tau_val):
    """
    Modified reliability variability:
      v*_ij = tau * (tau/tau0)^2 * gamma * (1 + phi)
    """
    t0  = tau0.get(edge_id, tau_val)
    g   = gamma.get(edge_id, 0.4)
    p   = phi.get(edge_id, 0.0)
    if t0 == 0:
        return 0.0
    return tau_val * (tau_val / t0) ** 2 * g * (1.0 + p)

# ─────────────────────────────────────────────────────────────────────────────
# 5. MOLS Algorithm
# ─────────────────────────────────────────────────────────────────────────────

LAMBDA = 0.001   # MWK → minute equivalent
BETA   = 0.5     # resilience weight
RHO_0  = 0.3     # criticality threshold for constraint
R_MAX  = None    # set to integer to impose resilience constraint

def dominates(a, b):
    """True if label a dominates label b (a ≤ b in all objectives, < in one)."""
    return (a[0] <= b[0] and a[1] <= b[1] and a[2] <= b[2] and
            (a[0] < b[0] or  a[1] < b[1] or  a[2] < b[2]))

def mols(origin, destination, departure_hour,
         congestion_updates=None, graph=G_base):
    """
    Multi-Objective Label-Setting algorithm.

    Parameters
    ----------
    origin, destination : int  node IDs
    departure_hour      : float  fractional hour (e.g. 17.98)
    congestion_updates  : dict  {edge_id: fractional_increase} from prior dispatches
    graph               : nx.DiGraph

    Returns
    -------
    list of dicts, each representing one Pareto-optimal path with keys:
        f1, f2, f3, travel_time_min, path, arrival_hour
    """
    if origin == destination:
        return [{"f1": 0, "f2": 0, "f3": 0,
                 "travel_time_min": 0, "path": [origin],
                 "arrival_hour": departure_hour}]

    # Label: (f1, f2, f3, current_time_hours, node_path)
    INF = float("inf")
    labels   = defaultdict(list)        # node → list of labels
    queue    = []                       # list of (node, label)
    init     = (0.0, 0.0, 0.0, departure_hour, [origin])
    labels[origin].append(init)
    queue.append((origin, init))

    while queue:
        u, lbl = queue.pop(0)
        f1, f2, f3, t, path = lbl

        # Skip if this label has already been dominated since it was queued
        if lbl not in labels[u]:
            continue

        for u, v, data in graph.out_edges(u, data=True):
            eid  = data["edge_id"]
            tau  = get_tau(eid, t, congestion_updates=congestion_updates)
            cost = cost_lookup.get(eid, 0.0)
            vs   = get_v_star(eid, tau)
            r    = rho.get(eid, 0.0)

            nf1 = f1 + tau + LAMBDA * cost
            nf2 = f2 + vs
            nf3 = f3 + BETA * r

            # Optional resilience constraint
            if R_MAX is not None:
                high_rho_count = sum(1 for e in path[:-1]
                                     for nb in [path[path.index(e)+1]]
                                     if rho.get(edge_id_map.get((e, nb), -1), 0) > RHO_0)
                if r > RHO_0 and high_rho_count >= R_MAX:
                    continue

            new_lbl = (nf1, nf2, nf3, t + tau / 60.0, path + [v])

            # Dominance pruning
            dominated_by_existing = any(dominates(ex, new_lbl)
                                        for ex in labels[v])
            if dominated_by_existing:
                continue

            # Remove labels that new_lbl dominates
            labels[v] = [ex for ex in labels[v]
                         if not dominates(new_lbl, ex)]
            labels[v].append(new_lbl)
            queue.append((v, new_lbl))

    results = []
    for lbl in labels[destination]:
        f1, f2, f3, arr, path = lbl
        results.append({
            "f1": round(f1, 4),
            "f2": round(f2, 4),
            "f3": round(f3, 4),
            "travel_time_min": round((arr - departure_hour) * 60, 2),
            "path": path,
            "arrival_hour": round(arr, 4),
        })
    return results

# ─────────────────────────────────────────────────────────────────────────────
# 6. Pareto Selection
# ─────────────────────────────────────────────────────────────────────────────

def select_balanced(pareto_set):
    """
    Select the balanced Pareto solution by normalised distance to ideal point.
    Each objective is normalised to [0,1] then Euclidean distance to (0,0,0).
    """
    if not pareto_set:
        return None
    if len(pareto_set) == 1:
        return pareto_set[0]

    f1s = np.array([s["f1"] for s in pareto_set])
    f2s = np.array([s["f2"] for s in pareto_set])
    f3s = np.array([s["f3"] for s in pareto_set])

    def norm(arr):
        mn, mx = arr.min(), arr.max()
        return (arr - mn) / (mx - mn + 1e-9)

    n1, n2, n3 = norm(f1s), norm(f2s), norm(f3s)
    dist = np.sqrt(n1**2 + n2**2 + n3**2)
    return pareto_set[int(np.argmin(dist))]

# ─────────────────────────────────────────────────────────────────────────────
# 7. Sequential Multi-Vehicle Dispatch
# ─────────────────────────────────────────────────────────────────────────────

CONGESTION_INCREMENT = 0.15   # 15% travel time increase per overlapping vehicle

def run_simulation(incidents_df, vehicles_df, graph=G_base):
    """
    Sequential priority-based dispatch.
    Vehicles serve incidents sorted by (priority ASC, call_time ASC).
    After each dispatch, edges on the chosen path receive a congestion update.
    """
    # Sort: critical first, then by call time
    inc_sorted = incidents_df.sort_values(["priority", "call_time_hours"]).reset_index(drop=True)

    # Vehicle state: next_available_hour, current_node
    veh_state = {row["vehicle_id"]: {"available": float(row["available_from"]),
                                      "node": int(row["base_node"])}
                 for _, row in vehicles_df.iterrows()}

    # Shared congestion state across all dispatches
    congestion = {}

    results = []

    for _, inc in inc_sorted.iterrows():
        iid        = inc["incident_id"]
        dest       = int(inc["node_id"])
        call_time  = float(inc["call_time_hours"])
        severity   = inc["severity"]
        priority   = int(inc["priority"])

        # Assign nearest available vehicle
        best_veh, best_sol, best_tt = None, None, float("inf")

        for vid, state in veh_state.items():
            depart = max(state["available"], call_time)
            origin = state["node"]
            pareto = mols(origin, dest, depart,
                          congestion_updates=congestion)
            if not pareto:
                continue
            sol = select_balanced(pareto)
            if sol and sol["travel_time_min"] < best_tt:
                best_tt  = sol["travel_time_min"]
                best_veh = vid
                best_sol = sol
                best_sol["pareto_set"]  = pareto
                best_sol["depart_hour"] = depart
                best_sol["origin"]      = origin

        if best_veh is None:
            print(f"  WARNING: No route found for {iid}")
            continue

        sol = best_sol

        # Update congestion on edges used by this path
        path = sol["path"]
        for i in range(len(path) - 1):
            eid = edge_id_map.get((path[i], path[i+1]))
            if eid:
                congestion[eid] = congestion.get(eid, 0.0) + CONGESTION_INCREMENT

        # Update vehicle state
        veh_state[best_veh]["available"] = sol["arrival_hour"] + inc["service_time_min"] / 60.0
        veh_state[best_veh]["node"]      = dest

        results.append({
            "incident_id"     : iid,
            "severity"        : severity,
            "priority"        : priority,
            "vehicle"         : best_veh,
            "origin_node"     : sol["origin"],
            "dest_node"       : dest,
            "call_time_h"     : call_time,
            "depart_hour"     : sol["depart_hour"],
            "arrival_hour"    : sol["arrival_hour"],
            "travel_time_min" : sol["travel_time_min"],
            "f1"              : sol["f1"],
            "f2"              : sol["f2"],
            "f3"              : sol["f3"],
            "pareto_size"     : len(sol["pareto_set"]),
            "path"            : " → ".join(map(str, sol["path"])),
            "path_list"       : sol["path"],
            "pareto_set"      : sol["pareto_set"],
            "uses_highway"    : any(is_highway.get(
                                    edge_id_map.get((sol["path"][k], sol["path"][k+1]), -1), False)
                                    for k in range(len(sol["path"])-1)),
            "uses_feeder"     : any(is_feeder.get(
                                    edge_id_map.get((sol["path"][k], sol["path"][k+1]), -1), False)
                                    for k in range(len(sol["path"])-1)),
        })

        print(f"  {iid:8s} [{severity:9s}] → {best_veh}  "
              f"TT={sol['travel_time_min']:5.1f} min  "
              f"f1={sol['f1']:6.2f}  f2={sol['f2']:6.2f}  "
              f"f3={sol['f3']:5.3f}  |Pareto|={len(sol['pareto_set'])}")

    return pd.DataFrame(results)

print("\nRunning simulation...")
print("-" * 75)
results_df = run_simulation(incidents, vehicles)
print("-" * 75)
print(f"Completed: {len(results_df)} incidents served\n")

# ─────────────────────────────────────────────────────────────────────────────
# 8. Braess Counterfactual (phi = 0 for all edges)
# ─────────────────────────────────────────────────────────────────────────────
print("Running Braess counterfactual (phi=0 baseline)...")
phi_backup = dict(phi)
for k in phi:
    phi[k] = 0.0

print("-" * 75)
results_baseline = run_simulation(incidents, vehicles)
print("-" * 75)

# Restore
for k in phi_backup:
    phi[k] = phi_backup[k]

# ─────────────────────────────────────────────────────────────────────────────
# 9. Results Summary
# ─────────────────────────────────────────────────────────────────────────────

print("\n── MAIN SIMULATION RESULTS ──")
print(results_df[["incident_id","severity","vehicle","travel_time_min",
                   "f1","f2","f3","pareto_size","uses_highway","uses_feeder"]].to_string(index=False))

print(f"\nMean travel time : {results_df['travel_time_min'].mean():.1f} min")
print(f"Mean f1          : {results_df['f1'].mean():.2f}")
print(f"Mean f2          : {results_df['f2'].mean():.2f}")
print(f"Mean f3          : {results_df['f3'].mean():.3f}")
print(f"Mean Pareto size : {results_df['pareto_size'].mean():.1f}")
print(f"Total cost (MWK) : {results_df.apply(lambda r: sum(cost_lookup.get(edge_id_map.get((r['path_list'][i], r['path_list'][i+1]),-1),0) for i in range(len(r['path_list'])-1)), axis=1).sum():.0f}")

print("\n── BRAESS COUNTERFACTUAL COMPARISON ──")
comp = pd.DataFrame({
    "incident_id" : results_df["incident_id"],
    "severity"    : results_df["severity"],
    "f2_with_phi" : results_df["f2"].values,
    "f2_baseline" : results_baseline["f2"].values,
    "f2_increase" : (results_df["f2"].values - results_baseline["f2"].values).round(3),
    "uses_feeder" : results_df["uses_feeder"].values,
})
print(comp.to_string(index=False))
print(f"\nMean f2 with phi   : {results_df['f2'].mean():.3f}")
print(f"Mean f2 baseline   : {results_baseline['f2'].mean():.3f}")
print(f"Mean f2 increase   : {(results_df['f2'].mean() - results_baseline['f2'].mean()):.3f}")

# ─────────────────────────────────────────────────────────────────────────────
# 10. Edge Class Performance Table
# ─────────────────────────────────────────────────────────────────────────────

print("\n── EDGE CLASS PERFORMANCE (evening peak) ──")
ep_tdt = tdt[tdt["time_period"] == "evening_peak"].copy()
ep_tdt = ep_tdt.merge(
    rel[["edge_id","gamma","phi_braess","vulnerability_class"]], on="edge_id")
ep_tdt = ep_tdt.merge(edges[["edge_id","criticality_rho"]], on="edge_id")

ep_tdt["tau0"] = ep_tdt["edge_id"].map(tau0)
ep_tdt["v_star"] = ep_tdt.apply(
    lambda r: r["actual_travel_time_min"]
              * (r["actual_travel_time_min"] / r["tau0"]) ** 2
              * r["gamma"]
              * (1 + r["phi_braess"]), axis=1)

edge_perf = ep_tdt.groupby("vulnerability_class").agg(
    mean_tau=("actual_travel_time_min", "mean"),
    mean_v_star=("v_star", "mean"),
    mean_rho=("criticality_rho", "mean"),
    count=("edge_id", "count")
).round(3)

print(edge_perf.to_string())

# ─────────────────────────────────────────────────────────────────────────────
# 11. Visualisations
# ─────────────────────────────────────────────────────────────────────────────

SEVERITY_COLOR = {
    "critical": "#d62728",
    "urgent"  : "#ff7f0e",
    "moderate": "#1f77b4",
    "minor"   : "#2ca02c",
}
PERIOD_ORDER = ["night","morning_peak","midday","evening_peak","late_evening"]

# ── Figure 1: Pareto Fronts ───────────────────────────────────────────────────
n_inc   = len(results_df)
ncols   = 5
nrows   = int(np.ceil(n_inc / ncols))
fig, axes = plt.subplots(nrows, ncols,
                         figsize=(ncols * 3.5, nrows * 3.2))
axes = axes.flatten()

for idx, row in results_df.iterrows():
    ax     = axes[idx]
    pareto = row["pareto_set"]
    f1v    = [s["f1"] for s in pareto]
    f2v    = [s["f2"] for s in pareto]
    f3v    = [s["f3"] for s in pareto]

    sc = ax.scatter(f1v, f2v, c=f3v, cmap="RdYlGn_r",
                    s=25, alpha=0.7, vmin=0, vmax=max(f3v)+0.01)
    ax.scatter(row["f1"], row["f2"],
               color="red", marker="*", s=120, zorder=5,
               label="Selected")
    ax.set_title(f"{row['incident_id']}\n({row['severity']})",
                 fontsize=8, color=SEVERITY_COLOR.get(row["severity"], "black"))
    ax.set_xlabel("$f_1'$", fontsize=7)
    ax.set_ylabel("$f_2$", fontsize=7)
    ax.tick_params(labelsize=7)
    plt.colorbar(sc, ax=ax, label="$f_3$", shrink=0.8)

for ax in axes[n_inc:]:
    ax.set_visible(False)

fig.suptitle("Pareto Fronts — All Incidents ($f_1'$ vs $f_2$; colour = $f_3$)",
             fontsize=13, y=1.01)
plt.tight_layout()
plt.savefig("pareto_fronts.png", bbox_inches="tight")
plt.close()
print("Saved: pareto_fronts.png")

# ── Figure 2: Response Time Analysis ─────────────────────────────────────────
fig, axes = plt.subplots(2, 3, figsize=(16, 9))

# 2a. Travel time distribution
ax = axes[0, 0]
ax.hist(results_df["travel_time_min"], bins=8, color="#4c72b0",
        edgecolor="white", alpha=0.85)
ax.axvline(results_df["travel_time_min"].mean(), color="red",
           linestyle="--", label=f"Mean: {results_df['travel_time_min'].mean():.1f} min")
ax.set_xlabel("Travel Time (min)")
ax.set_ylabel("Frequency")
ax.set_title("Travel Time Distribution")
ax.legend()

# 2b. Travel time by severity
ax = axes[0, 1]
sev_order = ["critical","urgent","moderate","minor"]
data_sev  = [results_df[results_df["severity"]==s]["travel_time_min"].values
             for s in sev_order]
bp = ax.boxplot(data_sev, labels=sev_order, patch_artist=True,
                medianprops=dict(color="black", linewidth=2))
for patch, sev in zip(bp["boxes"], sev_order):
    patch.set_facecolor(SEVERITY_COLOR[sev])
    patch.set_alpha(0.7)
ax.set_ylabel("Travel Time (min)")
ax.set_title("Travel Time by Severity")
ax.tick_params(axis="x", rotation=20)

# 2c. Vehicle utilisation
ax = axes[0, 2]
veh_counts = results_df["vehicle"].value_counts().sort_index()
ax.bar(veh_counts.index, veh_counts.values, color="#55a868", alpha=0.85,
       edgecolor="white")
ax.set_ylabel("Incidents Served")
ax.set_title("Vehicle Utilisation")

# 2d. Braess effect: f2 comparison
ax = axes[1, 0]
x  = np.arange(len(comp))
w  = 0.4
ax.bar(x - w/2, comp["f2_baseline"], width=w, label="Baseline (φ=0)",
       color="#4878d0", alpha=0.8)
ax.bar(x + w/2, comp["f2_with_phi"], width=w, label="With Braess φ",
       color="#ee854a", alpha=0.8)
ax.set_xticks(x)
ax.set_xticklabels(comp["incident_id"], rotation=45, fontsize=7)
ax.set_ylabel("$f_2$ (Reliability Penalty)")
ax.set_title("Braess Effect on $f_2$ per Incident")
ax.legend(fontsize=8)

# 2e. Edge class v* comparison (evening peak)
ax = axes[1, 1]
classes   = ["highway", "feeder", "standard"]
v_star_ep = [ep_tdt[ep_tdt["vulnerability_class"]==c]["v_star"].mean()
             for c in classes]
colors_ec = ["#4c72b0", "#c44e52", "#55a868"]
ax.bar(classes, v_star_ep, color=colors_ec, alpha=0.85, edgecolor="white")
ax.set_ylabel("Mean $v^*_{ij}$ (Evening Peak)")
ax.set_title("Reliability Variability by Edge Class")

# 2f. Objective space scatter (f1 vs f2, colour = f3)
ax = axes[1, 2]
sc = ax.scatter(results_df["f1"], results_df["f2"],
                c=results_df["f3"], cmap="RdYlGn_r",
                s=80, alpha=0.85, edgecolors="white", linewidths=0.5)
for _, row in results_df.iterrows():
    ax.annotate(row["incident_id"].replace("INC_",""),
                (row["f1"], row["f2"]), fontsize=6,
                xytext=(3, 3), textcoords="offset points")
plt.colorbar(sc, ax=ax, label="$f_3$")
ax.set_xlabel("$f_1'$ (Time + Cost)")
ax.set_ylabel("$f_2$ (Reliability)")
ax.set_title("Selected Solutions in Objective Space")

fig.suptitle("Emergency Routing — Response Time and Braess Analysis", fontsize=13)
plt.tight_layout()
plt.savefig("response_time_analysis.png", bbox_inches="tight")
plt.close()
print("Saved: response_time_analysis.png")

# ── Figure 3: Network Topology ────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(18, 6))
pos = nx.get_node_attributes(G_base, "pos")

NODE_COLOR = {"hospital": "#d62728", "market": "#ff7f0e",
              "intersection": "#aec7e8"}

node_types  = nx.get_node_attributes(G_base, "node_type")
node_colors = [NODE_COLOR.get(node_types.get(n, "intersection"), "#aec7e8")
               for n in G_base.nodes()]
node_sizes  = [300 if node_types.get(n) == "hospital" else
               200 if node_types.get(n) == "market" else 60
               for n in G_base.nodes()]

# 3a. Full network with edge criticality
ax = axes[0]
edge_rhos   = [rho.get(G_base[u][v]["edge_id"], 0) for u, v in G_base.edges()]
edge_colors = plt.cm.Reds(np.array(edge_rhos) / max(edge_rhos + [0.01]))
nx.draw_networkx_nodes(G_base, pos, ax=ax, node_color=node_colors,
                       node_size=node_sizes)
nx.draw_networkx_edges(G_base, pos, ax=ax, edge_color=edge_colors,
                       width=1.0, arrows=False, alpha=0.7)
nx.draw_networkx_labels(G_base, pos, ax=ax,
                        labels={n: n for n in G_base.nodes()
                                if node_types.get(n) in ["hospital","market"]},
                        font_size=7, font_color="black")
ax.set_title("Network Topology\n(edge colour = betweenness $\\rho_{ij}$)")
legend_els = [mpatches.Patch(color=NODE_COLOR["hospital"],  label="Hospital"),
              mpatches.Patch(color=NODE_COLOR["market"],    label="Market"),
              mpatches.Patch(color="#aec7e8",               label="Intersection")]
ax.legend(handles=legend_els, fontsize=8, loc="upper right")
ax.axis("off")

# 3b. Highway / feeder classification overlay
ax = axes[1]
hw_edges  = [(u, v) for u, v, d in G_base.edges(data=True) if d["is_highway"]]
fed_edges = [(u, v) for u, v, d in G_base.edges(data=True) if d["is_feeder"]]
std_edges = [(u, v) for u, v, d in G_base.edges(data=True)
             if not d["is_highway"] and not d["is_feeder"]]

nx.draw_networkx_nodes(G_base, pos, ax=ax, node_color=node_colors,
                       node_size=node_sizes)
nx.draw_networkx_edges(G_base, pos, ax=ax, edgelist=std_edges,
                       edge_color="#cccccc", width=0.8, arrows=False)
nx.draw_networkx_edges(G_base, pos, ax=ax, edgelist=fed_edges,
                       edge_color="#ff7f0e", width=1.5, arrows=False, alpha=0.8)
nx.draw_networkx_edges(G_base, pos, ax=ax, edgelist=hw_edges,
                       edge_color="#1a6faf", width=3.0, arrows=False)
ax.set_title("Edge Classification\n(blue=highway, orange=feeder, grey=standard)")
leg_els = [Line2D([0],[0], color="#1a6faf", lw=3,  label="Highway $E_H$"),
           Line2D([0],[0], color="#ff7f0e", lw=2,  label="Feeder $E_F$"),
           Line2D([0],[0], color="#cccccc", lw=1,  label="Standard $E_S$")]
ax.legend(handles=leg_els, fontsize=8)
ax.axis("off")

# 3c. Dispatched routes (INC_006 highlighted)
ax = axes[2]
nx.draw_networkx_nodes(G_base, pos, ax=ax, node_color=node_colors,
                       node_size=node_sizes)
nx.draw_networkx_edges(G_base, pos, ax=ax, edge_color="#eeeeee",
                       width=0.5, arrows=False)

cmap_sev = plt.cm.get_cmap("tab10")
for idx, row in results_df.iterrows():
    p = row["path_list"]
    edge_list = [(p[i], p[i+1]) for i in range(len(p)-1)
                 if G_base.has_edge(p[i], p[i+1])]
    lw = 3.0 if row["severity"] == "critical" else 1.5
    nx.draw_networkx_edges(G_base, pos, ax=ax,
                           edgelist=edge_list,
                           edge_color=[SEVERITY_COLOR.get(row["severity"],"grey")],
                           width=lw, arrows=True, alpha=0.6,
                           arrowsize=8)

nx.draw_networkx_labels(G_base, pos, ax=ax,
                        labels={n: n for n in G_base.nodes()
                                if node_types.get(n) in ["hospital","market"]},
                        font_size=7)
ax.set_title("Dispatched Routes\n(red=critical, orange=urgent, blue=moderate)")
ax.axis("off")

fig.suptitle("Network Analysis — Road Classification and Dispatched Routes",
             fontsize=13)
plt.tight_layout()
plt.savefig("network_analysis.png", bbox_inches="tight")
plt.close()
print("Saved: network_analysis.png")

# ── Figure 4: Time-of-Day Analysis ────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(16, 5))

def assign_period_label(h):
    for name, s, e in PERIODS:
        if s <= h < e:
            return name
    return "night"

results_df["period"] = results_df["call_time_h"].apply(assign_period_label)

# 4a. Mean travel time by period
ax = axes[0]
period_tt = results_df.groupby("period")["travel_time_min"].agg(["mean","std"]).reindex(PERIOD_ORDER).dropna()
ax.bar(range(len(period_tt)), period_tt["mean"], yerr=period_tt["std"],
       color="#4c72b0", alpha=0.85, capsize=4, edgecolor="white")
ax.set_xticks(range(len(period_tt)))
ax.set_xticklabels(period_tt.index, rotation=25, fontsize=8)
ax.set_ylabel("Mean Travel Time (min)")
ax.set_title("Travel Time by Time Period")

# 4b. Mean f2 by period (with vs without phi)
ax = axes[1]
results_baseline["period"] = results_baseline["call_time_h"].apply(assign_period_label)
f2_phi  = results_df.groupby("period")["f2"].mean().reindex(PERIOD_ORDER).dropna()
f2_base = results_baseline.groupby("period")["f2"].mean().reindex(PERIOD_ORDER).dropna()
x = np.arange(len(f2_phi))
w = 0.4
ax.bar(x - w/2, f2_base.values, width=w, label="Baseline (φ=0)",
       color="#4878d0", alpha=0.8)
ax.bar(x + w/2, f2_phi.values,  width=w, label="With Braess φ",
       color="#ee854a", alpha=0.8)
ax.set_xticks(x)
ax.set_xticklabels(f2_phi.index, rotation=25, fontsize=8)
ax.set_ylabel("Mean $f_2$")
ax.set_title("Reliability Penalty by Period\n(Braess Effect)")
ax.legend(fontsize=8)

# 4c. Pareto set size by period
ax = axes[2]
period_ps = results_df.groupby("period")["pareto_size"].mean().reindex(PERIOD_ORDER).dropna()
ax.bar(range(len(period_ps)), period_ps.values,
       color="#55a868", alpha=0.85, edgecolor="white")
ax.set_xticks(range(len(period_ps)))
ax.set_xticklabels(period_ps.index, rotation=25, fontsize=8)
ax.set_ylabel("Mean |Pareto|")
ax.set_title("Pareto Set Size by Time Period")

fig.suptitle("Time-of-Day Performance Analysis", fontsize=13)
plt.tight_layout()
plt.savefig("time_of_day_analysis.png", bbox_inches="tight")
plt.close()
print("Saved: time_of_day_analysis.png")

# ─────────────────────────────────────────────────────────────────────────────
# 12. Export Results to CSV
# ─────────────────────────────────────────────────────────────────────────────
export_cols = ["incident_id","severity","priority","vehicle",
               "origin_node","dest_node","call_time_h","depart_hour",
               "arrival_hour","travel_time_min","f1","f2","f3",
               "pareto_size","uses_highway","uses_feeder","path"]
results_df[export_cols].to_csv("simulation_results.csv", index=False)
comp.to_csv("braess_comparison.csv", index=False)
edge_perf.to_csv("edge_class_performance.csv")
print("Saved: simulation_results.csv, braess_comparison.csv, edge_class_performance.csv")
print("\nDone.")
