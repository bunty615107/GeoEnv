import { useState } from 'react';
import { BarChart3, MapPin, Layers, Activity, AlertTriangle, Leaf, Droplets, Mountain } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';
import Badge from '../components/ui/Badge';

// Predefined AOI regions for mock analysis
const presetAois = [
  { id: 'coastal-odisha', name: 'Coastal Odisha', bbox: '84.5°E – 87.5°E, 19°N – 22°N' },
  { id: 'delhi-ncr', name: 'Delhi NCR', bbox: '76.8°E – 77.5°E, 28.3°N – 28.9°N' },
  { id: 'kerala-coast', name: 'Kerala Coast', bbox: '75.5°E – 77°E, 8.2°N – 12.8°N' },
  { id: 'uttarakhand', name: 'Uttarakhand Hills', bbox: '78.5°E – 80.5°E, 29.5°N – 31°N' },
];

const mockAnalysisData: Record<string, {
  totalAreaSqKm: number;
  perimeterKm: number;
  overlappingDatasets: string[];
  layerBreakdown: Record<string, number>;
  riskIndicators: { label: string; level: string; icon: React.ElementType; color: string }[];
  insight: string;
}> = {
  'coastal-odisha': {
    totalAreaSqKm: 12450,
    perimeterKm: 520,
    overlappingDatasets: ['ds-gebco-2023', 'ds-era5', 'ds-glofas', 'ds-worldcover', 'ds-firms'],
    layerBreakdown: { L1: 3, L2: 2, L3: 2, L4: 2 },
    riskIndicators: [
      { label: 'Flood Risk', level: 'High', icon: Droplets, color: '#ef4444' },
      { label: 'Seismic Risk', level: 'Moderate', icon: Mountain, color: '#f59e0b' },
      { label: 'Air Quality', level: 'Moderate', icon: Activity, color: '#f59e0b' },
      { label: 'Vegetation', level: 'Good', icon: Leaf, color: '#22c55e' },
    ],
    insight: 'This coastal AOI has high flood risk due to proximity to Mahanadi delta and active cyclone tracks. 5 datasets provide direct coverage across all 4 layers.',
  },
  'delhi-ncr': {
    totalAreaSqKm: 1484,
    perimeterKm: 180,
    overlappingDatasets: ['ds-era5', 'ds-cams-aq', 'ds-worldcover', 'ds-ndvi-modis'],
    layerBreakdown: { L1: 1, L2: 2, L3: 0, L4: 3 },
    riskIndicators: [
      { label: 'Flood Risk', level: 'Low', icon: Droplets, color: '#22c55e' },
      { label: 'Seismic Risk', level: 'High', icon: Mountain, color: '#ef4444' },
      { label: 'Air Quality', level: 'Severe', icon: Activity, color: '#ef4444' },
      { label: 'Vegetation', level: 'Poor', icon: Leaf, color: '#ef4444' },
    ],
    insight: 'Critical air quality concerns — AQI regularly exceeds 400. Located in Seismic Zone IV. CAMS provides real-time atmospheric composition data.',
  },
  'kerala-coast': {
    totalAreaSqKm: 15800,
    perimeterKm: 610,
    overlappingDatasets: ['ds-gebco-2023', 'ds-era5', 'ds-glofas', 'ds-worldcover', 'ds-hydrobasins'],
    layerBreakdown: { L1: 2, L2: 2, L3: 3, L4: 2 },
    riskIndicators: [
      { label: 'Flood Risk', level: 'Very High', icon: Droplets, color: '#ef4444' },
      { label: 'Seismic Risk', level: 'Low', icon: Mountain, color: '#22c55e' },
      { label: 'Air Quality', level: 'Good', icon: Activity, color: '#22c55e' },
      { label: 'Vegetation', level: 'Excellent', icon: Leaf, color: '#22c55e' },
    ],
    insight: 'High flood and landslide risk during monsoon season. Dense hydrological network with multiple basin intersections. Strong vegetation cover.',
  },
  'uttarakhand': {
    totalAreaSqKm: 8400,
    perimeterKm: 430,
    overlappingDatasets: ['ds-srtm', 'ds-era5', 'ds-firms', 'ds-worldcover', 'ds-ndvi-modis'],
    layerBreakdown: { L1: 2, L2: 1, L3: 1, L4: 3 },
    riskIndicators: [
      { label: 'Flood Risk', level: 'Moderate', icon: Droplets, color: '#f59e0b' },
      { label: 'Seismic Risk', level: 'Very High', icon: Mountain, color: '#ef4444' },
      { label: 'Air Quality', level: 'Good', icon: Activity, color: '#22c55e' },
      { label: 'Vegetation', level: 'Good', icon: Leaf, color: '#22c55e' },
    ],
    insight: 'Seismic Zone V — highest earthquake risk. Active wildfire zone in pre-monsoon season. FIRMS satellite data shows seasonal hotspot patterns.',
  },
};

