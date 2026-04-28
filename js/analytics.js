/* ══════════════════════════════════════════════════════════════
   EMS Analytics Dashboard — analytics.js
   All simulation data from ANALYSIS/ CSVs, hardcoded for zero-server use.
   ══════════════════════════════════════════════════════════════ */

/* ── Raw Simulation Data ─────────────────────────────────────── */
const SIM = {
  results: [
    { id:'INC_006', sev:'critical', pri:1, vehicle:'AMB_03', travel:11.14, f1:15.0331, f2:26.9019, f3:0.0595, pareto:6, highway:false, feeder:true,  call:17.98, depart:17.98, arrive:18.1657 },
    { id:'INC_004', sev:'critical', pri:1, vehicle:'AMB_01', travel:6.26,  f1:10.2035, f2:2.6144,  f3:0.0536, pareto:5, highway:false, feeder:false, call:21.17, depart:21.17, arrive:21.2743 },
    { id:'INC_001', sev:'critical', pri:1, vehicle:'AMB_01', travel:4.38,  f1:7.1322,  f2:3.3907,  f3:0.3438, pareto:1, highway:false, feeder:true,  call:23.2,  depart:23.2,  arrive:23.273  },
    { id:'INC_002', sev:'urgent',   pri:2, vehicle:'AMB_02', travel:4.76,  f1:8.0522,  f2:1.904,   f3:0.0551, pareto:4, highway:false, feeder:false, call:0.13,  depart:0.13,  arrive:0.2093  },
    { id:'INC_012', sev:'urgent',   pri:2, vehicle:'AMB_02', travel:0.0,   f1:0.0,     f2:0.0,     f3:0.0,    pareto:1, highway:false, feeder:false, call:7.77,  depart:7.77,  arrive:7.77    },
    { id:'INC_015', sev:'urgent',   pri:2, vehicle:'AMB_05', travel:3.65,  f1:5.774,   f2:1.3154,  f3:0.0387, pareto:3, highway:false, feeder:false, call:10.62, depart:10.62, arrive:10.6808 },
    { id:'INC_008', sev:'urgent',   pri:2, vehicle:'AMB_03', travel:4.8,   f1:6.1378,  f2:18.2812, f3:0.0149, pareto:1, highway:false, feeder:true,  call:16.12, depart:18.619,arrive:18.699  },
    { id:'INC_007', sev:'urgent',   pri:2, vehicle:'AMB_01', travel:2.96,  f1:4.8177,  f2:1.3658,  f3:0.5565, pareto:3, highway:false, feeder:true,  call:16.42, depart:23.558,arrive:23.6073 },
    { id:'INC_011', sev:'moderate', pri:3, vehicle:'AMB_01', travel:0.8,   f1:1.2628,  f2:0.6843,  f3:0.003,  pareto:1, highway:false, feeder:false, call:6.08,  depart:23.872,arrive:23.8856 },
    { id:'INC_014', sev:'moderate', pri:3, vehicle:'AMB_01', travel:18.0,  f1:30.4769, f2:8.6645,  f3:1.1547, pareto:6, highway:false, feeder:true,  call:7.05,  depart:24.084,arrive:24.3839 },
    { id:'INC_009', sev:'moderate', pri:3, vehicle:'AMB_03', travel:0.0,   f1:0.0,     f2:0.0,     f3:0.0,    pareto:1, highway:false, feeder:false, call:9.37,  depart:18.942,arrive:18.942  },
    { id:'INC_003', sev:'moderate', pri:3, vehicle:'AMB_03', travel:4.12,  f1:6.4865,  f2:4.5332,  f3:0.0089, pareto:1, highway:false, feeder:true,  call:10.8,  depart:19.086,arrive:19.1543 },
    { id:'INC_005', sev:'moderate', pri:3, vehicle:'AMB_02', travel:7.07,  f1:10.1283, f2:7.2356,  f3:0.1071, pareto:3, highway:false, feeder:false, call:17.35, depart:17.35, arrive:17.4678 },
    { id:'INC_013', sev:'moderate', pri:3, vehicle:'AMB_01', travel:0.51,  f1:0.8661,  f2:0.1986,  f3:0.0015, pareto:1, highway:false, feeder:true,  call:18.62, depart:24.614,arrive:24.6224 },
    { id:'INC_010', sev:'minor',    pri:4, vehicle:'AMB_05', travel:0.0,   f1:0.0,     f2:0.0,     f3:0.0,    pareto:1, highway:false, feeder:false, call:11.02, depart:11.02, arrive:11.02   },
  ],
  braess: [
    { id:'INC_006', sev:'critical', f2_phi:26.9019, f2_base:19.3341, feeder:true  },
    { id:'INC_004', sev:'critical', f2_phi:2.6144,  f2_base:2.6144,  feeder:false },
    { id:'INC_001', sev:'critical', f2_phi:3.3907,  f2_base:2.1219,  feeder:true  },
    { id:'INC_008', sev:'urgent',   f2_phi:18.2812, f2_base:11.25,   feeder:true  },
    { id:'INC_007', sev:'urgent',   f2_phi:1.3658,  f2_base:0.9954,  feeder:true  },
    { id:'INC_014', sev:'moderate', f2_phi:8.6645,  f2_base:7.1625,  feeder:true  },
    { id:'INC_003', sev:'moderate', f2_phi:4.5332,  f2_base:3.5666,  feeder:true  },
    { id:'INC_013', sev:'moderate', f2_phi:0.1986,  f2_base:0.1275,  feeder:true  },
  ],
  edgeClass: [
    { cls:'Highway E_H',  tau:2.037, vstar:0.549,  rho:0.115, count:6   },
    { cls:'Feeder E_F',   tau:6.613, vstar:21.764, rho:0.137, count:71  },
    { cls:'Standard E_S', tau:4.281, vstar:5.741,  rho:0.091, count:123 },
  ],
  timeProfiles: [
    { period:'Night',        start:0,  end:6,  normal:1.0, market:1.0  },
    { period:'Morning Peak', start:6,  end:9,  normal:1.5, market:2.3  },
    { period:'Midday',       start:9,  end:15, normal:1.2, market:1.8  },
    { period:'Evening Peak', start:15, end:19, normal:1.6, market:2.5  },
    { period:'Late Evening', start:19, end:24, normal:1.1, market:1.2  },
  ],
};

