## 2024-06-10 - MapLibre GeoJSON Source Updates
**Learning:** Removing and re-adding MapLibre layers (`removeLayer`, `addLayer`) and sources on state changes causes severe WebGL buffer thrashing and accumulates duplicate event listeners (`map.on`), leading to memory leaks and dropped frames.
**Action:** Always use `source.setData()` to update map data dynamically instead of tearing down and rebuilding the layer and its listeners.
