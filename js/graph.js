/**
 * graph.js  —  Graph Layer
 * ─────────────────────────────────────────────────────────────────
 * Cytoscape.js initialisation, node/edge styling, and the live
 * edge-color update driven by time-of-day.
 *
 * Generalized model: each node carries a `category` field derived
 * from node_type via State.getCategory(), making the routing engine
 * institution-agnostic. Adding police / fire / NGO nodes only
 * requires updating the data — no routing code changes needed.
 *
 * Exposes: window.Graph
 *   .init()               – build cy instance + bind events
 *   .setHour(h)           – recolor edges for fractional hour
 *   .getCongestion()      – { count, avgTime, totalCost }
 *   .reapplyBaseStyles()  – restore base styling after clear
 *   .cy                   – live Cytoscape instance
 *   .multToColor(m)       – congestion multiplier → CSS color
 *   .getMultiplierForHour(h, isMarket)
 */
window.Graph = (() => {

  const CONGESTION_THRESHOLD = 1.3;
  let cy = null;

  // ── Congestion colour (5-stop gradient) ─────────────────────────
  function multToColor(mult) {
    const stops = [
      { at:1.0, r:0,   g:217, b:139 },
      { at:1.2, r:128, g:204, b:0   },
      { at:1.5, r:240, g:165, b:0   },
      { at:2.0, r:240, g:96,  b:0   },
      { at:2.5, r:240, g:24,  b:56  },
    ];
    const m = Math.max(1.0, Math.min(2.5, mult));
    let lo = stops[0], hi = stops[stops.length-1];
    for (let i = 0; i < stops.length-1; i++) {
      if (m >= stops[i].at && m <= stops[i+1].at) { lo=stops[i]; hi=stops[i+1]; break; }
    }
    const t = (m-lo.at)/(hi.at-lo.at);
    const r = Math.round(lo.r+(hi.r-lo.r)*t);
    const g = Math.round(lo.g+(hi.g-lo.g)*t);
    const b = Math.round(lo.b+(hi.b-lo.b)*t);
    return `rgb(${r},${g},${b})`;
  }

  // ── Time → congestion multiplier ───────────────────────────────
  function getMultiplierForHour(hour, isMarketRoad) {
    const profile = TIME_PROFILES.find(p =>
      hour >= parseFloat(p.start_hour) && hour < parseFloat(p.end_hour)
    ) || TIME_PROFILES[TIME_PROFILES.length-1];

    const base = isMarketRoad ? parseFloat(profile.multiplier_market)
                              : parseFloat(profile.multiplier_normal);

    // Smooth ramp into next period
    const slotStart = parseFloat(profile.start_hour);
    const slotEnd   = parseFloat(profile.end_hour);
    const rampZone  = Math.min(0.25, (slotEnd-slotStart)*0.1);
    const pos = hour - slotStart;
    if (pos > (slotEnd-slotStart) - rampZone) {
      const next = TIME_PROFILES.find(p => parseFloat(p.start_hour) === slotEnd);
      if (next) {
        const nextBase = isMarketRoad ? parseFloat(next.multiplier_market) : parseFloat(next.multiplier_normal);
        const t = (pos - ((slotEnd-slotStart) - rampZone)) / rampZone;
        return base + (nextBase-base)*t;
      }
    }
    return base;
  }

  // ── Edge width = f(road type, criticality ρ) ──────────────────
  function edgeWidth(roadType, criticality) {
    const base = roadType==='trunk' ? 4 : roadType==='primary' ? 2.5 : 1.5;
    return Math.min(base + (criticality || 0)*4, 9);
  }

  // ── Dynamic criticality modulation ─────────────────────────────
  function getCriticalityForHour(baseCrit, hour, mult) {
    // Criticality increases with congestion (mult) and has a slight 
    // time-of-day modulation (sine wave to simulate peak-hour importance)
    const timeMod = 1.0 + 0.2 * Math.sin((hour / 24) * 2 * Math.PI - Math.PI / 2);
    const congMod = 1.0 + (mult - 1.0) * 0.5;
    return Math.min(1.0, baseCrit * timeMod * congMod);
  }

  // ── Node visual params by type ─────────────────────────────────
  function nodeStyle(d) {
    if (d.node_type==='hospital')
      return { bg:'#110614', border:'#f02040', size:46, shadowColor:'#f02040' };
    if (d.node_type==='market')
      return { bg:'#110800', border:'#f0a500', size:34, shadowColor:'#f0a500' };
    const cbd = d.zone==='CBD';
    return { bg: cbd?'#0c1c34':'#08141e', border: cbd?'#1e4080':'#102030', size:26, shadowColor:null };
  }

  // ── init ───────────────────────────────────────────────────────
  function init() {
    const elements = [];

    CY_NODES.forEach(n => {
      const d = n.data;
      const s = nodeStyle(d);
      const label = d.node_type==='hospital' ? d.label.replace('Dispatch_','D') :
                    d.node_type==='market'   ? d.label.replace('Market_','M') :
                    String(d.id);
      elements.push({
        data: {
          ...d,
          label,
          nodeBg:     s.bg,
          nodeBorder: s.border,
          nodeSize:   s.size,
          nodeGlow:   s.shadowColor || 'transparent',
          nodeType:   d.node_type,
          category:   State.getCategory(d),  // ← generalized category
          hasIncident: d.has_incident ? 'yes' : 'no',
          isBase:      d.is_base     ? 'yes' : 'no',
        },
        position: n.position,
      });
    });

    CY_EDGES.forEach(e => {
      const d    = e.data;
      const mult = getMultiplierForHour(0, d.is_market_road);
      const col  = multToColor(mult);
      const w    = edgeWidth(d.road_type, d.criticality||0);
      elements.push({
        data: {
          ...d,
          lineColor:   col,
          arrowColor:  col,
          edgeW:       w,
          currentMult: mult,
          roadType:    d.road_type,
        },
      });
    });

    cy = cytoscape({
      container: document.getElementById('cy'),
      elements,
      style:  buildStyle(),
      layout: { name:'preset' },
      minZoom:.3, maxZoom:6,
    });

    _bindEvents();
    return cy;
  }

  function buildStyle() {
    return [
      { selector:'node', style:{
          'width':'data(nodeSize)', 'height':'data(nodeSize)',
          'background-color':'data(nodeBg)',
          'border-width':2, 'border-color':'data(nodeBorder)',
          'label':'data(label)', 'color':'#506880',
          'font-family':'Barlow Condensed, sans-serif',
          'font-size':9, 'font-weight':700,
          'text-valign':'center', 'text-halign':'center',
          'shadow-blur':0,
        }
      },
      { selector:'node[nodeType="hospital"]', style:{
          'color':'#f02040','font-size':10,
          'shadow-blur':20,'shadow-color':'#f02040','shadow-opacity':.6,
          'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      { selector:'node[nodeType="market"]', style:{
          'shape':'diamond','color':'#f0a500',
          'shadow-blur':14,'shadow-color':'#f0a500','shadow-opacity':.5,
          'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      { selector:'node[hasIncident="yes"]', style:{
          'border-width':2.5,'border-color':'#f02040',
          'shadow-blur':18,'shadow-color':'#f02040','shadow-opacity':.8,
          'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      { selector:'node[isBase="yes"]', style:{ 'border-width':4,'border-style':'double' } },
      { selector:'node:selected', style:{
          'border-color':'#fff','shadow-blur':20,'shadow-color':'#fff',
          'shadow-opacity':.5,'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      // Edges base
      { selector:'edge', style:{
          'width':'data(edgeW)', 'line-color':'data(lineColor)',
          'target-arrow-color':'data(arrowColor)',
          'target-arrow-shape':'triangle', 'arrow-scale':1.1,
          'curve-style':'bezier', 'opacity':.7,
        }
      },
      { selector:'edge[roadType="primary"]', style:{
          'shadow-blur':5,'shadow-color':'data(lineColor)','shadow-opacity':.35,
          'shadow-offset-x':0,'shadow-offset-y':0,'opacity':.85,
        }
      },
      { selector:'edge[roadType="trunk"]', style:{
          'shadow-blur':10,'shadow-color':'#e8c000','shadow-opacity':.55,
          'shadow-offset-x':0,'shadow-offset-y':0,'opacity':1,
        }
      },
      { selector:'edge.hovered', style:{
          'opacity':1,'shadow-blur':14,'shadow-color':'data(lineColor)',
          'shadow-opacity':.9,'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      // Resilience
      { selector:'edge.candidate', style:{
          'line-color':'#f0a500','target-arrow-color':'#f0a500',
          'line-style':'dashed','line-dash-pattern':[8,4],
          'width':6,'opacity':1,'shadow-blur':16,'shadow-color':'#f0a500',
          'shadow-opacity':.85,'shadow-offset-x':0,'shadow-offset-y':0,'z-index':10,
        }
      },
      { selector:'edge.severed', style:{ 'display':'none' } },
      // Highlighter
      { selector:'node.hl-active', style:{
          'border-width':3.5,'border-color':'data(hlBorder)',
          'shadow-blur':'data(hlBlur)','shadow-color':'data(hlShadow)',
          'shadow-opacity':'data(hlOpacity)',
          'shadow-offset-x':0,'shadow-offset-y':0,
        }
      },
      // Locate Glow
      { selector:'node.locate-active', style:{
          'border-width':4, 'border-color':'#ffffff',
          'shadow-blur':24, 'shadow-color':'#ffffff',
          'shadow-opacity':1.0, 'shadow-offset-x':0, 'shadow-offset-y':0,
        }
      },
    ];
  }

  // ── Restore base styles (after routing clear) ──────────────────
  function reapplyBaseStyles() {
    if (!cy) return;
    cy.edges().not('.severed').forEach(edge => {
      const d    = edge.data();
      const mult = d.currentMult || 1;
      const hour = 0; // default for reapply
      const col  = multToColor(mult);
      const crit = getCriticalityForHour(d.criticality || 0, hour, mult);
      const w    = edgeWidth(d.road_type, crit);
      edge.data('lineColor',   col);
      edge.data('arrowColor',  col);
      edge.data('edgeW',       w);
      edge.data('dynamicCrit', crit);
    });
    cy.style().update();
  }

  // ── Update edge colors for given fractional hour ───────────────
  function setHour(hour) {
    if (!cy) return;
    cy.edges().not('.severed').forEach(edge => {
      const d    = edge.data();
      const mult = getMultiplierForHour(hour, d.is_market_road);
      const col  = multToColor(mult);
      const crit = getCriticalityForHour(d.criticality || 0, hour, mult);
      const w    = edgeWidth(d.road_type, crit);
      edge.data('lineColor',   col);
      edge.data('arrowColor',  col);
      edge.data('edgeW',       w);
      edge.data('currentMult', mult);
      edge.data('dynamicCrit', crit);
    });
    cy.style().update();
  }

  // ── Live network stats ─────────────────────────────────────────
  function getCongestion() {
    if (!cy) return { count:0, avgTime:0, totalCost:0 };
    let congested=0, totalTime=0, totalCost=0, n=0;
    cy.edges().forEach(edge => {
      const d = edge.data();
      const m = d.currentMult || 1;
      if (m >= CONGESTION_THRESHOLD) congested++;
      totalTime += d.base_time * m;
      totalCost += d.total_cost||0;
      n++;
    });
    return { count:congested, avgTime:n?(totalTime/n).toFixed(2):'—', totalCost };
  }

  // ── Cy event bindings ──────────────────────────────────────────
  function _bindEvents() {
    const tooltip = document.getElementById('edge-tooltip');
    const canvas  = document.getElementById('cy');

    function collapseOnMobile() {
      if (window.innerWidth <= 900) {
        const b = document.getElementById('app-body');
        if (b && !b.classList.contains('left-collapsed')) window.togglePanel('left');
        if (b && !b.classList.contains('right-collapsed')) window.togglePanel('right');
      }
    }

    // Edge hover → tooltip
    cy.on('mouseover', 'edge', evt => {
      evt.target.addClass('hovered');
      Tooltip.showEdge(evt.target.data());
      tooltip.classList.add('show');
    });
    cy.on('mouseout', 'edge', evt => {
      evt.target.removeClass('hovered');
      tooltip.classList.remove('show');
    });
    canvas.addEventListener('mousemove', e => {
      tooltip.style.left = (e.clientX+18)+'px';
      tooltip.style.top  = (e.clientY-14)+'px';
    });

    // Edge CLICK → route info popup (if dispatched route) or full modal
    cy.on('tap', 'edge', evt => {
      const d = evt.target.data();
      const routeInfo = Routing.getRouteClickData(evt.target.id());
      if (routeInfo) {
        Modal.showRoute(routeInfo);
        collapseOnMobile();
        return;
      }
      Modal.showEdge(d);
      collapseOnMobile();
    });

    // Node CLICK
    cy.on('tap', 'node', evt => {
      const node = evt.target;
      const d    = node.data();

      if (d.has_incident) {
        // Find matching incident data
        const inc = INCIDENTS.find(i => i.node_id === d.id);
        if (inc) {
          Modal.showIncident(inc, d.id);
          collapseOnMobile();
          return;
        }
      }
      // Non-incident node → modal
      Modal.showNode(node);
      collapseOnMobile();
    });

    // Tap on background → close UI state if needed
    cy.on('tap', evt => {
      collapseOnMobile();
      if (evt.target === cy) {
        UI.closeNodePanel();
        cy.nodes().removeClass('locate-active');
        cy.style().update();
      }
    });
  }

  return {
    init, setHour, getCongestion, reapplyBaseStyles,
    multToColor, getMultiplierForHour,
    get cy() { return cy; },
  };

})();
