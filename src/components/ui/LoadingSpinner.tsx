import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-in">
      <Loader2 size={32} className="text-accent animate-spin" />
      <span className="text-[13px] text-text-secondary">{text}</span>
    </div>
  );
}
