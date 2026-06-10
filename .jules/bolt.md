## 2023-10-25 - Prevented Unnecessary Render Cycles in Context
**Learning:** Found that `CatalogContext` wasn't memoizing its context value, which caused full re-renders for every subscriber (like `Catalog.tsx`, `MapPage.tsx`, `Landing.tsx`) on ANY state update, even minor ones. The `filteredDatasets` calculation was also running on every render instead of just when filters or data changed.
**Action:** Always memoize Context values with `useMemo` and extract derived state calculations inside `useMemo` when working with React Contexts that handle large datasets or arrays.
