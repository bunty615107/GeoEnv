import { Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-muted text-[12px] px-6 py-4 mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-accent" />
          <span>GeoEnv Hub — Environmental & Hazard Data Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Data from public sources • No server required</span>
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent hover:underline no-underline"
          >
            © OpenStreetMap <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </footer>
  );
}
