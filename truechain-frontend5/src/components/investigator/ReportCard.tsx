'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UrgencyBadge } from './UrgencyBadge';
import { ChevronRight, CalendarDays } from 'lucide-react';
import type { InvestigatorReport } from '@/lib/types';

interface ReportCardProps {
  report: InvestigatorReport;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25' },
  under_review: { label: 'Under Review', className: 'bg-sky-500/15 text-sky-300 border-sky-500/25' },
  investigating: { label: 'Investigating', className: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  resolved: { label: 'Resolved', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  dismissed: { label: 'Dismissed', className: 'bg-zinc-600/15 text-zinc-400 border-zinc-600/25' },
};

function formatDateString(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatCategory(category: string): string {
  return category
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function ReportCard({ report }: ReportCardProps) {
  const status = statusConfig[report.status] ?? { label: report.status, className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25' };

  return (
    <Link href={`/investigator/dashboard/${report.id}`} className="block group">
      <Card className="transition-colors hover:border-primary/40 hover:bg-card/80 py-0 gap-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              {/* Top row: ID + category */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-foreground">
                  #{String(report.id).padStart(4, '0')}
                </span>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-medium">
                  {report.category ? formatCategory(report.category) : 'Unspecified'}
                </Badge>
              </div>

              {/* Bottom row: urgency + status + date */}
              <div className="flex items-center gap-2 flex-wrap">
                <UrgencyBadge urgency={report.urgency} />
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <CalendarDays className="size-3" />
                  {formatDateString(report.created_at)}
                </span>
              </div>
            </div>

            <ChevronRight className="size-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
