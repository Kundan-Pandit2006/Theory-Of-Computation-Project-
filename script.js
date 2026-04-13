// ─── ROUTING LOGIC ───
function handleRouting() {
  const navLinks = document.querySelectorAll('.nav-link');
  const ctaButtons = document.querySelectorAll('[href="/demonstration"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPath = link.getAttribute('href');
      if (targetPath === '/') {
        showMainView('home-view');
        updateActiveNav('/');
      } else if (targetPath === '/demonstration') {
        showMainView('demonstration-view');
        updateActiveNav('/demonstration');
      }
    });
  });

  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showMainView('demonstration-view');
      updateActiveNav('/demonstration');
    });
  });
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
}

function showMainView(id) {
  // Only toggle top-level views (Home vs Simulator)
  const homeView = $('home-view');
  const demoView = $('demonstration-view');
  if (homeView) homeView.classList.remove('active');
  if (demoView) demoView.classList.remove('active');
  $(id).classList.add('active');
}

function showSimSubView(id) {
  // Toggle sub-views inside the simulator (Setup vs Run)
  const setupView = $('setup-view');
  const runView = $('run-view');
  if (setupView) setupView.classList.remove('active');
  if (runView) runView.classList.remove('active');
  $(id).classList.add('active');
}

// ─── THEME TOGGLE ───
(function () {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark-mode');
    themeToggle.classList.add('active');
  }

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark-mode');
    themeToggle.classList.toggle('active');

    // Save preference
    const isDark = htmlElement.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Optional: Listen for system preference changes
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDark.addEventListener('change', (e) => {
    if (e.matches) {
      htmlElement.classList.add('dark-mode');
      themeToggle.classList.add('active');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark-mode');
      themeToggle.classList.remove('active');
      localStorage.setItem('theme', 'light');
    }
  });
})();

// ─── MERMAID INIT ───
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  flowchart: {
    htmlLabels: true, // Required for <br/> in labels
    curve: 'basis',
    nodeSpacing: 100,
    rankSpacing: 160
  },
  themeVariables: {
    primaryColor: '#f0e9de',
    lineColor: '#9c7355',
    fontSize: '14px',
    fontFamily: "'Space Mono', monospace"
  }
});

// ─── PRESETS ───
const PRESETS = {
  increment: {
    tape: '1011',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, q1\nq1, 0, 1, L, qStop\nq1, 1, 0, L, q1\nq1, _, 1, L, qStop`
  },
  decrement: {
    tape: '1100',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, q1\nq1, 1, 0, L, qStop\nq1, 0, 1, L, q1\nq1, _, _, R, qStop`
  },
  onesComp: {
    tape: '101100',
    rules: `q0, 0, 1, R, q0\nq0, 1, 0, R, q0\nq0, _, _, L, qStop`
  },
  twosComp: {
    tape: '10100',
    rules: `q0, 0, 0, R, q0\nq0, 1, 1, R, q0\nq0, _, _, L, q1\nq1, 0, 0, L, q1\nq1, 1, 1, L, q2\nq1, _, _, R, qStop\nq2, 0, 1, L, q2\nq2, 1, 0, L, q2\nq2, _, _, R, qStop`
  },
  // Palindrome check — dual-marker approach (X=left-consumed, Y=right-consumed)
  // q0 : scan right over X/Y to find next unprocessed char (blank → accept)
  // q1 : started with '0'; scan right (skip unprocessed + Y) to hit blank, then back to q2
  // q2 : rightmost pos — need '0'; mark Y, scan left back to q0 via q5
  //       if only Y's left → hit X → accept (middle char consumed itself)
  // q3 : started with '1'; scan right to hit blank, back to q4
  // q4 : rightmost pos — need '1'; mark Y; hit X → accept
  // q5 : scan left over 0/1/X/Y until blank, then R → q0
  palindrome: {
    tape: '1001',
    rules: `q0, 0, X, R, q1
q0, 1, X, R, q3
q0, X, X, R, q0
q0, Y, Y, R, q0
q0, _, _, R, qAccept
q1, 0, 0, R, q1
q1, 1, 1, R, q1
q1, Y, Y, R, q1
q1, _, _, L, q2
q2, 0, Y, L, q5
q2, 1, 1, L, qReject
q2, Y, Y, L, q2
q2, X, X, R, qAccept
q3, 0, 0, R, q3
q3, 1, 1, R, q3
q3, Y, Y, R, q3
q3, _, _, L, q4
q4, 1, Y, L, q5
q4, 0, 0, L, qReject
q4, Y, Y, L, q4
q4, X, X, R, qAccept
q5, 0, 0, L, q5
q5, 1, 1, L, q5
q5, Y, Y, L, q5
q5, X, X, L, q5
q5, _, _, R, q0`
  },
  unaryAdd: {
    tape: '111+1111',
    rules: `q0, 1, 1, R, q0\nq0, +, 1, R, q1\nq1, 1, 1, R, q1\nq1, _, _, L, q2\nq2, 1, _, L, qStop`
  },
  // a^n b^n acceptor — marks a with X and matches with b
  anbn: {
    tape: 'aaabbb',
    rules: `q0, a, X, R, q1\nq0, Y, Y, R, q3\nq0, _, _, R, qAccept\nq1, a, a, R, q1\nq1, Y, Y, R, q1\nq1, b, Y, L, q2\nq1, _, _, R, qReject\nq2, a, a, L, q2\nq2, Y, Y, L, q2\nq2, X, X, R, q0\nq3, Y, Y, R, q3\nq3, _, _, R, qAccept\nq3, b, b, R, qReject`
  },
  // Divisible by 3 — unary representation, counts mod 3
  // Input: unary number (e.g. 111111 for 6)  accept if divisible by 3
  divBy3: {
    tape: '111111',
    rules: `q0, 1, 1, R, q1\nq0, _, _, R, qAccept\nq1, 1, 1, R, q2\nq1, _, _, R, qReject\nq2, 1, 1, R, q0\nq2, _, _, R, qAccept`
  }
};

