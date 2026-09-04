# Phase 4 — Split JS/CSS Out of `index.html` Into Manageable Files

**Goal:** Break the ~6600-line `index.html` into small/medium files by concern so future edits (human or model) touch one focused file. Zero behavior change. Depends on Phases 1–3 as built.

## Current layout (re-locate via grep — numbers drifted after Phases 1–3)
- `<style>` ~L7-575 (~570 lines) + inline `<style>` ~L1038-1062 → CSS
- ECharts CDN ~L576 (keep as-is)
- `<script id="mc-worker-script">` ~L1879 (~140 lines, worker built via Blob of element text) → **keep inline** (externalizing changes worker bootstrap; not worth it)
- `<script type="module">` ~L2023 (~4500 lines: state ~L2016, backtest engine, metrics, charts, sections, `calculateMetrics` ~L5031, `renderVisualizations` ~L5198, init ~L5750)

## Tasks
1. Extract CSS first (safest): `css/base.css`, plus split by concern (`controls`, `charts`, `tables`, …), each <~400 lines. `<link rel="stylesheet" href="./css/…">`, relative paths only. Keep the tiny inline `<style>` with its section or fold into the matching file.
2. Split the module into ES modules (keeps current `type="module"` strict+defer semantics; works on Pages with relative imports), each <~500 lines, e.g. `js/state.js` (fetch/merge/strategy), `js/backtest.js` (engine + worker fallback), `js/metrics.js`, `js/charts-core.js` (`chartInstances`, `initializeChart`, theme), `js/sections/*.js` (one per section group), `js/main.js` (entry: init + wiring). Explicit `import`/`export` — no shared-closure magic; document the import graph at the top of `main.js`.
3. Preserve execution order and scope: single entry `js/main.js` loaded from `index.html`; nothing else adds globals (except existing `window.calculateMetrics` hook — keep).
4. No behavior change: no lib swaps, no date-format change, no logic edits while moving (move code verbatim; `git diff` should show pure relocation).

## Verify (human checkpoint)
- `node --check` every new JS file; full-page load renders identically (spot-check Strategy Comparison + one table); calc harness reruns green (same 5025.12%/20.53%).
- `index.html` left as shell (head + body markup + script/link tags); each new file has a one-line header comment stating its concern.
- No commit, no tests.
