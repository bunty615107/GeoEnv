import { useNavigate } from 'react-router-dom';
import { Database, Map, AlertTriangle, BarChart3, Globe, Layers, Shield, Zap, ArrowRight } from 'lucide-react';
import { useCatalog } from '../contexts/CatalogContext';

const features = [
  {
    icon: Layers,
    title: 'Multi-Layer Model',
    desc: 'L1–L4 logical layers spanning spatial, meteorological, hydrological, and environmental domains.',
    color: '#6366f1',
  },
  {
    icon: Shield,
    title: 'Provenance-First',
    desc: 'Every dataset shows its provider, license, resolution, and temporal coverage upfront.',
    color: '#14b8a6',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    desc: 'No signup, no server. Open the app and start exploring 24+ curated global datasets.',
    color: '#f59e0b',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    desc: 'Data from ECMWF, NASA, ESA, NOAA, IMD and 8+ international agencies.',
    color: '#3b82f6',
  },
];

const actions = [
  { to: '/catalog', icon: Database, label: 'Browse Catalog', desc: 'Search and filter datasets by layer, aspect, and provider', color: '#6366f1' },
  { to: '/map', icon: Map, label: 'Open Map', desc: 'Visualize layers on an interactive WebGL map', color: '#14b8a6' },
  { to: '/alerts', icon: AlertTriangle, label: 'View Alerts', desc: 'Explore active hazard alerts and warning zones', color: '#ef4444' },
  { to: '/analysis', icon: BarChart3, label: 'AOI Analysis', desc: 'Run lightweight analysis on an area of interest', color: '#f59e0b' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { datasets, layers, providers } = useCatalog();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-dark text-text-on-dark">
        {/* Gradient orbs */}
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-info/10 blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[11px] font-semibold uppercase tracking-wider">
                Open Data Portal
              </span>
            </div>
            <h1 className="text-[2.5rem] md:text-[3.2rem] font-bold leading-[1.1] tracking-tight mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Unified Environmental
              <br />
              <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
                & Hazard Data
              </span>
            </h1>
            <p className="text-[16px] text-text-muted leading-relaxed mb-8 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover, visualize, and integrate global geospatial data across land, ocean, atmosphere, and hydrology — from one unified catalog with clear provenance.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('/catalog')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white text-[14px] font-semibold hover:bg-accent-hover transition-all cursor-pointer shadow-glow"
              >
                <Database size={16} />
                Explore Catalog
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/map')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-text-on-dark text-[14px] font-semibold hover:bg-white/15 transition-all cursor-pointer backdrop-blur-sm border border-white/10"
              >
                <Map size={16} />
                Open Map
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { value: datasets.length || '24+', label: 'Datasets' },
              { value: layers.length || '4', label: 'Layers (L1–L4)' },
              { value: providers.length || '12+', label: 'Agencies' },
              { value: '0', label: 'Server Required' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 backdrop-blur-sm">
                <div className="text-[24px] font-bold text-accent">{s.value}</div>
                <div className="text-[12px] text-text-muted uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-[22px] font-bold text-text-primary mb-2 text-center">Built for Professionals & Researchers</h2>
        <p className="text-[14px] text-text-secondary text-center mb-10 max-w-lg mx-auto">
          A single, trustworthy place to explore multi-layer geospatial data with clear provenance and zero setup.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-accent/30 transition-all duration-300 animate-slide-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: f.color + '15' }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-1">{f.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-surface-alt border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="text-[22px] font-bold text-text-primary mb-8 text-center">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.to)}
                className="text-left bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-accent/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: a.color + '15' }}>
                  <a.icon size={20} style={{ color: a.color }} />
                </div>
                <h3 className="text-[15px] font-semibold text-text-primary mb-1 flex items-center gap-1">
                  {a.label}
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                </h3>
                <p className="text-[13px] text-text-secondary">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
