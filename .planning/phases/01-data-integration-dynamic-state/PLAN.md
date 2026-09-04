# Phase 1 — Data Integration & Dynamic State Orchestration

**Goal:** Load `data.json` once, merge selected equity + constant gold/benchmark into `[{date, equity, gold, benchmark}]`.

## Tasks
1. Verify `data.json` keys via `python3 -c "import json; print(list(json.load(open('data.json'))))"`. Do NOT add dummy NAVs — tolerate absent `bseMidcap150Mom30`/`nse500Mom50` (skip + console.warn, dropdown still lists all 5).
2. Targeted edit `index.html` (~L592-640 controls area): add `<select id="strategy-selector">` with 5 options, `nseMidcap150Mom50` selected default. Build options dynamically from fetched keys if trivial, else hardcode 5.
3. In main module (near L2013, L3210-3220 state block): add `let rawJsonData=null, currentStrategy='nseMidcap150Mom50'`; add `async function initDashboard(){ rawJsonData=await (await fetch('./data.json')).json(); ... }`; add `function buildMergedData(strategy){ map gold/benchmark by date string ===, nav→equity/gold/benchmark }`. Delete/replace static `const data=[...]` L2013-2268 with `let data=[]` fed by merger (keep `EQUITY/GOLD/BENCHMARK` uppercase consumers working — map both cases or update references surgically).
4. Wire `initDashboard()` on DOMContentLoaded. Keep existing date strings untouched.

## Verify (human checkpoint)
- Snippet of `<select>` markup + diff stat.
- `console.log(buildMergedData('nseMidcap150Mom50').slice(0,3))` shows `[{date, equity, gold, benchmark}]` aligned.
- Switch key in console shows different `equity`, same `gold`/`benchmark`. Missing key warns, no crash.
- No commit, no tests.
