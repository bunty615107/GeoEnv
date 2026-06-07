import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters or search terms.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center mb-4">
        <SearchX size={28} className="text-text-muted" />
      </div>
      <h3 className="text-[17px] font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] text-text-secondary max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-hover transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          {action.label}
        </button>
      )}
    </div>
  );
}
