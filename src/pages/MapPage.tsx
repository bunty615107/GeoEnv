import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Eye, EyeOff, Trash2, Layers, AlertTriangle, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';
import { useMap } from '../contexts/MapContext';
import { loadAlerts } from '../lib/data';

import type { Alert } from '../types';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { datasets, getLayer } = useCatalog();
  const { activeLayers, toggleLayer, removeLayer, setOpacity, selectedDatasetId, selectDataset, showAlerts, setShowAlerts } = useMap();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [78.9629, 20.5937], // India center
      zoom: 4,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 150 }), 'bottom-left');

    map.on('load', () => {
      setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load alerts
  useEffect(() => {
    loadAlerts().then(setAlerts).catch(console.error);
  }, []);

  // Initialize alert polygons source and layers once
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const sourceId = 'alerts-source';
    const layerId = 'alerts-fill';
    const outlineId = 'alerts-outline';

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        layout: { visibility: 'none' },
        paint: {
          'fill-color': [
            'match', ['get', 'severity'],
            'critical', '#ef4444',
            'severe', '#f97316',
            'moderate', '#f59e0b',
            '#3b82f6',
          ],
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: outlineId,
        type: 'line',
        source: sourceId,
        layout: { visibility: 'none' },
        paint: {
          'line-color': [
            'match', ['get', 'severity'],
            'critical', '#ef4444',
            'severe', '#f97316',
            'moderate', '#f59e0b',
            '#3b82f6',
          ],
          'line-width': 2,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickHandler = (e: any) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          new maplibregl.Popup({ closeButton: true, maxWidth: '280px' })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: Inter, sans-serif;">
                <div style="font-weight:600;font-size:13px;margin-bottom:4px;">${props?.title ?? 'Alert'}</div>
                <div style="font-size:11px;color:#64748b;">Type: ${props?.type ?? '—'}</div>
                <div style="font-size:11px;color:#64748b;">Severity: ${props?.severity ?? '—'}</div>
              </div>
            `)
            .addTo(map);
        }
      };

      const mouseEnterHandler = () => { map.getCanvas().style.cursor = 'pointer'; };
      const mouseLeaveHandler = () => { map.getCanvas().style.cursor = ''; };

      // Click handler
      map.on('click', layerId, clickHandler);
      map.on('mouseenter', layerId, mouseEnterHandler);
      map.on('mouseleave', layerId, mouseLeaveHandler);

      // We do not return cleanup function here to remove layer and source
      // because they are needed for the lifetime of the map
      // but we should remove event listeners when component unmounts
      // However the map instance is shared and will be destroyed anyway
      // So no strict cleanup of layers/sources is needed here.
    }
  }, [mapReady]);

  // Update alert polygons data dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const sourceId = 'alerts-source';
    const layerId = 'alerts-fill';
    const outlineId = 'alerts-outline';

    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (!source) return;

    // Toggle visibility
    const visibility = showAlerts && alerts.length > 0 ? 'visible' : 'none';
    if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', visibility);
    if (map.getLayer(outlineId)) map.setLayoutProperty(outlineId, 'visibility', visibility);

    if (showAlerts && alerts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const geojson: any = {
        type: 'FeatureCollection',
        features: alerts.map((a) => ({
          type: 'Feature' as const,
          geometry: a.geometry,
          properties: { id: a.id, title: a.title, severity: a.severity, type: a.type },
        })),
      };

      // Update data without rebuilding layer
      source.setData(geojson);
    }
  }, [showAlerts, alerts, mapReady]);

  const activeDatasets = activeLayers.map((l) => ({
    ...l,
    dataset: datasets.find((d) => d.id === l.datasetId),
  }));

  const selectedDs = selectedDatasetId ? datasets.find((d) => d.id === selectedDatasetId) : null;

  return (
    <div className="flex-1 flex relative overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-3 left-3 z-20 p-2 bg-white rounded-lg shadow-md border border-border hover:bg-surface-alt transition-colors cursor-pointer md:hidden"
        aria-label="Toggle layer panel"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRightIcon size={16} />}
      </button>

      {/* Layer sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-[280px] lg:w-[300px]' : 'w-0'} transition-all duration-300 bg-white border-r border-border overflow-hidden shrink-0 z-10 flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
            <Layers size={16} className="text-accent" />
            Active Layers
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            {activeLayers.length}/8 layers • Toggle visibility below
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Alert toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-danger-light border border-danger/20">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-danger" />
              <span className="text-[13px] font-medium text-text-primary">Alerts Layer</span>
            </div>
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${showAlerts ? 'bg-danger/10 text-danger' : 'bg-surface-alt text-text-muted'}`}
              aria-label={showAlerts ? 'Hide alerts' : 'Show alerts'}
            >
              {showAlerts ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>

          {activeDatasets.length === 0 && (
            <div className="text-center py-8 text-[13px] text-text-muted">
              No layers added yet.
              <br />
              <span className="text-[12px]">Browse the catalog to add layers.</span>
            </div>
          )}

          {activeDatasets.map(({ datasetId, visible, opacity, dataset }) => {
            if (!dataset) return null;
            const layer = getLayer(dataset.layerId);
            return (
              <div
                key={datasetId}
                className={`p-3 rounded-lg border transition-all ${
                  visible ? 'bg-white border-border' : 'bg-surface-alt border-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {layer && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />}
                    <span className="text-[13px] font-medium text-text-primary truncate">{dataset.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleLayer(datasetId)}
                      className="p-1 rounded hover:bg-surface-alt cursor-pointer transition-colors"
                      aria-label={visible ? 'Hide layer' : 'Show layer'}
                    >
                      {visible ? <Eye size={13} className="text-accent" /> : <EyeOff size={13} className="text-text-muted" />}
                    </button>
                    <button
                      onClick={() => removeLayer(datasetId)}
                      className="p-1 rounded hover:bg-danger-light cursor-pointer transition-colors"
                      aria-label="Remove layer"
                    >
                      <Trash2 size={13} className="text-text-muted hover:text-danger" />
                    </button>
                  </div>
                </div>
                {/* Opacity */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-text-muted w-10">Opacity</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={opacity}
                    onChange={(e) => setOpacity(datasetId, parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-accent"
                  />
                  <span className="text-[10px] text-text-muted w-6 text-right">{Math.round(opacity * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" id="map-container" />

        {/* Desktop sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute top-3 left-3 z-10 p-2 bg-white rounded-lg shadow-md border border-border hover:bg-surface-alt transition-colors cursor-pointer items-center justify-center"
          aria-label="Toggle layer panel"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <Layers size={14} />}
        </button>

        {/* Info bar */}
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-border px-3 py-1.5 text-[11px] text-text-secondary">
          {activeLayers.filter((l) => l.visible).length} layers visible
          {showAlerts && <span className="ml-2 text-danger">• Alerts on</span>}
        </div>
      </div>

      {/* Metadata panel (bottom) */}
      {selectedDs && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white border-t border-border p-4 shadow-lg animate-slide-in-up">
          <div className="max-w-[1200px] mx-auto flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-text-primary">{selectedDs.name}</h3>
              <p className="text-[12px] text-text-secondary mt-1">{selectedDs.description}</p>
              <div className="flex gap-3 mt-2 text-[11px] text-text-muted">
                <span>📐 {selectedDs.resolution}</span>
                <span>📄 {selectedDs.format}</span>
                <span>🌍 {selectedDs.spatialCoverage}</span>
              </div>
            </div>
            <button
              onClick={() => selectDataset(null)}
              className="p-1.5 rounded hover:bg-surface-alt cursor-pointer text-text-muted"
              aria-label="Close metadata"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
