## 2024-05-24 - MapLibre WebGL Thrashing Anti-pattern
**Learning:** Tearing down and rebuilding layers/sources on every render/state change causes WebGL thrashing and event listener memory leaks.
**Action:** Always use `source.setData()` to update map data dynamically instead of `removeLayer`/`addLayer`.
