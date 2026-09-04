# PROJECT.md — Asset Allocation Dashboard (static → dynamic strategy)

- **Stack:** Single `index.html` (~6740 lines), ECharts 5.5.0 via CDN, GitHub Pages static hosting.
- **Data:** Monthly `YYYY-MM-DD` month-end. `data.json` = `{ key: [{date, nav}] }`. Currently real: `nseMidcap150Mom50`, `gold`, `benchmark` (254 rows each, 2005-06-30 → 2026-07-31). Placeholders `bseMidcap150Mom30`, `nse500Mom50` may be absent → code must tolerate missing keys.
- **Current code:** `const data = [{date, EQUITY, GOLD, BENCHMARK}]` at `index.html:2013-2268`. No `fetch()`. Main module `2010-6739`. Dates aligned by exact string equality.
- **Target:** Remove baked array. Load `data.json` via relative `fetch('./data.json')`. `gold`+`benchmark` constant; `equity` = selected strategy `nav`. Dropdown `#strategy-selector`, default `nseMidcap150Mom50`. Future JSON keys auto-work (dropdown built from keys, or fixed 5-option list with graceful skip).
- **Constraints:** No chart lib change (ECharts as-is). No date-format change. No commits. No tests. Targeted edits only (grep, no full-file loads).
