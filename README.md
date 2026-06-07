# GeoEnv Hub — Environmental & Hazard Data Portal

GeoEnv Hub is a web-first, minimalist Geographic Information System (GIS) portal designed to unify fragmented geospatial data. It aggregates multi-layer environmental, meteorological, hydrological, and natural hazard datasets into a single, cohesive, client-side application. 

Developed specifically for disaster management analysts, climate researchers, and environmental professionals, GeoEnv Hub operates as a plug-and-play static Single Page Application (SPA).

---

## 🌎 What It Is
GeoEnv Hub is an interactive dashboard and data catalog that brings together geospatial information from multiple global agencies (like NASA, ESA, NOAA, ECMWF, and JAXA). 

Instead of jumping between dozens of disconnected government portals, GeoEnv Hub organizes datasets under a standard **L1–L4 layer architecture**:
- **L1: Spatial Base** (Topography, bathymetry, administrative boundaries, coastlines, EEZs)
- **L2: Meteorology & Climate** (Temperature, rainfall, wind, climate reanalysis, forecasts)
- **L3: Hydrology & Water** (River networks, basins, surface water, groundwater, discharge)
- **L4: Environment & Hazards** (Land cover, air quality, active fires, earthquakes, volcanic eruptions)

---

## ⚙️ What It Does
1. **Interactive Geospatial Catalog**: Lists and describes over 24 global datasets with **provenance-first metadata**, stating the provider, resolution, license terms, temporal coverage, and access methods upfront.
2. **WebGL-Powered Map Viewer**: Leverages **MapLibre GL JS** to visualize map layers and hazards interactively in the browser.
3. **Area of Interest (AOI) Analysis**: Allows users to draw or select a region to compute and simulate spatial stats (e.g., elevation distributions, rainfall averages, population exposure) client-side.
4. **Real-time Environmental Warnings & Alerts**: Synthesizes real-time natural hazard events (floods, earthquakes, wildfires, storms) on the map interface with severe/critical alerts matching geographic locations.
5. **Completely Serverless Operations**: Runs entirely client-side using free, CORS-enabled public tile sources—no backend database, user tracking, or private API keys required.

---

## 💡 Why It Is Helpful (Value Proposition)
- **Solves Data Fragmentation**: Eliminates the need to navigate multiple complicated data portals by gathering everything under a clean, unified interface.
- **Speeds Up Analysis & Decision-Making**: Environmental professionals and field responders can instantly visualize regional datasets and hazard risks in seconds.
- **No-Install, Zero-Config Access**: Because it operates serverless and supports standard protocols, it is easy to host, runs fast, and can even be run locally via standard browser file paths.
- **Trust & Transparency**: Focuses heavily on provenance. Researchers can easily track where data came from, what license applies, and how to query the original source directly.
- **Privacy-First & Accessible**: No telemetry or third-party cookies. Fully built following **WCAG 2.1 AA** guidelines, ensuring keyboard navigation and screen-reader accessibility for all users.

---

## 🛠️ Technical Stack
- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **Map Renderer**: MapLibre GL JS
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

---

## 🚀 Running the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Installation
Clone your repository (once pushed) or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Development Server
Run the local server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
Create an optimized, static build:
```bash
npm run build
```
This produces a `dist` directory that can be served statically on GitHub Pages, Vercel, Netlify, or any basic web server.
