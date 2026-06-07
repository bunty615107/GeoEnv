import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  className?: string;
}

export default function Badge({ children, color = '#64748b', bg = '#f1f5f9', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase whitespace-nowrap ${className}`}
      style={{ color, backgroundColor: bg }}
    >
      {children}
    </span>
  );
}
