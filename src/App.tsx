import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './contexts/CatalogContext';
import { MapProvider } from './contexts/MapContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Landing from './pages/Landing';

// Lazy-loaded heavy routes
const Catalog = lazy(() => import('./pages/Catalog'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Alerts = lazy(() => import('./pages/Alerts'));
const About = lazy(() => import('./pages/About'));

export default function App() {
  return (
    <HashRouter>
      <CatalogProvider>
        <MapProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
            <Routes>
              {/* No footer on map page (full-height) */}
              <Route path="/map" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </div>
        </MapProvider>
      </CatalogProvider>
    </HashRouter>
  );
}
