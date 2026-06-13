## 2024-05-24 - Init
## 2024-05-24 - MapLibre GL JS Dynamic Data Updates
**Learning:** In React implementations using MapLibre GL JS, indiscriminately calling `removeLayer` and `removeSource` inside `useEffect` on state changes causes severe WebGL thrashing, redundant tile requests, and memory leaks from stale event listeners.
**Action:** Always maintain MapLibre map/source instances and use `map.getSource().setData(geojson)` for dynamic updates. Use empty GeoJSON collections to handle visibility/clear operations if necessary.
