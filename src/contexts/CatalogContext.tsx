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

  // ⚡ Bolt: Create O(1) lookup maps to prevent O(n) find() during renders
  const layersById = useMemo(() => {
    const map = new Map<string, Layer>();
    layers.forEach(l => map.set(l.id, l));
    return map;
  }, [layers]);

  const providersById = useMemo(() => {
    const map = new Map<string, Provider>();
    providers.forEach(p => map.set(p.id, p));
    return map;
  }, [providers]);

  // ⚡ Bolt: O(1) hash map lookups instead of O(n) array.find()
  const getLayer = useCallback((id: string) => layersById.get(id), [layersById]);
  const getProvider = useCallback((id: string) => providersById.get(id), [providersById]);

  // ⚡ Bolt: Memoize the context value to prevent unnecessary re-renders in consumers
  const value = useMemo(() => ({
    layers, aspects, datasets, providers, filters, filteredDatasets, loading, error, setFilters, resetFilters, getLayer, getProvider
  }), [layers, aspects, datasets, providers, filters, filteredDatasets, loading, error, setFilters, resetFilters, getLayer, getProvider]);

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
