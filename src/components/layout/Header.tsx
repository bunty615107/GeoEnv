import { NavLink } from 'react-router-dom';
import { Globe, Database, Map, BarChart3, AlertTriangle, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home', icon: Globe },
  { to: '/catalog', label: 'Catalog', icon: Database },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/analysis', label: 'Analysis', icon: BarChart3 },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/about', label: 'About', icon: Info },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-dark text-text-on-dark" style={{ height: 56 }}>
      <div className="flex items-center justify-between h-full px-4 max-w-[1600px] mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 no-underline text-text-on-dark hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Globe size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight">GeoEnv Hub</span>
            <span className="text-[10px] text-text-muted tracking-widest uppercase hidden sm:block">Environmental Data Portal</span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium no-underline transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-text-muted hover:text-text-on-dark hover:bg-white/5'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-bg-dark-secondary border-t border-border-dark px-4 py-3 animate-fade-in" role="navigation" aria-label="Mobile navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-[14px] font-medium no-underline transition-colors ${
                  isActive ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-on-dark'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
