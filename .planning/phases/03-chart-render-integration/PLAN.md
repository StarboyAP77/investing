# Phase 3 — Interface & Existing Chart Rendering Pipeline Integration

**Goal:** Strategy `change` → merge → recalc → re-render on existing ECharts without overlap. Depends on Phases 1–2.

## Tasks
1. Locate via `rg -n "chartInstances|initializeChart|echarts.init|getInstanceByDom|setOption|updateChartAndTable|tbody.innerHTML" index.html`: anchors `3210, 3229, 3390, 3813, 4026, 5217`.
2. Create `function renderVisualizations()` reusing `initializeChart()`/`setOption()` + existing `tbody.innerHTML` table updates. On rerun: reuse `chartInstances[id].setOption(opt,true)` or `dispose()+init` — never duplicate `echarts.init` on same div.
3. Bind `document.getElementById('strategy-selector').addEventListener('change', async e=>{ currentStrategy=e.target.value; data=buildMergedData(currentStrategy); metrics=calculateMetrics(data); renderVisualizations(); })`.
4. Pages safety: relative `fetch('./data.json', {cache:'no-store'})` or versioned `?v=1`; keep `index.html`+`data.json` same folder; no absolute `/` paths; no new libs.

## Verify (human checkpoint — final)
- Unified snippet: listener + chain.
- Manual: load via local server + Pages: default chart = `nseMidcap150Mom50`; switch dropdown → all charts/tables refresh, no overlay; console clean; missing-key selection warns gracefully.
- Future-proof: dropping real NAVs into `bseMidcap150Mom30`/`nse500Mom50` in `data.json` works with zero code change.
- No commit, no tests.
