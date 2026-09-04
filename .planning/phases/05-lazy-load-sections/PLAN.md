# Phase 5 — Lazy-Load Every Collapsible Section

**Goal:** Initial page load fetches/merges data and renders only the core path; every `<details class="chart-group">` (Strategy Comparison sub-charts, withdrawal charts, and all other sections/subsections) computes + renders on first open. Faster cold load. Depends on Phase 4 (files now split — re-locate via grep).

## Tasks
1. Follow the EXISTING pattern already used by timing/horizon/correlation/harvest: `toggle` listener + `*SectionNeedsUpdate` dirty flag + render-on-open. Generalize it: inventory every `<details class="chart-group">` and give each the same treatment.
2. Startup (`initDashboard`/`main.js` init): `fetch` + merge + `calculateMetrics` + core Strategy Comparison render only. Do NOT `initializeChart` closed-section charts upfront (use the existing `getInstanceByDom() || init()` guard on first open — that helper already exists).
3. In `renderVisualizations()`: skip closed sections entirely (no compute, no `setOption`); any input/strategy change sets ALL section flags dirty. Heavy paths (Monte Carlo worker, random-walk sims) must not run until their section opens.
4. Keep already-open sections updating immediately (current behavior for open timing/horizon/etc. stays).

## Verify (human checkpoint)
- Cold load: only core chart renders; console/network shows no heavy sims before opening sections.
- Each section renders correctly on first open; strategy switch → reopened section shows fresh data (no stale charts); open sections still live-update on input change.
- No commit, no tests.
