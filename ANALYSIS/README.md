# Emergency Vehicle Routing Simulation Data Package

## Project Information
- **Title**: Simultaneous Routing of Emergency Vehicles in Poorly Developed and Congested Urban Networks
- **Location**: Zomba, Malawi
- **Author**: Josophat Makawa (BSC/MAT/14/21)
- **Supervisor**: Dr. E. Mwakilama
- **Institution**: University of Malawi - Mathematical Sciences Department
- **Date**: December 2025

## Overview
This package contains comprehensive synthetic data for simulating emergency vehicle routing in congested urban networks. The data is designed to support multi-objective optimization research balancing travel time, reliability, operational cost, and network resilience.

## Package Contents

### 📊 Core Data Files (CSV)
1. **nodes.csv** (40 records)
   - Network vertices: intersections, hospitals, and markets
   - Spatial coordinates and zone classifications

2. **edges.csv** (200 records)
   - Directed road segments with properties
   - Includes criticality scores (edge betweenness centrality)

3. **time_profiles.csv** (5 records)
   - Congestion patterns throughout 24-hour period
   - Separate multipliers for normal vs. market roads

4. **vehicles.csv** (5 records)
   - Emergency ambulances with base locations
   - Vehicle properties and dispatch priorities

5. **incidents.csv** (15 records)
   - Emergency calls with severity levels
   - Temporal and spatial distribution

6. **operational_costs.csv** (200 records)
   - Fuel, maintenance, and wage costs per edge
   - Values in Malawian Kwacha (MWK)

7. **reliability_params.csv** (200 records)
   - Variability factors (γ) for each edge
   - Reliability classifications

8. **time_dependent_travel.csv** (1,000 records)
   - Explicit travel times for each edge × time period
   - Ready for direct lookup in algorithms

### 📈 Excel Workbook
**Emergency_Routing_Simulation_Data.xlsx**
- All data organized in separate sheets
- Professional formatting with headers
- Summary statistics sheet
- README documentation sheet
- Frozen headers and alternating row colors

### 📄 Documentation
**Data_Dictionary_and_Codebook.docx** (15 pages)
- Complete variable descriptions
- Mathematical notation reference
- Multi-objective formulation
- Data generation methodology
- Usage guidelines

### 📊 Visualizations
1. **network_visualization.png**
   - Node types and network topology
   - Edge criticality analysis with color coding
   - Network statistics overlay

2. **network_analysis.png**
   - Criticality score distribution
   - Road type composition

### 📋 Metadata
**metadata.json**
- Generation timestamp
- Model parameters
- File inventory

## Network Characteristics

### Nodes
- **Total**: 40 nodes
  - 3 Hospitals (ambulance bases)
  - 4 Markets (high congestion zones)
  - 33 Intersections

### Edges
- **Total**: 200 directed edges
- **Road Types**:
  - Trunk: ~60 km/h, 4 lanes
  - Primary: ~40 km/h, 2 lanes
  - Residential: ~25 km/h, 1 lane
- **Average Degree**: ~4-5 connections per node

### Vehicles
- 5 ambulances distributed across 3 hospitals
- Priority-based dispatch system

### Incidents
- 15 emergency calls with varying severity:
  - Critical (20%): Priority 1
  - Urgent (35%): Priority 2
  - Moderate (30%): Priority 3
  - Minor (15%): Priority 4

## Methodology Framework

### Multi-Objective Optimization
The model optimizes three objectives:
1. **Travel Time + Cost**: f'₁(P) = Σ [τij(ti) + λ·cij]
2. **Reliability**: f₂(P) = Σ vij(ti)
3. **Resilience**: f₃(P) = β·Σ ρij

### Time-Dependent Travel Times
- Piecewise-linear congestion functions
- 5 time periods: night, morning peak, midday, evening peak, late evening
- Market roads experience higher congestion (up to 2.5× multiplier)

### Edge Criticality
- Betweenness centrality (ρij) normalized to [0,1]
- Identifies structural bottlenecks
- Higher values = more critical to network flow

## Usage Instructions

### For Simulation
1. Load required CSV files
2. Initialize directed graph from nodes and edges
3. Implement Multi-Objective Label-Setting (MOLS) algorithm
4. Query time_dependent_travel for τij(t) values
5. Apply sequential routing with vehicle updates

### For Analysis
- Analyze criticality scores to identify vulnerable points
- Compare performance across time periods
- Evaluate trade-offs between objectives
- Test resilience through edge closure scenarios

### For Visualization
- Use (x, y) coordinates for spatial plots
- Color-code by node_type, zone, or criticality
- Animate vehicle movements using timestamps
- Create heat maps of congestion patterns

## Key Variables Reference

