# STATE.md

- Position: Phase 1 verified by human. Phase 2 executed, awaiting human verify. Phases 3–4 not started.
- Phase 2 deltas: new `calculateMetrics(mergedData)` (~L5031, closure-scoped, `window.calculateMetrics` hook) — purge + input snapshot + date filter on param + 4-strategy backtests + headline/rolling/with-withdrawal metrics + globals store, returns 14-field bundle. `updateChartAndTable()` now delegates (`calculateMetrics(data)` → destructure → render-only). Verified live in Node+DOM-stub harness on real data.json: reb Abs 5025.12%/CAGR 20.53% vs gold-as-equity 1764.81%/14.89% (shift YES), repeat identical (no contamination), short→null. `node --check` OK, braces balanced.
- Phase 1 deltas: baked array deleted by user → `let data=[]`; added `#strategy-selector` (~L581), `STRATEGY_KEYS`/`rawJsonData`/`currentStrategy`/`buildMergedData()` (~L2016), async fetch + selector wiring (~L2953), change listener (~L5645). Verified: node merge = 254 rows identical to old baked values; `node --check` OK; local server serves both files (json MIME correct).
- Key evidence: `index.html:2013-2268` static array; `chartInstances` at `3210`; `initializeChart` at `3229`; `calcMetrics` at `2271`; ECharts CDN at `576`; selects at `592,594,638`; zero `fetch()`.
- `data.json`: 3 real keys × 254 rows. Missing-key tolerance required for `bseMidcap150Mom30`, `nse500Mom50`.
- Rules: No commits. No tests. Relative `fetch('./data.json')` only. Keep edits surgical.
