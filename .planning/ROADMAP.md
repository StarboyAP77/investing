# ROADMAP.md

Milestone: Dynamic strategy switching via `data.json` (GitHub Pages safe)

- [x] **Phase 1 — Data Integration & Dynamic State Orchestration** (`01-data-integration-dynamic-state`)
  Goal: `fetch('./data.json')` + `#strategy-selector` (default `nseMidcap150Mom50`) + merge engine → `[{date, equity, gold, benchmark}]`.
- [ ] **Phase 2 — Mathematical Pipeline & Calculation Engine Refactoring** (`02-math-pipeline-refactor`)
  Goal: Encapsulate metrics (`calcMetrics`, `runBacktest`, rolling/XIRR/drawdown) into `calculateMetrics(mergedData)` with clean state reset per switch.
- [ ] **Phase 3 — Interface & Existing Chart Rendering Pipeline Integration** (`03-chart-render-integration`)
  Goal: Reusable `renderVisualizations()` on existing ECharts (`chartInstances`, `echarts.init/setOption`), `change` listener → full chain, Pages-safe (relative path, no CORS, cache-bust).

- [ ] **Phase 4 — Equity-Only / Gold-Only Overlay** (`04-equity-gold-overlay`)
  Goal: Add standalone `Equity Only` + `Gold Only` lines to main `Strategy Comparison` chart (`#equity-chart`, `~L5639-5660`), same scale, legend-togglable.

Execute one by one: plan → execute → human verify. No commits, no tests.
