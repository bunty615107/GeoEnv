import { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { loadAlerts, getSeverityColor, formatDate } from '../lib/data';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Alert } from '../types';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const miniMapContainer = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    loadAlerts()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mini-map initialization
  useEffect(() => {
    if (!miniMapContainer.current || miniMapRef.current) return;

    const map = new maplibregl.Map({
      container: miniMapContainer.current,
      style: MAP_STYLE,
      center: [0, 0],
      zoom: 1,
      interactive: true,
      attributionControl: false,
    });

    map.on('load', () => {
      setMapReady(true);
    });

    miniMapRef.current = map;

    return () => {
      map.remove();
      miniMapRef.current = null;
    };
  }, []);

  // Mini-map update for selected alert
  useEffect(() => {
    const map = miniMapRef.current;
    if (!map || !mapReady || !selectedAlert) return;

    const sc = getSeverityColor(selectedAlert.severity);
    const sourceId = 'alert-area';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geojson: any = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: selectedAlert.geometry,
          properties: {},
        },
      ],
    };

    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      source.setData(geojson);
      map.setPaintProperty('alert-fill', 'fill-color', sc.text);
      map.setPaintProperty('alert-outline', 'line-color', sc.text);
    } else {
      map.addSource(sourceId, { type: 'geojson', data: geojson });

      map.addLayer({
        id: 'alert-fill',
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': sc.text, 'fill-opacity': 0.2 },
      });

      map.addLayer({
        id: 'alert-outline',
        type: 'line',
        source: sourceId,
        paint: { 'line-color': sc.text, 'line-width': 2.5 },
      });
    }

    // Fit bounds
    const coords = selectedAlert.geometry.coordinates[0];
    const bounds = coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new maplibregl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
    );
    map.fitBounds(bounds, { padding: 40 });
  }, [selectedAlert, mapReady]);

  if (loading) return <LoadingSpinner text="Loading alerts…" />;

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Alert list */}
      <div className="lg:w-[420px] xl:w-[480px] border-r border-border overflow-y-auto bg-white shrink-0">
        <div className="p-5 border-b border-border">
          <h1 className="text-[20px] font-bold text-text-primary flex items-center gap-2">
            <AlertTriangle size={20} className="text-danger" />
            Active Alerts
          </h1>
          <p className="text-[13px] text-text-secondary mt-1">
            {alerts.length} hazard alerts from mock CAP data
          </p>
        </div>

        <div className="divide-y divide-border">
          {alerts.map((alert, i) => {
            const sc = getSeverityColor(alert.severity);
            const isSelected = selectedAlert?.id === alert.id;
            return (
              <button
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`w-full text-left p-4 transition-all cursor-pointer animate-fade-in ${
                  isSelected ? 'bg-accent-light border-l-3 border-l-accent' : 'hover:bg-surface-alt'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[14px] font-semibold text-text-primary leading-snug">{alert.title}</h3>
                  <Badge color={sc.text} bg={sc.bg}>{alert.severity}</Badge>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-text-muted mb-2">
                  <span className="flex items-center gap-1"><AlertTriangle size={10} />{alert.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{alert.source}</span>
                </div>
                <p className="text-[12px] text-text-secondary line-clamp-2 leading-relaxed">{alert.description}</p>
                <div className="flex items-center gap-1 text-[11px] text-text-muted mt-2">
                  <Clock size={10} />
                  {formatDate(alert.effectiveTime)} — {formatDate(alert.expiryTime)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail + map */}
      <div className="flex-1 flex flex-col">
        {selectedAlert ? (
          <>
            {/* Mini-map */}
            <div ref={miniMapContainer} className="h-[300px] lg:h-[400px]" id="alert-mini-map" />

            {/* Detail panel */}
            <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  {(() => { const sc = getSeverityColor(selectedAlert.severity); return <Badge color={sc.text} bg={sc.bg}>{selectedAlert.severity}</Badge>; })()}
                  <Badge>{selectedAlert.type}</Badge>
                </div>
                <h2 className="text-[20px] font-bold text-text-primary mb-3">{selectedAlert.title}</h2>
                <p className="text-[14px] text-text-secondary leading-relaxed mb-4">{selectedAlert.description}</p>

                {/* Properties */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <MetaField label="Source" value={selectedAlert.source} />
                  <MetaField label="Type" value={selectedAlert.type} />
                  <MetaField label="Effective" value={formatDate(selectedAlert.effectiveTime)} />
                  <MetaField label="Expires" value={formatDate(selectedAlert.expiryTime)} />
                  {Object.entries(selectedAlert.properties).map(([k, v]) => (
                    <MetaField key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
            <AlertTriangle size={40} className="mb-3 opacity-30" />
            <p className="text-[14px]">Select an alert to view details and map</p>
          </div>
        )}
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

