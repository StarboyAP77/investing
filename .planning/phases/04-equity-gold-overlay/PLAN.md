# Phase 4 — Equity-Only / Gold-Only Overlay on Strategy Comparison chart

**Goal:** On the main `Strategy Comparison` chart (`#equity-chart`, series built at `index.html:5639-5660`), add two extra lines: standalone EQUITY-only and GOLD-only buy-and-hold trajectories alongside No Rebalance / Periodic Rebalance / Benchmark. Small, surgical change. Depends on Phases 1–3 (uses merged `data` + `results.standard`).

## Tasks
1. Locate `mainChartSeries` at `~L5639-5644` and its `setOption` at `~L5654-5660` (ECharts, `xAxis: {type:'time'}`). Do not touch other charts.
2. Derive the two lines from already-filtered data (same `dates[]` + `filteredData` used for `results`): rebase `EQUITY` and `GOLD` NAVs to the same starting capital as `historyWithoutWithdrawals` (i.e. `nav / nav[0] * initialCapital`, matching how benchmark history is scaled — check `runBacktest` scaling, do not invent a new scale).
3. Push two series: `{ name:'Equity Only', type:'line', showSymbol:false, ...green }` and `{ name:'Gold Only', type:'line', showSymbol:false, ...gold }`. Reuse existing tooltip/log-scale logic (generic `formatCurrency` formatter already covers new series; verify log-scale toggle still works).
4. Keep legend default-on; user toggles via built-in ECharts legend. No new libs, no date-format change.

## Verify (human checkpoint)
- Snippet of the two added series + scaling lines.
- Manual: Strategy Comparison shows 5 lines (NoReb, Rebalanced, Benchmark, Equity Only, Gold Only); legend toggles each; log-scale checkbox still applies; no overlay/duplication on re-render or strategy switch.
- No commit, no tests.
