## 2024-06-12 - Missing Memoization in React Context
**Learning:** Found an un-memoized expensive calculation (`filteredDatasets`) inside `CatalogContext.tsx`. Context providers run frequently when any state changes, causing all consumers to re-calculate this derived state on every render, which is an O(n) operation per layer/filter update.
**Action:** Always wrap expensive derived state (like `.filter()`, `.reduce()`, or complex `.map()`) inside `useMemo` when providing it via React Context, especially when dealing with lists of items or configuration options.