// ─── STATE ───
const machine = {
  tape: [], head: 0, state: 'q0', prevState: null,
  steps: 0, rules: {}, isRunning: false, interval: null,
  history: [],
  stateTrace: [],
  discoveredStates: new Set(),
  discoveredEdges: new Set()
};

// ─── DOM REFS (will be initialized after DOM loads) ───
let el = {};

// ─── HELPER ───
const $ = id => document.getElementById(id);

// ─── RESULT BANNER ───
function showResultBanner(finalState, steps) {
  const stateL = finalState.toLowerCase();
  const isAccept = stateL.includes('accept');
  const isReject = stateL.includes('reject');
  // Get the tape content (trimmed of leading/trailing blanks)
  const tapeStr = machine.tape.join('').replace(/^_+|_+$/g, '') || '(empty)';

  let type, icon, title, subtitle;
  if (isAccept) {
    type = 'accepted'; icon = '✓';
    title = 'INPUT ACCEPTED';
    subtitle = `The machine accepted the input string in state <strong>${finalState}</strong>.`;
  } else if (isReject) {
    type = 'rejected'; icon = '✗';
    title = 'INPUT REJECTED';
    subtitle = `The machine rejected the input string in state <strong>${finalState}</strong>.`;
  } else {
    type = 'stopped'; icon = '⏹';
    title = 'MACHINE HALTED';
    subtitle = `Computation complete. Halted in state <strong>${finalState}</strong>.`;
  }

  el.resultBanner.className = `result-banner visible ${type}`;
  el.resultIcon.textContent = icon;
  el.resultTitle.textContent = title;
  el.resultSubtitle.innerHTML = subtitle;
  el.resultTape.innerHTML = `<strong>Final tape:</strong> ${tapeStr}`;
  el.resultSteps.textContent = `${steps} step${steps !== 1 ? 's' : ''}`;
}

function hideResultBanner() {
  el.resultBanner.className = 'result-banner';
}

