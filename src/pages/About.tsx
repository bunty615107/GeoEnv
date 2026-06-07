import { ExternalLink, Globe, Shield, BookOpen, Database, Users } from 'lucide-react';

const dataSources = [
  { name: 'ECMWF / Copernicus', desc: 'ERA5 Reanalysis, ERA5-Land, GloFAS, CAMS', url: 'https://www.ecmwf.int', license: 'Copernicus License (free, attribution)' },
  { name: 'NASA', desc: 'SRTM DEM, GRACE Groundwater, FIRMS Active Fire, GPM IMERG, MODIS NDVI', url: 'https://www.nasa.gov', license: 'Public Domain' },
  { name: 'ESA', desc: 'WorldCover 10m, Sentinel-2 MSI', url: 'https://www.esa.int', license: 'CC-BY 4.0 / Copernicus' },
  { name: 'NOAA', desc: 'Natural Earth, GFS Forecast, IBTrACS, USGS Earthquakes, Volcanoes', url: 'https://www.noaa.gov', license: 'Public Domain' },
  { name: 'GEBCO', desc: 'GEBCO_2023 Global Bathymetry Grid', url: 'https://www.gebco.net', license: 'Open (attribution required)' },
  { name: 'WWF / HydroSHEDS', desc: 'HydroBASINS, HydroRIVERS, HydroSHEDS', url: 'https://www.hydrosheds.org', license: 'Free for non-commercial use' },
  { name: 'IMD', desc: 'Gridded Rainfall, Climate Normals', url: 'https://mausam.imd.gov.in', license: 'Government of India' },
  { name: 'JAXA', desc: 'ALOS World 3D DEM (AW3D30)', url: 'https://global.jaxa.jp', license: 'Free (registration)' },
  { name: 'VLIZ / Marine Regions', desc: 'EEZ Boundaries, IHO Seas', url: 'https://www.marineregions.org', license: 'CC-BY 4.0' },
  { name: 'JRC / EC', desc: 'Global Surface Water, GloFAS', url: 'https://global-surface-water.appspot.com', license: 'Copernicus' },
  { name: 'OpenAQ', desc: 'Global Air Quality Measurements', url: 'https://openaq.org', license: 'CC-BY 4.0' },
  { name: 'UNEP-WCMC / IUCN', desc: 'World Database on Protected Areas (WDPA)', url: 'https://www.protectedplanet.net', license: 'Non-commercial' },
];

export default function About() {
  return (
    <div className="flex-1 max-w-[1000px] mx-auto px-6 py-10">
      <h1 className="text-[28px] font-bold text-text-primary mb-2 flex items-center gap-2">
        <Globe size={24} className="text-accent" />
        About GeoEnv Hub
      </h1>
      <p className="text-[15px] text-text-secondary leading-relaxed mb-10 max-w-2xl">
        GeoEnv Hub is a web-first GIS portal that unifies multi-layer environmental and hazard data into one logically structured catalog. Designed for disaster management analysts, climate researchers, and environmental professionals.
      </p>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-[18px] font-bold text-text-primary mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          Mission
        </h2>
        <div className="bg-white rounded-xl border border-border p-5 space-y-3">
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Environmental professionals and researchers today face a fragmented data landscape — dozens of portals, inconsistent metadata, unclear licensing, and no unified way to discover what datasets exist for a given region and variable.
          </p>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            GeoEnv Hub addresses this by providing a <strong>consistent L1–L4 layer model</strong> (Spatial Base, Meteorology, Hydrology, Environment) with <strong>clear provenance</strong> for every dataset — provider, license, resolution, temporal coverage, and access method.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-10">
        <h2 className="text-[18px] font-bold text-text-primary mb-3 flex items-center gap-2">
          <Database size={18} className="text-accent" />
          Layer Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'L1', name: 'Spatial Base', desc: 'Topography, bathymetry, boundaries, coastlines, EEZs', color: '#6366f1' },
            { id: 'L2', name: 'Meteorology & Climate', desc: 'Temperature, precipitation, wind, reanalysis, forecasts', color: '#f59e0b' },
            { id: 'L3', name: 'Hydrology & Water', desc: 'River basins, discharge, floods, groundwater, surface water', color: '#3b82f6' },
            { id: 'L4', name: 'Environment & Hazards', desc: 'Land cover, air quality, fire, earthquakes, volcanoes', color: '#22c55e' },
          ].map((l) => (
            <div key={l.id} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: l.color + '15' }}>
                <span className="text-[14px] font-bold" style={{ color: l.color }}>{l.id}</span>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-text-primary">{l.name}</h3>
                <p className="text-[12px] text-text-secondary mt-0.5">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-10">
        <h2 className="text-[18px] font-bold text-text-primary mb-3 flex items-center gap-2">
          <Users size={18} className="text-accent" />
          Data Sources & Providers
        </h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-surface-alt border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary">Provider</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary hidden md:table-cell">Datasets</th>
                <th className="text-left px-4 py-2.5 font-semibold text-text-primary hidden lg:table-cell">License</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dataSources.map((s) => (
                <tr key={s.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{s.name}</td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{s.desc}</td>
                  <td className="px-4 py-3 text-text-muted hidden lg:table-cell text-[12px]">{s.license}</td>
                  <td className="px-4 py-3">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover" aria-label={`Visit ${s.name}`}>
                      <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Technical */}
      <section className="mb-10">
        <h2 className="text-[18px] font-bold text-text-primary mb-3 flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          Technical Notes
        </h2>
        <div className="bg-white rounded-xl border border-border p-5 space-y-2 text-[13px] text-text-secondary">
          <p>• <strong>No server required</strong> — runs entirely in the browser from static files.</p>
          <p>• <strong>No API keys</strong> — uses free, CORS-enabled public tile sources.</p>
          <p>• <strong>No data collection</strong> — no analytics, cookies, or tracking.</p>
          <p>• <strong>Map tiles</strong> — provided by OpenFreeMap (OpenStreetMap data, ODbL license).</p>
          <p>• <strong>Built with</strong> — React, Vite, MapLibre GL JS, Tailwind CSS.</p>
          <p>• <strong>WCAG 2.1 AA</strong> — keyboard navigable, screen reader accessible, sufficient contrast.</p>
        </div>
      </section>
    </div>
  );
}