export default function Analysis() {
  const { getDataset } = useCatalog();
  const [selectedAoi, setSelectedAoi] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof mockAnalysisData[string] | null>(null);

  const runAnalysis = (aoiId: string) => {
    setSelectedAoi(aoiId);
    setAnalyzing(true);
    setResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      setResult(mockAnalysisData[aoiId] ?? null);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="flex-1 max-w-[1200px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-text-primary flex items-center gap-2">
          <BarChart3 size={22} className="text-accent" />
          AOI Analysis
        </h1>
        <p className="text-[14px] text-text-secondary mt-1">
          Select a predefined area of interest to run a lightweight environmental analysis. Results are computed locally in the browser.
        </p>
      </div>

      {/* AOI selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {presetAois.map((aoi) => (
          <button
            key={aoi.id}
            onClick={() => runAnalysis(aoi.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedAoi === aoi.id
                ? 'border-accent bg-accent-light shadow-glow'
                : 'border-border bg-white hover:border-accent/30 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className={selectedAoi === aoi.id ? 'text-accent' : 'text-text-muted'} />
              <span className="text-[14px] font-semibold text-text-primary">{aoi.name}</span>
            </div>
            <span className="text-[11px] text-text-muted">{aoi.bbox}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
            <Layers size={24} className="text-accent animate-spin" />
          </div>
          <p className="text-[14px] text-text-secondary">Analyzing layers and datasets…</p>
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Total Area" value={`${result.totalAreaSqKm.toLocaleString()} km²`} />
            <SummaryCard label="Perimeter" value={`${result.perimeterKm} km`} />
            <SummaryCard label="Overlapping Datasets" value={String(result.overlappingDatasets.length)} />
            <SummaryCard label="Layer Coverage" value={`${Object.values(result.layerBreakdown).filter((v) => v > 0).length}/4`} />
          </div>

          {/* Risk indicators */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
              <AlertTriangle size={15} className="text-warning" />
              Risk Indicators
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.riskIndicators.map((ri) => (
                <div key={ri.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface-alt">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: ri.color + '15' }}>
                    <ri.icon size={18} style={{ color: ri.color }} />
                  </div>
                  <div>
                    <div className="text-[11px] text-text-muted">{ri.label}</div>
                    <div className="text-[13px] font-semibold" style={{ color: ri.color }}>{ri.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Layer breakdown */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-4">Layer Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(result.layerBreakdown).map(([layer, count]) => {
                const colors: Record<string, string> = { L1: '#6366f1', L2: '#f59e0b', L3: '#3b82f6', L4: '#22c55e' };
                const names: Record<string, string> = { L1: 'Spatial Base', L2: 'Meteorology', L3: 'Hydrology', L4: 'Environment' };
                const maxCount = Math.max(...Object.values(result.layerBreakdown));
                return (
                  <div key={layer} className="flex items-center gap-3">
                    <Badge color={colors[layer]} bg={colors[layer] + '15'}>{layer}</Badge>
                    <span className="text-[13px] text-text-secondary w-28">{names[layer]}</span>
                    <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%', backgroundColor: colors[layer] }}
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-text-primary w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Datasets */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-[15px] font-semibold text-text-primary mb-3">Overlapping Datasets</h3>
            <div className="flex flex-wrap gap-2">
              {result.overlappingDatasets.map((dsId) => {
                const ds = getDataset(dsId);
                return ds ? (
                  <span key={dsId} className="px-3 py-1.5 rounded-lg bg-surface-alt text-[12px] text-text-primary border border-border">
                    {ds.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Insight */}
          <div className="bg-accent-light rounded-xl border border-accent/20 p-5">
            <h3 className="text-[14px] font-semibold text-accent mb-2">💡 Analysis Insight</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">{result.insight}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-text-muted text-center mt-8 max-w-lg mx-auto">
        This analysis is a front-end demonstration using precomputed mock data. In production, these results would come from server-side spatial analysis.
      </p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[20px] font-bold text-text-primary">{value}</div>
    </div>
  );
}
