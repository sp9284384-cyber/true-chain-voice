'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UrgencyBadgeProps {
  urgency: string;
}

const urgencyConfig: Record<string, { label: string; className: string }> = {
  high: {
    label: 'High',
    className: 'bg-red-500/15 text-red-400 border-red-500/25',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  },
  low: {
    label: 'Low',
    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25',
  },
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency] ?? urgencyConfig.low;

  return (
    <Badge variant="outline" className={cn('uppercase text-[10px] font-semibold tracking-wider', config.className)}>
      {config.label}
    </Badge>
  );
}
