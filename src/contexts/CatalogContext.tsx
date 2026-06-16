import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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

  const setFilters = (partial: Partial<CatalogFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  };
  const resetFilters = () => setFiltersState(defaultFilters);

  // Pre-computed search index: rebuilt only when datasets change, not on every filter update
  const searchIndex = useMemo(
    () => new Map(datasets.map((ds) => [ds.id, `${ds.name} ${ds.description} ${ds.tags.join(' ')}`.toLowerCase()])),
    [datasets]
  );

  const filteredDatasets = useMemo(() => {
    return datasets.filter((ds) => {
      if (filters.layerIds.length > 0 && !filters.layerIds.includes(ds.layerId)) return false;
      if (filters.aspectIds.length > 0 && !filters.aspectIds.some((a) => ds.aspects.includes(a))) return false;
      if (filters.providerIds.length > 0 && !filters.providerIds.includes(ds.providerId)) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!searchIndex.get(ds.id)?.includes(q)) return false;
      }
      return true;
    });
  }, [datasets, filters, searchIndex]);

  const getLayer = (id: string) => layers.find((l) => l.id === id);
  const getProvider = (id: string) => providers.find((p) => p.id === id);

  return (
    <CatalogContext.Provider
      value={{ layers, aspects, datasets, providers, filters, filteredDatasets, loading, error, setFilters, resetFilters, getLayer, getProvider }}
    >
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
