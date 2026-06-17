import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { MapLayerState } from '../types';

interface MapState {
  activeLayers: MapLayerState[];
  selectedDatasetId: string | null;
  addLayer: (datasetId: string) => void;
  removeLayer: (datasetId: string) => void;
  toggleLayer: (datasetId: string) => void;
  setOpacity: (datasetId: string, opacity: number) => void;
  selectDataset: (id: string | null) => void;
  showAlerts: boolean;
  setShowAlerts: (v: boolean) => void;
}

const MapContext = createContext<MapState | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [activeLayers, setActiveLayers] = useState<MapLayerState[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  const addLayer = useCallback((datasetId: string) => {
    setActiveLayers((prev) => {
      if (prev.find((l) => l.datasetId === datasetId)) return prev;
      if (prev.length >= 8) return prev; // max layers guard
      return [...prev, { datasetId, visible: true, opacity: 1 }];
    });
  }, []);

  const removeLayer = useCallback((datasetId: string) => {
    setActiveLayers((prev) => prev.filter((l) => l.datasetId !== datasetId));
  }, []);

  const toggleLayer = useCallback((datasetId: string) => {
    setActiveLayers((prev) =>
      prev.map((l) => (l.datasetId === datasetId ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const setOpacity = useCallback((datasetId: string, opacity: number) => {
    setActiveLayers((prev) =>
      prev.map((l) => (l.datasetId === datasetId ? { ...l, opacity } : l))
    );
  }, []);

  const selectDataset = useCallback((id: string | null) => setSelectedDatasetId(id), []);

  const value = useMemo(() => ({
    activeLayers, selectedDatasetId, addLayer, removeLayer, toggleLayer, setOpacity, selectDataset, showAlerts, setShowAlerts
  }), [activeLayers, selectedDatasetId, addLayer, removeLayer, toggleLayer, setOpacity, selectDataset, showAlerts, setShowAlerts]);

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
