## 2024-05-15 - MapLibre Layers Lifecycle
**Learning:** Tearing down and rebuilding MapLibre layers and sources using `removeLayer` / `removeSource` and `addLayer` / `addSource` in a `useEffect` dependency array when data changes causes extreme WebGL thrashing and severe memory leaks (due to event listeners being repeatedly reattached without cleanup).
**Action:** Always initialize MapLibre sources and layers once. Update map data dynamically using `source.setData()` and manipulate layer properties with `map.setLayoutProperty()` for visibility changes.
