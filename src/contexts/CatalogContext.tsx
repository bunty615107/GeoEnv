import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { Layer, Aspect, Dataset, Provider, CatalogFilters } from '../types';
import { loadLayers, loadAspects, loadDatasets, loadProviders } from '../lib/data';

interface CatalogState {
  layers: Layer[];
  aspects: Aspect[];
  datasets: Dataset[];
  providers: Provider[];
  filters: CatalogFilters;
  filteredDatasets: Dataset[];
  loading: boolean;
  error: string | null;
  setFilters: (f: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  getLayer: (id: string) => Layer | undefined;
  getProvider: (id: string) => Provider | undefined;
}

const defaultFilters: CatalogFilters = {
  layerIds: [],
  aspectIds: [],
  providerIds: [],
  searchQuery: '',
  licenses: [],
};

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filters, setFiltersState] = useState<CatalogFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([loadLayers(), loadAspects(), loadDatasets(), loadProviders()])
      .then(([l, a, d, p]) => {
        setLayers(l);
        setAspects(a);
        setDatasets(d);
        setProviders(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const setFilters = useCallback((partial: Partial<CatalogFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => setFiltersState(defaultFilters), []);

  const filteredDatasets = useMemo(() => {
    return datasets.filter((ds) => {
      if (filters.layerIds.length > 0 && !filters.layerIds.includes(ds.layerId)) return false;
      if (filters.aspectIds.length > 0 && !filters.aspectIds.some((a) => ds.aspects.includes(a))) return false;
      if (filters.providerIds.length > 0 && !filters.providerIds.includes(ds.providerId)) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const haystack = `${ds.name} ${ds.description} ${ds.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [datasets, filters]);

  // Optimize lookups: O(1) map lookups instead of O(N) array .find() calls
  const layerMap = useMemo(() => new Map(layers.map(l => [l.id, l])), [layers]);
  const providerMap = useMemo(() => new Map(providers.map(p => [p.id, p])), [providers]);

  const getLayer = useCallback((id: string) => layerMap.get(id), [layerMap]);
  const getProvider = useCallback((id: string) => providerMap.get(id), [providerMap]);

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
