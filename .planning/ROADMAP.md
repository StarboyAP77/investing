# ROADMAP.md

Milestone: Dynamic strategy switching via `data.json` (GitHub Pages safe)

- [x] **Phase 1 — Data Integration & Dynamic State Orchestration** (`01-data-integration-dynamic-state`)
  Goal: `fetch('./data.json')` + `#strategy-selector` (default `nseMidcap150Mom50`) + merge engine → `[{date, equity, gold, benchmark}]`.
- [ ] **Phase 2 — Mathematical Pipeline & Calculation Engine Refactoring** (`02-math-pipeline-refactor`)
  Goal: Encapsulate metrics (`calcMetrics`, `runBacktest`, rolling/XIRR/drawdown) into `calculateMetrics(mergedData)` with clean state reset per switch.
- [ ] **Phase 3 — Interface & Existing Chart Rendering Pipeline Integration** (`03-chart-render-integration`)
  Goal: Reusable `renderVisualizations()` on existing ECharts (`chartInstances`, `echarts.init/setOption`), `change` listener → full chain, Pages-safe (relative path, no CORS, cache-bust).

- [ ] **Phase 4 — JS/CSS Separation** (`04-js-css-separation`)
  Goal: Split `index.html` (~6600 lines) into small/medium CSS + ES-module JS files by concern; `index.html` becomes a shell. Zero behavior change.
- [ ] **Phase 5 — Lazy-Load Sections** (`05-lazy-load-sections`)
  Goal: Every collapsible `<details class="chart-group">` computes + renders on first open (existing toggle+dirty-flag pattern generalized); cold load renders core path only.
- [ ] **Phase 6 — Equity-Only / Gold-Only Overlay** (`06-equity-gold-overlay`)
  Goal: Add standalone `Equity Only` + `Gold Only` lines to main `Strategy Comparison` chart (`#equity-chart`), same scale, legend-togglable.

Execute one by one: plan → execute → human verify. No commits, no tests.