| Variable | Description | Location |
|----------|-------------|----------|
| τij(t) | Time-dependent travel time | time_dependent_travel.csv |
| ρij | Edge criticality score | edges.csv → criticality_rho |
| γ | Variability factor | reliability_params.csv → gamma |
| cij | Operational cost | operational_costs.csv → total_cost_MWK |

## Python Quick Start

```python
import pandas as pd
import networkx as nx

# Load data
nodes = pd.read_csv('nodes.csv')
edges = pd.read_csv('edges.csv')
time_travel = pd.read_csv('time_dependent_travel.csv')
incidents = pd.read_csv('incidents.csv')
vehicles = pd.read_csv('vehicles.csv')

# Create graph
G = nx.DiGraph()
for _, node in nodes.iterrows():
    G.add_node(node['node_id'], pos=(node['x'], node['y']))

for _, edge in edges.iterrows():
    G.add_edge(edge['from_node'], edge['to_node'], 
               weight=edge['base_travel_time_min'],
               criticality=edge['criticality_rho'])

# Query time-dependent travel time
def get_travel_time(edge_id, current_hour):
    period_map = {
        (0, 6): 'night',
        (6, 9): 'morning_peak',
        (9, 15): 'midday',
        (15, 19): 'evening_peak',
        (19, 24): 'late_evening'
    }
    
    for (start, end), period in period_map.items():
        if start <= current_hour < end:
            result = time_travel[
                (time_travel['edge_id'] == edge_id) & 
                (time_travel['time_period'] == period)
            ]
            return result['actual_travel_time_min'].iloc[0]
    
    return None
```

## File Formats

All CSV files use:
- Comma separator
- Header row included
- UTF-8 encoding
- No missing values (complete dataset)

## Validation

✅ All formulas verified for consistency  
✅ Network connectivity confirmed  
✅ Parameter ranges validated against literature  
✅ Zero missing values  
✅ All edge references valid  

## Citations

If using this data in publications, please cite:

```
Makawa, J. (2025). Simultaneous Routing of Emergency Vehicles in Poorly 
Developed and Congested Urban Networks. BSc Thesis, University of Malawi, 
Mathematical Sciences Department.
```

## Support & Questions

For questions about the data or methodology:
- Review Data_Dictionary_and_Codebook.docx for detailed variable descriptions
- Consult the thesis document (BSC-MAT-14-21.pdf) for complete methodology
- Examine visualization files for network structure insights

## Version Information
- **Generated**: February 2026
- **Python Libraries**: NetworkX, pandas, matplotlib, openpyxl, python-docx
- **Random Seed**: 42 (for reproducibility)

---

**Ready for Simulation!** 🚑📊🗺️

This dataset provides a complete foundation for:
- Algorithm development and testing
- Thesis evaluation and analysis
- Conference presentations
- GUI demonstrations
- Policy simulations

Good luck with your research!

---

## Update: Highway Upgrade & Braess Paradox Extension (April 2026)

### Motivation
The supervisor recommended incorporating structural vulnerability caused by
unplanned highway upgrades, as per Braess's paradox: upgrading a corridor
to highway standard can increase congestion on feeder roads that connect
to it, even though the highway itself flows freely.

### New Edge Classification (edges_updated.csv)
| Column | Description |
|--------|-------------|
| `is_highway` | True for 6 trunk-standard edges (E_H) |
| `is_feeder`  | True for 71 edges directly incident to a highway node (E_F) |

Highway edges have time-invariant travel time (congestion multiplier = 1.0
across all periods). Five previously primary-class edges were reclassified
to trunk with free speeds scaled ~35% upward.

### New Reliability Parameter (reliability_params_updated.csv)
| Column | Description |
|--------|-------------|
| `phi_braess` | Braess structural vulnerability φ_ij ∈ [0.25, 0.70] for feeder edges; 0.0 otherwise |
| `vulnerability_class` | 'highway' / 'feeder' / 'standard' |

φ_ij enters the modified reliability objective:
  v*_ij(t) = τ_ij(t) · (τ_ij(t)/τ°_ij)² · γ_ij · (1 + φ_ij)

### Updated time_dependent_travel_updated.csv
All 6 highway edges now carry congestion_multiplier = 1.0 and
actual_travel_time_min = base_travel_time_min across all 5 time periods.

### Updated operational_costs_updated.csv
Cost rates now differentiated by road type:
- Trunk:       fuel ×0.70 (smooth surface saving), lower maintenance rate (38 MWK/km)
- Primary:     maintenance 55 MWK/km
- Residential: maintenance 72 MWK/km (unpaved/rough surface premium)

### Key Variable Added
| Variable | Description | Location |
|----------|-------------|----------|
| φ_ij | Braess structural vulnerability | reliability_params_updated.csv → phi_braess |
