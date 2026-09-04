# Phase 7 — Equity Only + Gold Only Everywhere the Trio Appears

**Goal:** Every reb / noReb / benchmark trio in calcs, tables, and visuals gains Equity Only + Gold Only. Depends on Phases 1–6 (uses `results.*` bundle, `renderVisualizations` guards, `sec-*` ids).

## Work order (each layer feeds the next; verify as you go)

### A. Engine (`js/benchmark.js`, `js/main.js` calculateMetrics) — FIRST
1. Generalize `runBenchmarkSimulation(data, options)` with an `asset` option (default `'BENCHMARK'`); replace the hardcoded `BENCHMARK` NAV reads (line ~20) with `curr[asset] / prev[asset]`. No other logic change — return shape identical.
2. In `calculateMetrics`, alongside `benchmark: runBenchmarkSimulation(...)`, add `equityOnly: runBenchmarkSimulation(..., { ...opts, asset: 'EQUITY' })` and `goldOnly: ... asset: 'GOLD'` (standard withdrawal opts; all 4 withdrawal strategies only if cheap — default: standard only, matching how benchmark is consumed).
3. Add `equityOnlyMetrics / goldOnlyMetrics` (+ with-withdrawal variants) via existing `calcMetrics`; extend `currentMetrics` so the risk-return scatter can plot them.
4. Verify: harness — new histories length 254, metrics sane and distinct from benchmark.

### B. Perf tables (`js/main.js` render body)
5. `#metrics-table` + `#metrics-table-with-withdrawals`: 4 cols → 6 cols (+ Equity Only, Gold Only). Tax/bunker rows: `-` where N/A.
6. Yearly performance table (`updateYearlyPerformanceTable` in `js/tables.js`): + `EQUITY ONLY` / `GOLD ONLY` rows from the new histories.

### C. New sibling charts (HTML div + init + guarded render each)
7. Add divs (same container pattern as siblings) + extend the `chartIds` init list:
   - `yearly-path-equityonly`, `yearly-path-goldonly` (Yearly Paths) + 2 `updateSpaghettiChart` calls
   - `fair-value-equityonly`, `fair-value-goldonly` + 2 `updateFairValueChart` calls
   - `yearly-returns-equityonly`, `yearly-returns-goldonly`
   - `monthly-returns-equityonly`, `monthly-returns-goldonly`
   - `drawdown-chart-equityonly`, `drawdown-chart-goldonly`
   - `rolling-returns-equityonly-chart`, `rolling-returns-goldonly-chart` (+ extend the 3 rolling sub-guards to 5)
8. New setOption blocks live inside the EXISTING section guards (no new guards needed except rolling subs).

### D. Extend series in existing charts (no new divs)
9. `corpus-chart-equityonly` + `corpus-chart-goldonly` as 4th/5th standalone charts in the Withdrawal Charts section (new divs + `chartIds` + 2 `chartConfigs` entries reusing the same loop; NOT extra lines inside the 3 existing charts).
10. `risk-return-scatter-plot`: + 2 points from the extended `currentMetrics`.
11. `yoy-rank-chart`, `mom-rank-chart`, quarterly heatmap, `avg-rolling-returns-chart`: extend only where a hard 3-way exists (check at build time; skip pure asset-rank views).

### E. Lazy sections (`renderTimingDilemma`, `renderHorizonMatrix`, `renderCorrelationCharts`, `renderHarvestSection`, crash/valuation/fear/deployment)
12. Extend side-by-side reb/noReb/benchmark displays with the new histories where shown (per-section check; globals already carry them after step 2).

### Deliberately skipped (rationale in roadmap discussion)
- Allocation charts (2-way mix; 100% lines trivial), reb-only artifacts (ledger, SIP logs, deployment inputs), Withdrawal Strategies Comparison table (4-method axis, not portfolios), MC charts (click-driven pair).

## Verify (human checkpoint)
- Harness: new histories/metrics asserted (lengths, distinctness, alignment); `node --check` all touched files.
- Browser: each trio spot shows 5 (tables 6 cols); legend toggles; log-scale applies; strategy switch refreshes new lines; collapsed sections still lazy (0 renders cold).
- No commit, no tests.
