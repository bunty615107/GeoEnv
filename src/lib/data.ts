import type { Layer, Aspect, Dataset, Provider, Alert } from '../types';

const BASE = import.meta.env.BASE_URL ?? './';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

export const loadLayers = () => fetchJson<Layer[]>('layers.json');
export const loadAspects = () => fetchJson<Aspect[]>('aspects.json');
export const loadDatasets = () => fetchJson<Dataset[]>('datasets.json');
export const loadProviders = () => fetchJson<Provider[]>('providers.json');
export const loadAlerts = () => fetchJson<Alert[]>('alerts-mock.json');

export function getLayerColor(layerId: string): string {
  const map: Record<string, string> = {
    L1: '#6366f1',
    L2: '#f59e0b',
    L3: '#3b82f6',
    L4: '#22c55e',
  };
  return map[layerId] ?? '#64748b';
}

export function getSeverityColor(severity: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    severe: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
    moderate: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    minor: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    info: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  };
  return map[severity] ?? map.info;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
