## 2024-05-19 - MapLibre source updates instead of replacement
**Learning:** Tearing down and re-adding MapLibre sources and layers (via `removeLayer`/`addLayer`/`removeSource`) in React `useEffect` hooks causes significant WebGL thrashing and potential event listener memory leaks, especially when toggling visibility or updating data frequently.
**Action:** When updating MapLibre data in React, maintain the source and layers, and exclusively use `source.setData()` with the new GeoJSON data. If visibility needs to be toggled off via data, set the source data to an empty FeatureCollection (`{ type: 'FeatureCollection', features: [] }`).

## 2026-06-15 - Redundant network requests optimization
**Learning:** Loading shared static JSON data from `useEffect` hooks across multiple unmounted pages (`Alerts.tsx`, `MapPage.tsx`, etc) causes redundant network requests because the default `fetch` operation has no app-level cache layer for unmounted components.
**Action:** Implement an in-memory `Map` in `src/lib/data.ts` to cache the returned Promises. Ensure the cached Promise is deleted on rejection to allow retries, and return `!` (non-null assertion) from the Map getter to strictly type the Promise return.
