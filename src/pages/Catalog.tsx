import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Map, ExternalLink, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';
import { useMap } from '../contexts/MapContext';

import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Dataset, Layer, Provider } from '../types';

export default function Catalog() {
  const { layers, aspects, providers, filters, filteredDatasets, loading, error, setFilters, resetFilters, getLayer, getProvider } = useCatalog();
  const { addLayer } = useMap();
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ layers: true, aspects: false, providers: false });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync search input when filters are reset externally
  // Disable eslint for this specific known pattern or rewrite it
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(filters.searchQuery);
  }, [filters.searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilters({ searchQuery: value }), 250);
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };



  const activeFilterCount = filters.layerIds.length + filters.aspectIds.length + filters.providerIds.length + (filters.searchQuery ? 1 : 0);

  const handleViewOnMap = useCallback((ds: Dataset) => {
    addLayer(ds.id);
    navigate('/map');
  }, [addLayer, navigate]);

  // Memoize handlers to prevent DatasetCard re-renders
  const handleSelectDataset = useCallback((ds: Dataset) => setSelectedDataset(ds), []);

  if (loading) return <LoadingSpinner text="Loading catalog…" />;
  if (error) return <div className="p-8 text-center text-danger">{error}</div>;



  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0">
      {/* Mobile filter toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <span className="text-[14px] font-semibold">{filteredDatasets.length} datasets</span>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-alt text-[13px] font-medium cursor-pointer"
        >
          <Filter size={14} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Sidebar filters */}
      <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-[280px] lg:w-[300px] border-r border-border bg-white overflow-y-auto shrink-0`}>
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search datasets…"
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-border bg-surface text-[13px] placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-colors"
              id="catalog-search"
            />
            {searchInput && (
              <button onClick={() => handleSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface-alt cursor-pointer">
                <X size={13} className="text-text-muted" />
              </button>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="w-full mb-4 py-1.5 rounded-lg text-[12px] text-accent font-medium hover:bg-accent-light transition-colors cursor-pointer">
              Clear all filters ({activeFilterCount})
            </button>
          )}

          {/* Layer filter */}
          <FilterSection title="Layers" expanded={expandedSections.layers} onToggle={() => toggleSection('layers')}>
            {layers.map((l) => (
              <FilterCheckbox
                key={l.id}
                label={l.name}
                sublabel={`L${l.level}`}
                checked={filters.layerIds.includes(l.id)}
                color={l.color}
                onChange={() => {
                  const ids = filters.layerIds.includes(l.id)
                    ? filters.layerIds.filter((id) => id !== l.id)
                    : [...filters.layerIds, l.id];
                  setFilters({ layerIds: ids });
                }}
              />
            ))}
          </FilterSection>

          {/* Aspect filter */}
          <FilterSection title="Aspects" expanded={expandedSections.aspects} onToggle={() => toggleSection('aspects')}>
            {aspects.map((a) => (
              <FilterCheckbox
                key={a.id}
                label={a.name}
                checked={filters.aspectIds.includes(a.id)}
                onChange={() => {
                  const ids = filters.aspectIds.includes(a.id)
                    ? filters.aspectIds.filter((id) => id !== a.id)
                    : [...filters.aspectIds, a.id];
                  setFilters({ aspectIds: ids });
                }}
              />
            ))}
          </FilterSection>

          {/* Provider filter */}
          <FilterSection title="Providers" expanded={expandedSections.providers} onToggle={() => toggleSection('providers')}>
            {providers.map((p) => (
              <FilterCheckbox
                key={p.id}
                label={p.name}
                sublabel={p.country}
                checked={filters.providerIds.includes(p.id)}
                onChange={() => {
                  const ids = filters.providerIds.includes(p.id)
                    ? filters.providerIds.filter((id) => id !== p.id)
                    : [...filters.providerIds, p.id];
                  setFilters({ providerIds: ids });
                }}
              />
            ))}
          </FilterSection>
        </div>
      </aside>

      {/* Dataset grid */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6" id="catalog-results">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-text-primary">
            Dataset Catalog
            <span className="text-text-muted font-normal text-[14px] ml-2">({filteredDatasets.length})</span>
          </h1>
        </div>

        {filteredDatasets.length === 0 ? (
          <EmptyState
            title="No datasets match your filters"
            description="Try broadening your search, removing some filters, or checking a different layer."
            action={{ label: 'Clear all filters', onClick: resetFilters }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDatasets.map((ds, i) => {
              const layer = getLayer(ds.layerId);
              const provider = getProvider(ds.providerId);
              return (
                <DatasetCard
                  key={ds.id}
                  ds={ds}
                  i={i}
                  layer={layer}
                  provider={provider}
                  onSelect={handleSelectDataset}
                  onViewOnMap={handleViewOnMap}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Dataset detail drawer */}
      <Drawer open={!!selectedDataset} onClose={() => setSelectedDataset(null)} title={selectedDataset?.name ?? 'Dataset Details'}>
        {selectedDataset && <DatasetDetail dataset={selectedDataset} onViewOnMap={handleViewOnMap} />}
      </Drawer>
    </div>
  );
}

/* ─── Sub-components ─── */


// ⚡ Bolt: Memoize DatasetCard to prevent O(N) re-renders when parent state (like selectedDataset) changes
const DatasetCard = memo(function DatasetCard({
  ds, i, layer, provider, onSelect, onViewOnMap
}: {
  ds: Dataset;
  i: number;
  layer?: Layer;
  provider?: Provider;
  onSelect: (ds: Dataset) => void;
  onViewOnMap: (ds: Dataset) => void;
}) {
  return (
    <article
      className="bg-white rounded-xl border border-border p-4 hover:shadow-md hover:border-accent/30 transition-all duration-200 cursor-pointer animate-fade-in flex flex-col"
      style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
      onClick={() => onSelect(ds)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${ds.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(ds)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-text-primary truncate">{ds.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {layer && (
              <Badge color={layer.color} bg={layer.color + '15'}>
                L{layer.level}
              </Badge>
            )}
            <span className="text-[11px] text-text-muted">{provider?.name}</span>
          </div>
        </div>
        <Badge
          color={ds.quality === 'Operational' ? '#f59e0b' : ds.quality === 'Research' ? '#8b5cf6' : '#22c55e'}
          bg={ds.quality === 'Operational' ? '#fffbeb' : ds.quality === 'Research' ? '#f5f3ff' : '#f0fdf4'}
        >
          {ds.quality}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-[12px] text-text-secondary leading-relaxed mb-3 flex-1 line-clamp-2">
        {ds.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted mb-3">
        <span>📐 {ds.resolution}</span>
        <span>📄 {ds.format}</span>
        <span>🌍 {ds.spatialCoverage}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {ds.tags.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded bg-surface-alt text-[10px] text-text-secondary">
            {t}
          </span>
        ))}
        {ds.tags.length > 4 && (
          <span className="px-2 py-0.5 rounded bg-surface-alt text-[10px] text-text-muted">
            +{ds.tags.length - 4}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewOnMap(ds);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-medium hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <Map size={12} />
          View on Map
        </button>
      </div>
    </article>
  );
});

function FilterSection({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-3 border-b border-border pb-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-1.5 text-[13px] font-semibold text-text-primary cursor-pointer hover:text-accent transition-colors"
      >
        {title}
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {expanded && <div className="mt-2 space-y-1">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, sublabel, checked, color, onChange }: { label: string; sublabel?: string; checked: boolean; color?: string; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-alt cursor-pointer transition-colors">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-accent w-3.5 h-3.5 rounded" />
      {color && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />}
      <span className="text-[13px] text-text-primary flex-1 truncate">{label}</span>
      {sublabel && <span className="text-[11px] text-text-muted">{sublabel}</span>}
    </label>
  );
}

function DatasetDetail({ dataset: ds, onViewOnMap }: { dataset: Dataset; onViewOnMap: (ds: Dataset) => void }) {
  const { getLayer, getProvider, aspects } = useCatalog();
  const layer = getLayer(ds.layerId);
  const provider = getProvider(ds.providerId);
  const dsAspects = aspects.filter((a) => ds.aspects.includes(a.id));

  return (
    <div className="space-y-5">
      {/* Layer + Quality */}
      <div className="flex items-center gap-2 flex-wrap">
        {layer && <Badge color={layer.color} bg={layer.color + '15'}>L{layer.level} — {layer.name}</Badge>}
        <Badge>{ds.quality}</Badge>
      </div>

      {/* Description */}
      <p className="text-[14px] text-text-secondary leading-relaxed">{ds.description}</p>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetaField label="Provider" value={provider?.fullName ?? ds.providerId} />
        <MetaField label="Resolution" value={ds.resolution} />
        <MetaField label="Temporal" value={ds.temporalCoverage} />
        <MetaField label="Format" value={ds.format} />
        <MetaField label="Coverage" value={ds.spatialCoverage} />
        <MetaField label="License" value={ds.license} />
      </div>

      {/* Aspects */}
      <div>
        <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-2">Aspects</h4>
        <div className="flex flex-wrap gap-1.5">
          {dsAspects.map((a) => (
            <Badge key={a.id} bg="#f1f5f9" color="#475569">{a.name}</Badge>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-2">Tags</h4>
        <div className="flex flex-wrap gap-1.5">
          {ds.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-surface-alt text-[11px] text-text-secondary">{t}</span>
          ))}
        </div>
      </div>

      {/* Provider link */}
      {provider && (
        <a
          href={provider.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[13px] text-accent hover:underline no-underline"
        >
          <ExternalLink size={13} />
          {provider.name} Portal
        </a>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => onViewOnMap(ds)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-white text-[13px] font-semibold hover:bg-accent-hover transition-colors cursor-pointer flex-1 justify-center"
        >
          <Map size={15} />
          View on Map
        </button>
      </div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{label}</dt>
      <dd className="text-[13px] text-text-primary mt-0.5">{value}</dd>
    </div>
  );
}
