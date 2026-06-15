## 2024-05-19 - MapLibre source updates instead of replacement
**Learning:** Tearing down and re-adding MapLibre sources and layers (via `removeLayer`/`addLayer`/`removeSource`) in React `useEffect` hooks causes significant WebGL thrashing and potential event listener memory leaks, especially when toggling visibility or updating data frequently.
**Action:** When updating MapLibre data in React, maintain the source and layers, and exclusively use `source.setData()` with the new GeoJSON data. If visibility needs to be toggled off via data, set the source data to an empty FeatureCollection (`{ type: 'FeatureCollection', features: [] }`).
## 2024-06-15 - React Context Lookups
**Learning:** Re-running array `.find()` lookups on each render inside mapped collections (e.g., in lists of items using context methods) introduces O(N*M) complexity, becoming a huge bottleneck on larger datasets (e.g., hundreds of catalog items).
**Action:** When filtering or mapping large collections in React Contexts, memoize lookup maps (O(1)) with `useMemo` and wrap the getter methods with `useCallback` to prevent expensive re-evaluations and unnecessary component re-renders.
