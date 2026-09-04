# Phase 2 — Mathematical Pipeline & Calculation Engine Refactoring

**Goal:** Make metrics re-runnable per strategy with clean state. Depends on Phase 1 `buildMergedData()`.

## Tasks
1. Locate via `rg -n "calcMetrics|runBacktest|calculateRolling|calculateXIRR|calculateDrawdown|currentMetrics|globalResults|globalFilteredData" index.html`: entry anchors at `2271, 2329, 2341, 2358, 3035-3074, 3147, 3210-3220`.
2. Create `function calculateMetrics(mergedData)` wrapping existing `calcMetrics`/`runBacktest`/rolling/XIRR/drawdown/correlation calls — takes merged array as arg, no immutable global read. Purge/overwrite per run: `globalResults={}, globalFilteredData=[], globalDates=[], currentMetrics={}` + set section-dirty flags (`...NeedsUpdate=true`) before recompute.
3. Preserve ECharts + date logic untouched. No signature changes to inner math fns.

## Verify (human checkpoint)
- Snippet of `calculateMetrics()` + reset block.
- Console: `calculateMetrics(buildMergedData('nseMidcap150Mom50'))` vs gold-only sanity shows total-return shift; re-run same key twice → identical output (no contamination).
- No commit, no tests.