// ─── INITIALIZE DOM REFS & EVENT LISTENERS ───
document.addEventListener('DOMContentLoaded', function () {
  // Setup routing first
  handleRouting();

  // Initialize all DOM refs
  el = {
    setupView: $('setup-view'), runView: $('run-view'),
    tapeSrc: $('initial-tape'), rulesInput: $('rules-input'),
    tapeTrack: $('tape-track'), stateBadge: $('state-badge'),
    stepCounter: $('step-counter'), ruleHint: $('rule-hint'),
    rulesTbody: $('rules-tbody'), mermaidContainer: $('mermaid-container'),
    diagramPanel: $('diagram-panel'), historyList: $('history-list'),
    stateTraceTrack: $('state-trace-track'), traceCount: $('trace-count'),
    traceScroll: $('state-trace-scroll'),
    tapeContainer: $('tape-container'),
    statusDot: $('status-dot'), statusLabel: $('status-label'),
    btnInit: $('btn-initialize'), btnEdit: $('btn-edit'),
    btnStep: $('btn-step'), btnRun: $('btn-run'),
    btnBack: $('btn-back'), btnReset: $('btn-reset'),
    speedSlider: $('speed-slider'), btnParseTape: $('btn-parse-tape'),
    resultBanner: $('result-banner'), resultIcon: $('result-icon'),
    resultTitle: $('result-title'), resultSubtitle: $('result-subtitle'),
    resultTape: $('result-tape-preview'), resultSteps: $('result-steps-pill'),
    resultDismiss: $('result-dismiss'),
  };

  // Attach event listeners
  el.resultDismiss.addEventListener('click', hideResultBanner);

  // ─── TAB SWITCH ───
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tab).classList.add('active');
    });
  });

  // ─── PRESET LOAD ───
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PRESETS[btn.dataset.preset];
      if (p) {
        el.tapeSrc.value = p.tape;
        el.rulesInput.value = p.rules;
        toast(`Loaded: ${btn.querySelector('.preset-name').textContent}`, 'success');
      }
    });
  });

  // ─── EXPRESSION TAGS ───
  el.tapeSrc.addEventListener('input', () => {
    const val = el.tapeSrc.value;
    if (val.includes('*') || val.includes('|')) el.btnParseTape.click();
    else $('tafl-multiverse-container').style.display = 'none';
  });

  el.btnParseTape.addEventListener('click', () => {
    const generated = generateTAFLStrings(el.tapeSrc.value);
    if (generated) {
      const container = $('tafl-multiverse-container');
      const resultsDiv = $('tafl-results');
      resultsDiv.innerHTML = '';
      generated.forEach(g => {
        let tag = document.createElement('div');
        tag.className = 'expr-tag gen-tag';
        tag.textContent = g === '' ? 'ε (epsilon)' : g;
        tag.dataset.expr = g;
        tag.addEventListener('click', () => {
          el.tapeSrc.value = g;
          container.style.display = 'none';
          toast(`Tape set to: ${g === '' ? 'ε' : g}`, 'success');
        });
        resultsDiv.appendChild(tag);
      });
      container.style.display = 'block';
      toast(`Generated Multiverse Tapes!`, 'success');
    } else {
      $('tafl-multiverse-container').style.display = 'none';
      toast(`Tape updated.`, 'info');
    }
  });

  // ─── BUTTON EVENT LISTENERS ───
  el.btnInit.addEventListener('click', initialize);
  el.btnEdit.addEventListener('click', () => { stopRun(); showSimSubView('setup-view'); });
  el.btnStep.addEventListener('click', () => { stopRun(); step(); });
  el.btnBack.addEventListener('click', stepBack);
  el.btnRun.addEventListener('click', toggleRun);
  el.btnReset.addEventListener('click', () => { stopRun(); initialize(); });

  el.speedSlider.addEventListener('input', () => {
    const v = parseInt(el.speedSlider.value);
    const delay = Math.round(1200 / v);
    toast(`Speed: ${delay}ms/step`, 'info', 1000);
  });

  // ─── KEYBOARD SHORTCUTS ───
  document.addEventListener('keydown', e => {
    if ($('setup-view').classList.contains('active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ') { e.preventDefault(); toggleRun(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); stopRun(); step(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepBack(); }
    if (e.key === 'r') { e.preventDefault(); stopRun(); initialize(); }
  });
});


// ─── EXPRESSION PARSER (TAFL) ───
function generateTAFLStrings(expr) {
  expr = expr.trim();
  if (!expr.includes('*') && !expr.includes('|')) return null;

  let results = [expr];
  let changed = true;
  let iterations = 0;

  while (changed && iterations < 15) {
    changed = false;
    iterations++;
    let nextResults = new Set();
    const starRegex = /(?:\(([^)]+)\)\*|([a-zA-Z0-9])\*)/;

    for (let s of results) {
      if (s.includes('|') && !s.match(starRegex)) { nextResults.add(s); continue; }
      const m = s.match(starRegex);
      if (m) {
        let fullMatch = m[0];
        let pattern = m[1] || m[2];
        for (let i = 0; i < 5; i++) {
          let replaced = s.replace(fullMatch, pattern.repeat(i));
          nextResults.add(replaced);
        }
        changed = true;
      } else nextResults.add(s);
    }
    if (changed) results = Array.from(nextResults);
  }

  let finalResults = new Set();
  for (let s of results) {
    if (s.includes('|')) {
      let parts = s.split('|');
      parts.forEach(p => finalResults.add(p.trim()));
    } else finalResults.add(s);
  }

  let arr = Array.from(finalResults);
  arr.sort((a, b) => a.length - b.length);
  return arr.length > 0 ? arr.slice(0, 15) : null;
}

