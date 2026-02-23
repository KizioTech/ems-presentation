window.Tour = (() => {
  let driverObj = null;

  function init() {
    if (!window.driver) return;
    
    const driver = window.driver.js.driver;

    driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Finish',
      nextBtnText: 'Next',
      prevBtnText: 'Prev',
      steps: [
        {
          popover: {
            title: 'Welcome to MODEL EMS Simulator',
            description: 'This is a multi-incident response simulator. Let us take a quick tour to help you understand the interface.'
          }
        },
        {
          element: '#graph-area',
          popover: {
            title: 'Interactive City Map',
            description: 'This is your operational theater. Use your mouse to <b>pan</b> and <b>scroll to zoom</b>. The graph represents the city network: dots are locations (Nodes) and lines are roads (Edges).',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#graph-area',
          popover: {
            title: 'Edge & Node Analysis',
            description: '<b>Click any node or road</b> to open high-fidelity analytics. You can see real-time performance metrics, travel times, and criticality scores for every element in the network.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#left-panel',
          popover: {
            title: 'Incident Queue',
            description: 'Here you can see the list of active incidents. You can filter them by severity and choose to dispatch them individually or add them to the queue for a batch dispatch.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '.policy-block',
          popover: {
            title: 'Routing Policy',
            description: 'Select how dispatch routes should be optimized: by Time, Cost, Reliability, or a Pareto trade-off combination.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#route-legend',
          popover: {
            title: 'Optimal Route Visualization',
            description: 'When dispatches are active, the optimal paths are drawn on the map. This legend shows active missions and their performance scores across different objectives.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#time-bar',
          popover: {
            title: 'Time & Traffic Simulator',
            description: 'Use this slider to simulate different times of the day. This dynamically affects traffic congestion multipliers and road travel times.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#resilience-toggle',
          popover: {
            title: 'Resilience Analysis',
            description: 'Toggle this to test network vulnerabilities. You can simulate blocked roads by clicking on them based on their criticality.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#highlighter-toggle',
          popover: {
            title: 'Node Highlighter',
            description: 'Easily highlight Dispatch Centres, Markets, Intersections, or active Incidents on the graph map.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#right-panel',
          popover: {
            title: 'Network & Dispatch status',
            description: 'View the map legend, live traffic stats, real-time dispatch logs, and available vehicles.',
            side: 'left',
            align: 'start'
          }
        }
      ]
    });

    // Check if tour has been shown
    if (!localStorage.getItem('ems_tour_seen')) {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }

  function start() {
    if (driverObj) {
      if (window.innerWidth <= 900) {
        // Expand panels in mobile to show elements correctly during the tour
        const body = document.getElementById('app-body');
        if (body.classList.contains('left-collapsed')) window.togglePanel('left');
        if (body.classList.contains('right-collapsed')) window.togglePanel('right');
      }
      driverObj.drive();
      localStorage.setItem('ems_tour_seen', 'true');
    }
  }

  return { init, start };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Try to initialize on load
  setTimeout(() => {
    Tour.init();
  }, 500); // Give cytoscape and UI time to render first
});
