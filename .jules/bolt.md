## 2024-05-24 - MapLibre WebGL Thrashing Anti-pattern
**Learning:** Tearing down and rebuilding layers/sources on every render/state change causes WebGL thrashing and event listener memory leaks.
**Action:** Always use `source.setData()` to update map data dynamically instead of `removeLayer`/`addLayer`.
## 2024-05-24 - MapLibre React Integration Memory Leaks
**Learning:** Tearing down and rebuilding layers/sources (e.g., `removeLayer`/`addLayer`) within React `useEffect` loops based on state changes causes WebGL thrashing and severe memory leaks due to repeatedly binding new event listeners (`map.on()`) without cleaning them up.
**Action:** When using MapLibre in React, define sources, layers, and event handlers exactly once on map load. Use `source.setData()` to update geometries and `map.setLayoutProperty(id, 'visibility', 'none'/'visible')` to toggle visibility in response to state changes.
## 2024-06-10 - MapLibre GeoJSON Source Updates
**Learning:** Removing and re-adding MapLibre layers (`removeLayer`, `addLayer`) and sources on state changes causes severe WebGL buffer thrashing and accumulates duplicate event listeners (`map.on`), leading to memory leaks and dropped frames.
**Action:** Always use `source.setData()` to update map data dynamically instead of tearing down and rebuilding the layer and its listeners.
## 2023-10-25 - Prevented Unnecessary Render Cycles in Context
**Learning:** Found that `CatalogContext` wasn't memoizing its context value, which caused full re-renders for every subscriber (like `Catalog.tsx`, `MapPage.tsx`, `Landing.tsx`) on ANY state update, even minor ones. The `filteredDatasets` calculation was also running on every render instead of just when filters or data changed.
**Action:** Always memoize Context values with `useMemo` and extract derived state calculations inside `useMemo` when working with React Contexts that handle large datasets or arrays.
## 2024-06-09 - React Context Antipattern: O(n) Helpers
**Learning:** Exposing helper functions like `getLayer(id)` or `getProvider(id)` via React Context that use `Array.find()` internally creates an invisible O(n) bottleneck. When a list view (like the Catalog grid) iterates over `n` items and calls this helper for each item, the overall render cost becomes O(n²).
**Action:** Always pre-compute O(1) Hash Maps (using `useMemo` or plain JS `Map`) for lookup helpers exposed via Context to ensure predictable O(1) reads during large array maps or grid renders. Additionally, always memoize the Context Provider's value to prevent unnecessary consumer re-renders.
## 2024-05-19 - MapLibre source updates instead of replacement
**Learning:** Tearing down and re-adding MapLibre sources and layers (via `removeLayer`/`addLayer`/`removeSource`) in React `useEffect` hooks causes significant WebGL thrashing and potential event listener memory leaks, especially when toggling visibility or updating data frequently.
**Action:** When updating MapLibre data in React, maintain the source and layers, and exclusively use `source.setData()` with the new GeoJSON data. If visibility needs to be toggled off via data, set the source data to an empty FeatureCollection (`{ type: 'FeatureCollection', features: [] }`).
