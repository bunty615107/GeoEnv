// ─── Layer (L1–L4) ───
export interface Layer {
  id: string;
  name: string;
  level: number;
  description: string;
  color: string;
  icon: string;
}

// ─── Aspect (filter dimension) ───
export interface Aspect {
  id: string;
  name: string;
  type: string;
  description: string;
}

// ─── Provider / Agency ───
export interface Provider {
  id: string;
  name: string;
  fullName: string;
  country: string;
  url: string;
  category: string;
}

// ─── Dataset ───
export interface Dataset {
  id: string;
  name: string;
  layerId: string;
  providerId: string;
  aspects: string[];
  description: string;
  resolution: string;
  temporalCoverage: string;
  format: string;
  license: string;
  tags: string[];
  quality: string;
  spatialCoverage: string;
  primaryUrl?: string;
  accessMethod?: string;
}

// ─── Alert ───
export interface Alert {
  id: string;
  type: string;
  severity: 'critical' | 'severe' | 'moderate' | 'minor' | 'info';
  title: string;
  description: string;
  source: string;
  effectiveTime: string;
  expiryTime: string;
  geometry: GeoJSONPolygon;
  properties: Record<string, unknown>;
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// ─── Analysis ───
export interface AnalysisResult {
  id: string;
  aoiName: string;
  totalAreaSqKm: number;
  perimeterKm: number;
  overlappingDatasets: string[];
  activeLayers: string[];
  layerBreakdown: Record<string, number>;
  riskIndicators: {
    floodRisk: string;
    seismicRisk: string;
    airQuality: string;
    vegetationHealth: string;
  };
  insight: string;
}

// ─── User (mocked) ───
export interface User {
  id: string;
  name: string;
  org: string;
  role: 'admin' | 'analyst' | 'researcher' | 'viewer';
}

// ─── Filter State ───
export interface CatalogFilters {
  layerIds: string[];
  aspectIds: string[];
  providerIds: string[];
  searchQuery: string;
  licenses: string[];
}

// ─── Map State ───
export interface MapLayerState {
  datasetId: string;
  visible: boolean;
  opacity: number;
}