/* ── Color helpers ───────────────────────────────────────────── */
const SEV_COLOR = {
  critical: '#ff1f40', urgent: '#ff8800', moderate: '#ffcc00', minor: '#33e699'
};
const SEV_DIM = {
  critical: 'rgba(255,31,64,0.18)', urgent: 'rgba(255,136,0,0.18)',
  moderate: 'rgba(255,204,0,0.18)', minor: 'rgba(51,230,153,0.18)'
};

/* ── Chart.js global defaults ────────────────────────────────── */
function setupChartDefaults() {
  Chart.defaults.color = '#4a6c8e';
  Chart.defaults.borderColor = '#182c47';
  Chart.defaults.font.family = '"Share Tech Mono", monospace';
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6,13,21,0.95)';
  Chart.defaults.plugins.tooltip.borderColor = '#244268';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#e0f0ff';
  Chart.defaults.plugins.tooltip.bodyColor = '#8fb8d8';
  Chart.defaults.plugins.tooltip.padding = 10;
}

/* ─────────────────────────────────────────────────────────────
   CHART A — Incident Response Profile (grouped bar)
───────────────────────────────────────────────────────────── */
function buildChartA() {
  const data = SIM.results.filter(r => r.travel > 0);
  const labels = data.map(r => r.id.replace('INC_', '#'));
  const ctx = document.getElementById('chartA').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'f₁ Travel+Cost',
          data: data.map(r => r.f1.toFixed(2)),
          backgroundColor: data.map(r => SEV_DIM[r.sev]),
          borderColor: data.map(r => SEV_COLOR[r.sev]),
          borderWidth: 1.5,
          borderRadius: 3,
        },
        {
          label: 'f₂ Reliability Cost',
          data: data.map(r => r.f2.toFixed(2)),
          backgroundColor: 'rgba(192,128,255,0.15)',
          borderColor: '#c080ff',
          borderWidth: 1.5,
          borderRadius: 3,
        },
        {
          label: 'f₃ Resilience (×10)',
          data: data.map(r => (r.f3 * 10).toFixed(3)),
          backgroundColor: 'rgba(0,224,255,0.12)',
          borderColor: '#00e0ff',
          borderWidth: 1.5,
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            afterBody(items) {
              const i = items[0].dataIndex;
              return [`Severity: ${data[i].sev.toUpperCase()}`, `Vehicle: ${data[i].vehicle}`];
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(24,44,71,0.5)' }, ticks: { color: '#4a6c8e' } },
        y: { grid: { color: 'rgba(24,44,71,0.5)' }, ticks: { color: '#4a6c8e' } },
      },
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART B — Braess Paradox Impact (side-by-side bar)
───────────────────────────────────────────────────────────── */
function buildChartB() {
  const d = SIM.braess.filter(r => r.feeder);
  const labels = d.map(r => r.id.replace('INC_', '#'));
  const ctx = document.getElementById('chartB').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'f₂ Baseline (no φ)',
          data: d.map(r => r.f2_base.toFixed(3)),
          backgroundColor: 'rgba(0,255,170,0.18)',
          borderColor: '#00ffaa',
          borderWidth: 1.5,
          borderRadius: 3,
        },
        {
          label: 'f₂ With Braess φ',
          data: d.map(r => r.f2_phi.toFixed(3)),
          backgroundColor: 'rgba(255,51,85,0.18)',
          borderColor: '#ff3355',
          borderWidth: 1.5,
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            afterBody(items) {
              const i = items[0].dataIndex;
              const inc = d[i];
              const pct = ((inc.f2_phi - inc.f2_base) / inc.f2_base * 100).toFixed(1);
              return [`Φ-Increase: +${pct}%`, `Severity: ${inc.sev.toUpperCase()}`];
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(24,44,71,0.5)' } },
        y: {
          grid: { color: 'rgba(24,44,71,0.5)' },
          title: { display: true, text: 'Reliability Cost f₂', color: '#4a6c8e' }
        }
      },
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART C — Edge Class Radar
───────────────────────────────────────────────────────────── */
function buildChartC() {
  const d = SIM.edgeClass;
  const maxTau   = Math.max(...d.map(r => r.tau));
  const maxVstar = Math.max(...d.map(r => r.vstar));
  const maxRho   = Math.max(...d.map(r => r.rho));
  const norm = r => [r.tau/maxTau, r.vstar/maxVstar, r.rho/maxRho].map(v => +(v*100).toFixed(1));

  const ctx = document.getElementById('chartC').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Mean Travel Time (τ)', 'Reliability Cost (v*)', 'Criticality (ρ)'],
      datasets: [
        { label:'Highway E_H',  data: norm(d[0]), backgroundColor:'rgba(0,224,255,0.12)',  borderColor:'#00e0ff', pointBackgroundColor:'#00e0ff', borderWidth:2, pointRadius:4 },
        { label:'Feeder E_F',   data: norm(d[1]), backgroundColor:'rgba(255,51,85,0.12)',  borderColor:'#ff3355', pointBackgroundColor:'#ff3355', borderWidth:2, pointRadius:4 },
        { label:'Standard E_S', data: norm(d[2]), backgroundColor:'rgba(0,255,170,0.12)',  borderColor:'#00ffaa', pointBackgroundColor:'#00ffaa', borderWidth:2, pointRadius:4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: 'rgba(24,44,71,0.7)' },
          angleLines: { color: 'rgba(24,44,71,0.7)' },
          pointLabels: { color: '#8fb8d8', font: { size: 11 } },
          ticks: { display: false },
        }
      },
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART D — Congestion Timeline (line + annotations)
───────────────────────────────────────────────────────────── */
function buildChartD() {
  // Build hour-by-hour data points from time profiles
  const hours = Array.from({length:25}, (_, i) => i);
  function getMultiplier(h, type) {
    for (const p of SIM.timeProfiles) {
      if (h >= p.start && h < p.end) return type === 'normal' ? p.normal : p.market;
    }
    return 1.0;
  }
  const normalMult = hours.map(h => getMultiplier(h, 'normal'));
  const marketMult = hours.map(h => getMultiplier(h, 'market'));

  const ctx = document.getElementById('chartD').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours.map(h => `${String(h).padStart(2,'0')}:00`),
      datasets: [
        {
          label: 'Normal Road ×',
          data: normalMult,
          borderColor: '#00e0ff',
          backgroundColor: 'rgba(0,224,255,0.06)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
        {
          label: 'Market Road ×',
          data: marketMult,
          borderColor: '#ff8800',
          backgroundColor: 'rgba(255,136,0,0.06)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { grid: { color: 'rgba(24,44,71,0.5)' } },
        y: {
          min: 0.8, max: 2.7,
          grid: { color: 'rgba(24,44,71,0.5)' },
          title: { display: true, text: 'Congestion Multiplier', color: '#4a6c8e' }
        }
      },
    },
    plugins: [{
      id: 'incidentLines',
      afterDraw(chart) {
        const {ctx, chartArea: {top, bottom}, scales: {x}} = chart;
        const incidents = SIM.results.filter(r => r.travel > 0);
        incidents.forEach(inc => {
          const xPx = x.getPixelForValue(Math.round(inc.call));
          ctx.save();
          ctx.strokeStyle = SEV_COLOR[inc.sev] + '80';
          ctx.lineWidth = 1;
          ctx.setLineDash([3,3]);
          ctx.beginPath();
          ctx.moveTo(xPx, top);
          ctx.lineTo(xPx, bottom);
          ctx.stroke();
          ctx.restore();
        });
      }
    }],
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART E — Pareto Front Bubble Chart
───────────────────────────────────────────────────────────── */
function buildChartE() {
  const data = SIM.results.filter(r => r.travel > 0);
  const datasets = ['critical','urgent','moderate'].map(sev => ({
    label: sev.charAt(0).toUpperCase() + sev.slice(1),
    data: data.filter(r => r.sev === sev).map(r => ({
      x: +r.f1.toFixed(2),
      y: +r.f2.toFixed(2),
      r: Math.max(5, r.pareto * 4),
    })),
    backgroundColor: SEV_DIM[sev],
    borderColor: SEV_COLOR[sev],
    borderWidth: 1.5,
  }));

  const ctx = document.getElementById('chartE').getContext('2d');
  new Chart(ctx, {
    type: 'bubble',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label(item) {
              const d = item.raw;
              return [`f₁=${d.x}`, `f₂=${d.y}`, `Pareto size=${Math.round(d.r/4)}`];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display:true, text:'f₁ Travel+Cost', color:'#4a6c8e' },
          grid: { color:'rgba(24,44,71,0.5)' },
        },
        y: {
          title: { display:true, text:'f₂ Reliability Cost', color:'#4a6c8e' },
          grid: { color:'rgba(24,44,71,0.5)' },
        }
      },
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   CHART F — Multi-Objective Scatter (f1 vs f2, size=f3)
───────────────────────────────────────────────────────────── */
function buildChartF() {
  const data = SIM.results.filter(r => r.travel > 0);
  const feederData   = data.filter(r => r.feeder);
  const standardData = data.filter(r => !r.feeder);

  const toPoint = r => ({ x: +r.f1.toFixed(2), y: +r.f2.toFixed(2), r: Math.max(4, r.f3 * 12) });

  const ctx = document.getElementById('chartF').getContext('2d');
  new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Feeder route (φ > 0)',
          data: feederData.map(toPoint),
          backgroundColor: 'rgba(255,51,85,0.2)',
          borderColor: '#ff3355',
          borderWidth: 1.5,
        },
        {
          label: 'Standard route (φ = 0)',
          data: standardData.map(toPoint),
          backgroundColor: 'rgba(0,224,255,0.15)',
          borderColor: '#00e0ff',
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label(item) {
              return [`f₁=${item.raw.x}`, `f₂=${item.raw.y}`, `f₃≈${(item.raw.r/12).toFixed(3)}`];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display:true, text:'f₁ Travel+Cost', color:'#4a6c8e' },
          grid: { color:'rgba(24,44,71,0.5)' }
        },
        y: {
          title: { display:true, text:'f₂ Reliability Cost', color:'#4a6c8e' },
          grid: { color:'rgba(24,44,71,0.5)' }
        }
      },
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   GANTT — Vehicle Dispatch Timeline
───────────────────────────────────────────────────────────── */
function buildGantt() {
  const vehicles = ['AMB_01','AMB_02','AMB_03','AMB_04','AMB_05'];
  const TMIN = 0, TMAX = 25;
  const container = document.getElementById('gantt-container');

  const axisRow = document.createElement('div');
  axisRow.className = 'gantt-axis';
  const spacer = document.createElement('div');
  spacer.className = 'gantt-axis-spacer';
  axisRow.appendChild(spacer);
  const ticks = document.createElement('div');
  ticks.className = 'gantt-axis-ticks';
  [0,4,8,12,16,20,24].forEach(h => {
    const t = document.createElement('span');
    t.textContent = `${String(h).padStart(2,'0')}:00`;
    ticks.appendChild(t);
  });
  axisRow.appendChild(ticks);
  container.appendChild(axisRow);

  vehicles.forEach(veh => {
    const dispatches = SIM.results.filter(r => r.vehicle === veh && r.travel > 0);
    const row = document.createElement('div');
    row.className = 'gantt-row';

    const lbl = document.createElement('div');
    lbl.className = 'gantt-label';
    lbl.textContent = veh;
    row.appendChild(lbl);

    const track = document.createElement('div');
    track.className = 'gantt-track';

    dispatches.forEach(inc => {
      const dep  = inc.depart % 24;
      const arr  = inc.arrive % 24;
      const dur  = inc.travel;
      const left = (dep / TMAX) * 100;
      const width = Math.max(0.8, (dur / 60 / TMAX) * 100);

      const bar = document.createElement('div');
      bar.className = `gantt-bar ${inc.sev}`;
      bar.style.left  = `${left}%`;
      bar.style.width = `${width}%`;
      bar.title       = `${inc.id} | ${inc.sev.toUpperCase()} | ${inc.travel} min | Depart ${dep.toFixed(2)}h`;
      bar.textContent = inc.id.replace('INC_','#');
      track.appendChild(bar);
    });

    if (dispatches.length === 0) {
      const idle = document.createElement('div');
      idle.style.cssText = 'height:100%;display:flex;align-items:center;padding:0 10px;font-size:0.6rem;color:#4a6c8e;letter-spacing:1px;';
      idle.textContent = 'NOT DISPATCHED';
      track.appendChild(idle);
    }

    row.appendChild(track);
    container.appendChild(row);
  });
}

/* ─────────────────────────────────────────────────────────────
   Scroll-reveal observer
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.an-section').forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────────────────────
   Animated KPI counters
───────────────────────────────────────────────────────────── */
function animateCounter(el, target, decimals = 0, suffix = '') {
  const duration = 1400;
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + (target - from) * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initKPICounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el   = e.target;
      const val  = parseFloat(el.dataset.val);
      const dec  = parseInt(el.dataset.dec || '0');
      const suf  = el.dataset.suf || '';
      animateCounter(el, val, dec, suf);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-val]').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   PRESENTATION ENGINE
═══════════════════════════════════════════════════════════════ */
const Presentation = (() => {
  let current = 0;
  let autoTimer = null;
  let progressRaf = null;
  let progStart = null;
  let presCharts = [];
  const SPEEDS = [1, 2, 3, 5, 10, 20, 30, 45];
  let speedIdx = 2; // default 5s

  /* ── Slide definitions ─────────────────────────────────── */
  const SLIDES = [
    { type: 'title' },
    {
      label: 'Section A', title: 'Incident Response Profile',
      badge: 'Multi-Objective', badgeColor: 'cyan',
      desc: `MOLS algorithm minimises three objectives: <strong>f₁</strong> (Travel time + Cost), <strong>f₂</strong> (Reliability cost), and <strong>f₃</strong> (Resilience score).<br><br>INC_006 shows highest f₂ (feeder + evening peak), while INC_014 peaks on f₁ (longest route).`,
      formula: 'f₁ = Σ[τᵢⱼ(t)+λ·cᵢⱼ]  f₂ = Σvᵢⱼ(t)  f₃ = β·Σρᵢⱼ',
      buildChart(canvas) { return makeBarA(canvas); }
    },
    {
      label: 'Section B', title: 'Braess Paradox — Highway Upgrade Impact',
      badge: "Braess's Paradox", badgeColor: 'red',
      desc: `Upgrading 6 trunk edges to highway created a paradox: 71 feeder edges now carry high structural vulnerability.<br><br><strong>INC_006</strong> suffered the worst absolute impact, while <strong>INC_001</strong> saw a +59.8% relative increase in reliability cost.`,
      formula: 'v*ᵢⱼ(t) = τᵢⱼ·(τᵢⱼ/τ°ᵢⱼ)²·γᵢⱼ·(1+φᵢⱼ)',
      buildChart(canvas) { return makeBarB(canvas); }
    },
    {
      label: 'Section C', title: 'Edge Class Performance — Radar',
      badge: 'Network Topology', badgeColor: 'amber',
      desc: `Comparison of three edge classes:<br><br><strong>Highway (6)</strong>: fastest travel, lowest reliability cost.<br><strong>Feeder (71)</strong>: dramatically high reliability cost from Braess vulnerability.<br><strong>Standard (123)</strong>: safest routing backbone.`,
      formula: 'max(τ)=6.61  max(v*)=21.76  max(ρ)=0.137',
      buildChart(canvas) { return makeRadarC(canvas); }
    },
    {
      label: 'Section D', title: 'Congestion Timeline & Incident Distribution',
      badge: 'Time-Dependent', badgeColor: 'cyan',
      desc: `Market roads experience up to 2.5× baseline travel time during the evening peak (15:00–19:00).<br><br>Most critical incidents struck at night, except <strong>INC_006</strong>, which hit during peak congestion, resulting in the highest reliability cost.`,
      formula: 'Night×1.0 · MornPeak×1.5/2.3 · Midday×1.2/1.8 · EvePeak×1.6/2.5',
      buildChart(canvas) { return makeLineD(canvas); }
    },
    {
      label: 'Section E', title: 'Vehicle Dispatch Timeline — Fleet Utilisation',
      badge: 'Fleet Analysis', badgeColor: 'green',
      desc: `Uneven fleet utilisation due to strict priority dispatch:<br><br><strong>AMB_01</strong> handled 5 dispatches, while <strong>AMB_04</strong> remained idle.<br><strong>INC_008</strong> experienced a 2.5-hour delay waiting for an available ambulance.`,
      formula: 'AMB_01: 5 · AMB_02: 3 · AMB_03: 3 · AMB_04: 0 · AMB_05: 2',
      buildChart(canvas) { return makeGanttSlide(canvas); }
    },
    {
      label: 'Section F', title: 'Pareto Front Size — Solution Space Richness',
      badge: 'Pareto Optimality', badgeColor: 'purple',
      desc: `Bubble size represents the number of Pareto-optimal routes found.<br><br><strong>Size 1</strong> indicates simple, rigid O-D routes.<br><strong>Size 6</strong> (INC_006, INC_014) shows high routing flexibility where dispatch policies matter most.`,
      formula: 'Avg Pareto size: 2.7 · Max: 6 · Min: 1',
      buildChart(canvas) { return makeBubbleE(canvas); }
    },
    {
      label: 'Section G', title: 'Multi-Objective Cost Surface — Pareto Frontier',
      badge: 'Objective Space', badgeColor: 'cyan',
      desc: `The Pareto frontier reveals trade-offs: no single route minimizes all three objectives.<br><br>Feeder routes (red) cluster high in reliability cost, while optimal standard routes approach the bottom-left corner. Point size reflects resilience score.`,
      formula: 'Minimise {f₁, f₂, f₃} s.t. P∈G(V,E), vehicle availability, τᵢⱼ(t)',
      buildChart(canvas) { return makeScatterF(canvas); }
    },
  ];

  /* ── Chart builders for presentation (return Chart instance) ── */
  function chartOpts(extra = {}) {
    return {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 600 },
      plugins: { legend: { position: 'top', labels: { boxWidth: 10, padding: 12 } } },
      ...extra,
    };
  }
  const scaleOpts = { grid: { color: 'rgba(24,44,71,0.5)' }, ticks: { color: '#4a6c8e' } };

  function makeBarA(canvas) {
    const data = SIM.results.filter(r => r.travel > 0);
    return new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: data.map(r => r.id.replace('INC_', '#')),
        datasets: [
          { label: 'f₁ Travel+Cost', data: data.map(r => r.f1.toFixed(2)), backgroundColor: data.map(r => SEV_DIM[r.sev]), borderColor: data.map(r => SEV_COLOR[r.sev]), borderWidth: 1.5, borderRadius: 3 },
          { label: 'f₂ Reliability', data: data.map(r => r.f2.toFixed(2)), backgroundColor: 'rgba(192,128,255,0.15)', borderColor: '#c080ff', borderWidth: 1.5, borderRadius: 3 },
          { label: 'f₃ Resilience×10', data: data.map(r => (r.f3 * 10).toFixed(3)), backgroundColor: 'rgba(0,224,255,0.12)', borderColor: '#00e0ff', borderWidth: 1.5, borderRadius: 3 },
        ],
      },
      options: chartOpts({ scales: { x: scaleOpts, y: scaleOpts } }),
    });
  }

  function makeBarB(canvas) {
    const d = SIM.braess.filter(r => r.feeder);
    return new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: d.map(r => r.id.replace('INC_', '#')),
        datasets: [
          { label: 'f₂ Baseline (no φ)', data: d.map(r => r.f2_base.toFixed(3)), backgroundColor: 'rgba(0,255,170,0.18)', borderColor: '#00ffaa', borderWidth: 1.5, borderRadius: 3 },
          { label: 'f₂ With φ', data: d.map(r => r.f2_phi.toFixed(3)), backgroundColor: 'rgba(255,51,85,0.18)', borderColor: '#ff3355', borderWidth: 1.5, borderRadius: 3 },
        ],
      },
      options: chartOpts({ scales: { x: scaleOpts, y: { ...scaleOpts, title: { display: true, text: 'Reliability Cost f₂', color: '#4a6c8e' } } } }),
    });
  }

  function makeRadarC(canvas) {
    const d = SIM.edgeClass;
    const maxT = Math.max(...d.map(r => r.tau)), maxV = Math.max(...d.map(r => r.vstar)), maxR = Math.max(...d.map(r => r.rho));
    const n = r => [+(r.tau/maxT*100).toFixed(1), +(r.vstar/maxV*100).toFixed(1), +(r.rho/maxR*100).toFixed(1)];
    return new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: ['Travel Time (τ)', 'Reliability Cost (v*)', 'Criticality (ρ)'],
        datasets: [
          { label: 'Highway E_H', data: n(d[0]), backgroundColor: 'rgba(0,224,255,0.12)', borderColor: '#00e0ff', borderWidth: 2, pointRadius: 4 },
          { label: 'Feeder E_F',  data: n(d[1]), backgroundColor: 'rgba(255,51,85,0.12)',  borderColor: '#ff3355', borderWidth: 2, pointRadius: 4 },
          { label: 'Standard E_S',data: n(d[2]), backgroundColor: 'rgba(0,255,170,0.12)', borderColor: '#00ffaa', borderWidth: 2, pointRadius: 4 },
        ],
      },
      options: chartOpts({ scales: { r: { min: 0, max: 100, grid: { color: 'rgba(24,44,71,0.7)' }, angleLines: { color: 'rgba(24,44,71,0.7)' }, pointLabels: { color: '#8fb8d8', font: { size: 11 } }, ticks: { display: false } } } }),
    });
  }

  function makeLineD(canvas) {
    const hours = Array.from({ length: 25 }, (_, i) => i);
    function getM(h, t) {
      for (const p of SIM.timeProfiles) if (h >= p.start && h < p.end) return t === 'n' ? p.normal : p.market;
      return 1;
    }
    const incLinePl = [{
      id: 'ilines', afterDraw(ch) {
        const { ctx, chartArea: { top, bottom }, scales: { x } } = ch;
        SIM.results.filter(r => r.travel > 0).forEach(inc => {
          const xp = x.getPixelForValue(Math.round(inc.call));
          ctx.save(); ctx.strokeStyle = SEV_COLOR[inc.sev] + '70'; ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(xp, top); ctx.lineTo(xp, bottom); ctx.stroke(); ctx.restore();
        });
      }
    }];
    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: hours.map(h => `${String(h).padStart(2, '0')}:00`),
        datasets: [
          { label: 'Normal Road ×', data: hours.map(h => getM(h, 'n')), borderColor: '#00e0ff', backgroundColor: 'rgba(0,224,255,0.06)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 3 },
          { label: 'Market Road ×', data: hours.map(h => getM(h, 'm')), borderColor: '#ff8800', backgroundColor: 'rgba(255,136,0,0.06)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 3 },
        ],
      },
      options: chartOpts({ plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }, scales: { x: scaleOpts, y: { ...scaleOpts, min: 0.8, max: 2.7 } } }),
      plugins: incLinePl,
    });
  }

  function makeGanttSlide(canvas) {
    // Render into the canvas as a bar chart (horizontal)
    const vehicles = ['AMB_01', 'AMB_02', 'AMB_03', 'AMB_04', 'AMB_05'];
    const colors = { critical: '#ff1f40', urgent: '#ff8800', moderate: '#ffcc00', minor: '#33e699' };
    const datasets = [];
    SIM.results.filter(r => r.travel > 0).forEach(inc => {
      const dep = inc.depart % 24;
      datasets.push({
        label: inc.id, data: vehicles.map(v => v === inc.vehicle ? [dep, dep + inc.travel / 60] : null),
        backgroundColor: colors[inc.sev] + 'cc', borderColor: colors[inc.sev], borderWidth: 1, borderRadius: 3,
      });
    });
    return new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: { labels: vehicles, datasets },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: { legend: { display: false }, tooltip: { callbacks: { title: i => i[0].dataset.label, label: i => `Depart ${i.raw[0].toFixed(2)}h · Duration ${((i.raw[1]-i.raw[0])*60).toFixed(1)} min` } } },
        scales: {
          x: { ...scaleOpts, min: 0, max: 25, title: { display: true, text: 'Hour of Day', color: '#4a6c8e' } },
          y: scaleOpts,
        },
      },
    });
  }

  function makeBubbleE(canvas) {
    const data = SIM.results.filter(r => r.travel > 0);
    const ds = ['critical', 'urgent', 'moderate'].map(sev => ({
      label: sev.charAt(0).toUpperCase() + sev.slice(1),
      data: data.filter(r => r.sev === sev).map(r => ({ x: +r.f1.toFixed(2), y: +r.f2.toFixed(2), r: Math.max(5, r.pareto * 4) })),
      backgroundColor: SEV_DIM[sev], borderColor: SEV_COLOR[sev], borderWidth: 1.5,
    }));
    return new Chart(canvas.getContext('2d'), {
      type: 'bubble', data: { datasets: ds },
      options: chartOpts({ scales: { x: { ...scaleOpts, title: { display: true, text: 'f₁ Travel+Cost', color: '#4a6c8e' } }, y: { ...scaleOpts, title: { display: true, text: 'f₂ Reliability Cost', color: '#4a6c8e' } } } }),
    });
  }

  function makeScatterF(canvas) {
    const data = SIM.results.filter(r => r.travel > 0);
    const tp = r => ({ x: +r.f1.toFixed(2), y: +r.f2.toFixed(2), r: Math.max(4, r.f3 * 12) });
    return new Chart(canvas.getContext('2d'), {
      type: 'bubble',
      data: {
        datasets: [
          { label: 'Feeder route (φ>0)', data: data.filter(r => r.feeder).map(tp), backgroundColor: 'rgba(255,51,85,0.2)', borderColor: '#ff3355', borderWidth: 1.5 },
          { label: 'Standard (φ=0)',    data: data.filter(r => !r.feeder).map(tp), backgroundColor: 'rgba(0,224,255,0.15)', borderColor: '#00e0ff', borderWidth: 1.5 },
        ],
      },
      options: chartOpts({ scales: { x: { ...scaleOpts, title: { display: true, text: 'f₁', color: '#4a6c8e' } }, y: { ...scaleOpts, title: { display: true, text: 'f₂', color: '#4a6c8e' } } } }),
    });
  }

  /* ── Build slide DOM ──────────────────────────────────────── */
  function buildSlides() {
    const stage = document.getElementById('pres-stage');
    stage.innerHTML = '';
    const dots = document.getElementById('pres-dots');
    dots.innerHTML = '';

    SLIDES.forEach((s, i) => {
      const slide = document.createElement('div');
      slide.className = 'pres-slide' + (s.type === 'title' ? ' title-slide' : '');
      slide.id = `slide-${i}`;

      if (s.type === 'title') {
        slide.innerHTML = `
          <div class="pres-title-glow"></div>
          <div class="pres-title-kicker">University of Malawi · Mathematical Sciences · BSC/MAT/14/21</div>
          <div class="pres-title-main">Simultaneous Routing of Emergency Vehicles in Poorly Developed &amp; Congested Urban Networks</div>
          <div class="pres-title-sub">// Zomba, Malawi · Simulation Results &amp; Deep Analytics</div>
          <div class="pres-title-kpis">
            <div class="pres-kpi"><div class="pres-kpi-val">15</div><div class="pres-kpi-label">Incidents</div></div>
            <div class="pres-kpi"><div class="pres-kpi-val">5</div><div class="pres-kpi-label">Ambulances</div></div>
            <div class="pres-kpi"><div class="pres-kpi-val">200</div><div class="pres-kpi-label">Network Edges</div></div>
            <div class="pres-kpi"><div class="pres-kpi-val">40</div><div class="pres-kpi-label">Nodes</div></div>
            <div class="pres-kpi"><div class="pres-kpi-val" style="color:#ff3355;text-shadow:0 0 20px rgba(255,51,85,0.4);">39.2%</div><div class="pres-kpi-label">Braess Impact</div></div>
          </div>`;
      } else {
        const canvasId = `pres-canvas-${i}`;
        slide.innerHTML = `
          <div class="pres-slide-header">
            <div class="pres-slide-label">${s.label}</div>
            <div class="pres-slide-title">${s.title}</div>
          </div>
          <div class="pres-slide-body">
            <div class="pres-chart-area">
              <div class="pres-chart-inner"><canvas id="${canvasId}"></canvas></div>
            </div>
            <div class="pres-desc-area">
              <div class="an-desc-badge ${s.badgeColor}">${s.badge}</div>
              <div class="an-desc-body">${s.desc}</div>
              <div class="an-formula" style="margin-top:auto;">${s.formula}</div>
            </div>
          </div>`;
      }

      stage.appendChild(slide);

      // Dot
      const dot = document.createElement('div');
      dot.className = 'pres-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goTo(i);
      dot.title = s.type === 'title' ? 'Title' : s.title;
      dots.appendChild(dot);
    });
  }

  function renderSlideChart(idx) {
    const s = SLIDES[idx];
    if (!s || s.type === 'title') return;
    const canvas = document.getElementById(`pres-canvas-${idx}`);
    if (!canvas || canvas._presChart) return;
    const chart = s.buildChart(canvas);
    canvas._presChart = chart;
    presCharts.push(chart);
  }

  /* ── Navigation ───────────────────────────────────────────── */
  function goTo(idx, direction = 1) {
    if (idx < 0 || idx >= SLIDES.length) return;
    const stage = document.getElementById('pres-stage');
    const oldSlide = stage.querySelector('.pres-slide.active');
    if (oldSlide) {
      oldSlide.classList.remove('active');
      oldSlide.classList.add('exit-left');
      setTimeout(() => oldSlide.classList.remove('exit-left'), 400);
    }
    current = idx;
    const newSlide = document.getElementById(`slide-${current}`);
    if (newSlide) {
      newSlide.style.transform = `translateX(${direction > 0 ? '80px' : '-80px'})`;
      requestAnimationFrame(() => {
        newSlide.style.transform = '';
        newSlide.classList.add('active');
      });
    }
    renderSlideChart(current);
    // Update counter + dots
    document.getElementById('pres-counter').textContent = `${current + 1} / ${SLIDES.length}`;
    document.querySelectorAll('.pres-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    document.getElementById('pres-prev').disabled = current === 0;
    document.getElementById('pres-next').disabled = current === SLIDES.length - 1;
    // Restart progress if autoplaying
    if (autoTimer) resetProgress();
  }

  function next() { if (current < SLIDES.length - 1) goTo(current + 1, 1); else if (autoTimer) goTo(0, 1); }
  function prev() { goTo(current - 1, -1); }

  /* ── Auto-play ────────────────────────────────────────────── */
  function resetProgress() {
    cancelAnimationFrame(progressRaf);
    const bar = document.getElementById('pres-progress-bar');
    const dur = SPEEDS[speedIdx] * 1000;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    progStart = performance.now();
    function tick(now) {
      const pct = Math.min(((now - progStart) / dur) * 100, 100);
      bar.style.transition = 'none';
      bar.style.width = pct + '%';
      if (pct < 100) progressRaf = requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function startAutoplay() {
    stopAutoplay();
    const btn = document.getElementById('pres-autoplay-btn');
    const icon = document.getElementById('pres-autoplay-icon');
    btn.classList.add('playing');
    icon.className = 'fa-solid fa-pause';
    document.getElementById('pres-progress-wrap').style.display = 'block';
    resetProgress();
    autoTimer = setInterval(() => next(), SPEEDS[speedIdx] * 1000);
  }

  function stopAutoplay() {
    clearInterval(autoTimer);
    cancelAnimationFrame(progressRaf);
    autoTimer = null;
    const btn = document.getElementById('pres-autoplay-btn');
    const icon = document.getElementById('pres-autoplay-icon');
    btn.classList.remove('playing');
    icon.className = 'fa-solid fa-play';
    document.getElementById('pres-progress-wrap').style.display = 'none';
  }

  function toggleAutoplay() { autoTimer ? stopAutoplay() : startAutoplay(); }

  function cycleSpeed() {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    document.getElementById('speed-label').textContent = SPEEDS[speedIdx] + 's';
    if (autoTimer) { stopAutoplay(); startAutoplay(); }
  }

  /* ── Fullscreen ───────────────────────────────────────────── */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('an-fs-icon');
    if (icon) icon.className = document.fullscreenElement ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
  });

  /* ── Enter / Exit ─────────────────────────────────────────── */
  function enter() {
    buildSlides();
    presCharts = [];
    current = 0;
    const overlay = document.getElementById('pres-overlay');
    overlay.style.display = 'flex';
    goTo(0);
    document.documentElement.requestFullscreen().catch(() => {});
    document.addEventListener('keydown', onKey);
  }

  function exit() {
    stopAutoplay();
    presCharts.forEach(c => c.destroy());
    presCharts = [];
    document.getElementById('pres-overlay').style.display = 'none';
    if (document.fullscreenElement) document.exitFullscreen();
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'Escape')     exit();
    if (e.key === 'p' || e.key === 'P') toggleAutoplay();
  }

  /* ── Global keyboard shortcut (outside presentation) ─────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'p' && !document.getElementById('pres-overlay').style.display.includes('flex')) {
      if (!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) enter();
    }
    if (e.key === 'f' && !document.getElementById('pres-overlay').style.display.includes('flex')) {
      if (!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) toggleFullscreen();
    }
  });

  return { enter, exit, next, prev, toggleAutoplay, cycleSpeed, toggleFullscreen };
})();

/* ─────────────────────────────────────────────────────────────
   Boot
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupChartDefaults();
  buildChartA();
  buildChartB();
  buildChartC();
  buildChartD();
  buildChartE();
  buildChartF();
  buildGantt();
  initScrollReveal();
  initKPICounters();
});