// ─── TOAST ───
function toast(msg, type = 'info', duration = 3000) {
  const icons = { info: 'ℹ', success: '✓', error: '✕' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  $('toast-container').appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ─── VIEW SWITCH ───
function showView(id) {
  // This is the old functionality for backward compatibility
  // but should use showMainView or showSimSubView instead
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const innerViews = ['setup-view', 'run-view'];
  innerViews.forEach(viewId => {
    const view = $(viewId);
    if (view) view.classList.remove('active');
  });
  $(id).classList.add('active');
}

// ─── PARSE RULES & BUILD DIAGRAM ───
async function parseRules() {
  machine.rules = {};
  el.rulesTbody.innerHTML = '';

  const lines = el.rulesInput.value.split('\n');
  let mermaidSrc = 'graph LR\n';
  const allStates = new Set();
  const edges = {}; // Stores labels grouped by unique state transitions

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(s => s.trim());
    if (parts.length !== 5) continue;

    const [state, read, write, move, nextState] = parts;

    // Internal Logic
    if (!machine.rules[state]) machine.rules[state] = {};
    machine.rules[state][read] = { write, move, nextState, raw: line, index: i };

    // Grouping for the Diagram
    allStates.add(state);
    allStates.add(nextState);
    const edgeKey = `${state}||${nextState}`;
    if (!edges[edgeKey]) edges[edgeKey] = [];

    // Formatting the label: "read → write, move"
    edges[edgeKey].push(`${read} → ${write}, ${move}`);

    // Build rules table
    const tr = document.createElement('tr');
    tr.id = `rule-${i}`;
    parts.forEach(p => {
      const td = document.createElement('td');
      td.textContent = p;
      tr.appendChild(td);
    });
    el.rulesTbody.appendChild(tr);
  }

  // Create Nodes
  allStates.forEach(s => {
    const isHalt = /halt|stop|accept|reject/i.test(s);
    const shape = isHalt ? `${s}((( ${s} )))` : `${s}([ ${s} ])`;
    mermaidSrc += `    ${shape}\n`;
  });

  // Create Arrows with Labels
  for (const key in edges) {
    const [from, to] = key.split('||');
    const label = edges[key].join('<br/>'); // Join multiple rules on one arrow
    mermaidSrc += `    ${from} -->|"${label}"| ${to}\n`;
  }

  // Render Diagram
  if (allStates.size > 0) {
    try {
      el.mermaidContainer.innerHTML = '';
      const { svg } = await mermaid.render(`graph-${Date.now()}`, mermaidSrc);
      el.mermaidContainer.innerHTML = svg;
      el.mermaidContainer.style.animation = 'fadeUp 0.8s ease forwards';
    } catch (e) {
      console.error("Mermaid error:", e);
      el.mermaidContainer.innerHTML = '<p class="diagram-empty">Diagram render failed — check console.</p>';
    }
  }
}

// ─── SNAPSHOT ───
function snapshot(ruleApplied = null) {
  const trimmed = machine.tape.slice(Math.max(0, machine.head - 8), machine.head + 8).join('');
  return {
    tape: [...machine.tape], head: machine.head,
    state: machine.state, prevState: machine.prevState,
    steps: machine.steps, ruleRaw: ruleApplied,
    tapeDisplay: trimmed
  };
}

function restoreSnapshot(snap) {
  machine.tape = [...snap.tape];
  machine.head = snap.head;
  machine.state = snap.state;
  machine.prevState = snap.prevState;
  machine.steps = snap.steps;
}

// ─── INITIALIZE ───
async function initialize() {
  await parseRules();

  let val = el.tapeSrc.value.trim();
  let generated = generateTAFLStrings(val);
  let rawInput = val;
  if (generated && generated.length > 0 && (val.includes('*') || val.includes('|'))) {
    rawInput = generated.includes(val) ? val : generated[0];
  }
  const input = rawInput === '' ? ['_'] : rawInput.split('');

  const PAD = 20;
  machine.tape = Array(PAD).fill('_').concat(input).concat(Array(PAD).fill('_'));
  machine.head = PAD;
  machine.state = 'q0';
  machine.prevState = null;
  machine.steps = 0;
  machine.history = [snapshot()];
  machine.stateTrace = [{ state: 'q0', symbol: null, isHalt: false }];
  machine.discoveredStates = new Set(['q0']);
  machine.discoveredEdges = new Set();

  el.mermaidContainer.classList.add('progressive-diagram');

  stopRun();
  hideResultBanner();
  el.ruleHint.textContent = 'Ready — step or run';
  el.tapeContainer.classList.remove('halted');
  el.runView.classList.remove('halted');
  el.stateBadge.classList.remove('halted');
  el.statusDot.className = 'status-dot inactive';
  el.statusLabel.textContent = 'READY';

  clearHistoryUI();
  buildTraceUI();
  showSimSubView('run-view');

  requestAnimationFrame(() => { render(); });
}

// ─── BUILD STATE TRACE UI ───
function buildTraceUI() {
  el.stateTraceTrack.innerHTML = '';
  el.traceCount.textContent = `${machine.stateTrace.length - 1} transitions`;

  machine.stateTrace.forEach((entry, i) => {
    const isLast = i === machine.stateTrace.length - 1;
    const wrapper = document.createElement('div');
    wrapper.className = 'trace-entry';

    const stateEl = document.createElement('div');
    stateEl.className = 'trace-state' + (isLast ? ' current' : '') +
      (entry.isHalt ? ' halted-state' : '');
    stateEl.textContent = entry.state;

    if (entry.symbol) {
      const tip = document.createElement('div');
      tip.className = 'trace-tooltip';
      tip.textContent = `read: ${entry.symbol}`;
      stateEl.appendChild(tip);
    }

    const stepIdx = i;
    stateEl.style.cursor = 'pointer';
    stateEl.title = `Rewind to step ${stepIdx}`;
    stateEl.addEventListener('click', () => rewindToStep(stepIdx));

    wrapper.appendChild(stateEl);
    if (!isLast) {
      const arrow = document.createElement('div');
      arrow.className = 'trace-arrow';
      wrapper.appendChild(arrow);
    }
    el.stateTraceTrack.appendChild(wrapper);
  });

  requestAnimationFrame(() => {
    el.traceScroll.scrollLeft = el.traceScroll.scrollWidth;
  });
}

// ─── HISTORY UI ───
function clearHistoryUI() {
  el.historyList.innerHTML = '<div class="history-empty">No steps taken yet</div>';
}

function appendHistoryRow(snap, isCurrent) {
  if (el.historyList.querySelector('.history-empty')) el.historyList.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'history-row' + (isCurrent ? ' current-history' : '');
  row.id = `hist-${snap.steps}`;

  const tapeView = snap.tape.map((c, i) => i === snap.head ? `[${c}]` : c)
    .join('').replace(/_+$/, '').replace(/^_+/, '') || '_';

  row.innerHTML = `
    <div class="h-step">${snap.steps}</div>
    <div class="h-tape">${tapeView}</div>
    <div class="h-state">${snap.state}</div>
    <div class="h-rule">${snap.ruleRaw || '—'}</div>
    <div class="h-rewind" title="Rewind here">↩</div>
  `;
  row.addEventListener('click', () => rewindToStep(snap.steps));
  el.historyList.appendChild(row);
  row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ─── RENDER ───
function render(writtenIdx = -1) {
  const VISIBLE = 30;
  const start = Math.max(0, machine.head - VISIBLE);
  const end = Math.min(machine.tape.length, machine.head + VISIBLE + 1);

  const cells = [];
  for (let i = start; i < end; i++) cells.push({ i, v: machine.tape[i] });

  while (el.tapeTrack.children.length < cells.length) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    // .cell-val holds the tape symbol — must come BEFORE .cell-idx
    const val = document.createElement('span');
    val.className = 'cell-val';
    cell.appendChild(val);
    // .cell-idx holds the tiny position number in the corner
    const idx = document.createElement('span');
    idx.className = 'cell-idx';
    cell.appendChild(idx);
    el.tapeTrack.appendChild(cell);
  }
  while (el.tapeTrack.children.length > cells.length) {
    el.tapeTrack.removeChild(el.tapeTrack.lastChild);
  }

  cells.forEach(({ i, v }, domIdx) => {
    const cell = el.tapeTrack.children[domIdx];
    const isActive = i === machine.head;
    const isBlank = v === '_';

    let cls = 'cell';
    if (isActive) cls += ' active';
    if (isBlank && !isActive) cls += ' blank-cell';
    if (i === writtenIdx) cls += ' just-written';

    cell.className = cls;
    // Write to the dedicated value span — NOT childNodes[0] which could be .cell-idx
    cell.querySelector('.cell-val').textContent = v;
    cell.querySelector('.cell-idx').textContent = i;
  });

  // Center active cell
  const activeRelIdx = machine.head - start;
  const cellWidth = 78;
  const trackOffset = -(activeRelIdx * cellWidth) + (el.tapeTrack.parentElement.clientWidth / 2) - 36 - 600;
  el.tapeTrack.style.transform = `translateX(${trackOffset}px)`;

  const isHalted = machine.state === 'qStop' || machine.state.toLowerCase().includes('halt') ||
    machine.state.toLowerCase().includes('accept') || machine.state.toLowerCase().includes('reject');

  el.stateBadge.textContent = machine.state;
  el.stateBadge.classList.toggle('halted', isHalted);
  el.stepCounter.textContent = machine.steps;
  el.stepCounter.classList.add('step-glow');
  setTimeout(() => el.stepCounter.classList.remove('step-glow'), 300);

  if (isHalted) {
    el.statusDot.className = 'status-dot halted';
    el.statusLabel.textContent = 'HALTED';
    el.tapeContainer.classList.add('halted');
    el.runView.classList.add('halted');
  } else if (machine.isRunning) {
    el.statusDot.className = 'status-dot';
    el.statusLabel.textContent = 'RUNNING';
  } else {
    el.statusDot.className = 'status-dot inactive';
    el.statusLabel.textContent = 'PAUSED';
  }

  highlightDiagram();
}

// ─── DIAGRAM HIGHLIGHT ───
function highlightDiagram() {
  document.querySelectorAll('.node').forEach(n => n.classList.remove('active-state-node'));
  document.querySelectorAll('.edgePaths path, .edgePath path, .transition').forEach(p => p.classList.remove('active-edge'));
  document.querySelectorAll('marker path').forEach(p => p.classList.remove('active-edge-marker'));

  void document.body.offsetWidth;

  if (machine.discoveredStates) {
    machine.discoveredStates.add(machine.state);
    document.querySelectorAll('.node').forEach(n => {
      if (machine.discoveredStates.has((n.textContent || "").trim())) n.classList.add('discovered');
    });
    if (machine.prevState) machine.discoveredEdges.add(`${machine.prevState}-${machine.state}`);
    machine.discoveredEdges.forEach(edgeKey => {
      document.querySelectorAll(`[id^="L-${edgeKey}"]`).forEach(el => el.classList.add('discovered'));
      document.querySelectorAll(`[id^="L-L-${edgeKey}"]`).forEach(el => el.classList.add('discovered'));
    });
    // Also mark edge labels as discovered
    document.querySelectorAll('.edgeLabels .edgeLabel').forEach(labelGroup => {
      const labelId = labelGroup.id || '';
      machine.discoveredEdges.forEach(edgeKey => {
        if (labelId.includes(edgeKey)) labelGroup.classList.add('discovered');
      });
    });
  }

  document.querySelectorAll('.node').forEach(n => {
    if ((n.textContent || "").trim() === machine.state) n.classList.add('active-state-node');
  });

  if (machine.prevState && machine.state) {
    const edge = document.querySelector(`[id^="L-${machine.prevState}-${machine.state}"] path`);
    if (edge) {
      edge.classList.add('active-edge');
      const mu = edge.getAttribute('marker-end');
      if (mu) {
        const mid = mu.replace('url(#', '').replace(')', '');
        const mk = document.getElementById(mid);
        if (mk) { const mp = mk.querySelector('path'); if (mp) mp.classList.add('active-edge-marker'); }
      }
    }
  }
}

// ─── ENSURE BOUNDS ───
function ensureBounds() {
  if (machine.head < 8) {
    const add = 10;
    machine.tape.unshift(...Array(add).fill('_'));
    machine.head += add;
    machine.history.forEach(h => h.head += add);
  }
  if (machine.head >= machine.tape.length - 8) machine.tape.push(...Array(10).fill('_'));
}

// ─── STEP ───
function step() {
  ensureBounds();
  const symbol = machine.tape[machine.head] || '_';
  const stateRules = machine.rules[machine.state];

  document.querySelectorAll('#rules-tbody tr').forEach(r => r.classList.remove('active-rule'));

  if (!stateRules) {
    el.ruleHint.textContent = `No rules for state "${machine.state}" — halted`;
    stopRun();
    return false;
  }

  const rule = stateRules[symbol] || stateRules['_'];
  if (!rule) {
    el.ruleHint.textContent = `No rule for (${machine.state}, "${symbol}") — halted`;
    stopRun();
    return false;
  }

  const snap = snapshot(rule.raw);
  machine.history.push(snap);

  el.ruleHint.textContent = rule.raw;
  const row = $(`rule-${rule.index}`);
  if (row) {
    row.classList.add('active-rule');
    if ($('tab-table').classList.contains('active')) {
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  const prevHead = machine.head;
  machine.tape[machine.head] = rule.write;
  machine.prevState = machine.state;
  machine.state = rule.nextState;
  machine.head += rule.move === 'R' ? 1 : -1;
  machine.steps++;

  const isHalt = rule.nextState === 'qStop' || rule.nextState.toLowerCase().includes('halt') ||
    rule.nextState.toLowerCase().includes('accept') || rule.nextState.toLowerCase().includes('reject');
  machine.stateTrace.push({ state: rule.nextState, symbol, isHalt });
  buildTraceUI();
  appendHistoryRow(snap, true);

  ensureBounds();
  render(prevHead);

  if (isHalt) {
    stopRun();
    showResultBanner(rule.nextState, machine.steps);
    return false;
  }
  return true;
}

// ─── STEP BACK ───
function stepBack() {
  if (machine.history.length <= 1) { toast('Already at initial state', 'info'); return; }
  stopRun();
  machine.history.pop();
  const prev = machine.history[machine.history.length - 1];
  restoreSnapshot(prev);
  if (machine.stateTrace.length > 1) machine.stateTrace.pop();
  buildTraceUI();
  const rows = el.historyList.querySelectorAll('.history-row');
  if (rows.length > 0) rows[rows.length - 1].remove();
  if (el.historyList.children.length === 0) clearHistoryUI();
  el.ruleHint.textContent = prev.ruleRaw || 'Stepped back';
  el.tapeContainer.classList.remove('halted');
  el.runView.classList.remove('halted');
  el.stateBadge.classList.remove('halted');
  render();
}

// ─── REWIND ───
function rewindToStep(targetStep) {
  if (targetStep >= machine.history.length) return;
  stopRun();
  while (machine.history.length > targetStep + 1) machine.history.pop();
  while (machine.stateTrace.length > targetStep + 1) machine.stateTrace.pop();
  const snap = machine.history[machine.history.length - 1];
  restoreSnapshot(snap);
  buildTraceUI();
  el.historyList.innerHTML = '';
  machine.history.slice(1).forEach(h => appendHistoryRow(h, false));
  if (el.historyList.children.length === 0) clearHistoryUI();
  el.ruleHint.textContent = snap.ruleRaw || 'Rewound';
  el.tapeContainer.classList.remove('halted');
  el.runView.classList.remove('halted');
  el.stateBadge.classList.remove('halted');
  render();
  toast(`Rewound to step ${targetStep}`, 'info');
}

// ─── RUN / STOP ───
function toggleRun() {
  if (machine.isRunning) {
    stopRun();
  } else {
    machine.isRunning = true;
    el.btnRun.textContent = '⏸ Pause';
    el.btnRun.className = 'btn btn-run paused';
    el.statusDot.className = 'status-dot';
    el.statusLabel.textContent = 'RUNNING';

    const getDelay = () => Math.round(1200 / parseInt(el.speedSlider.value));
    const loop = () => {
      if (!machine.isRunning) return;
      if (!step()) return;
      machine.interval = setTimeout(loop, getDelay());
    };
    machine.interval = setTimeout(loop, getDelay());
  }
}

function stopRun() {
  machine.isRunning = false;
  clearTimeout(machine.interval);
  el.btnRun.textContent = '▶ Run';
  el.btnRun.className = 'btn btn-run';
  if (!el.statusLabel.textContent.includes('HALT')) {
    el.statusDot.className = 'status-dot inactive';
    el.statusLabel.textContent = 'PAUSED';
  }
}
