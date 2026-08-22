'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ReportCard } from './ReportCard';
import { Inbox } from 'lucide-react';
import type { InvestigatorReport } from '@/lib/types';

interface ReportQueueProps {
  reports: InvestigatorReport[];
  token: string;
  loading: boolean;
}

function QueueSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-36 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportQueue({ reports, token, loading }: ReportQueueProps) {
  if (loading) {
    return <QueueSkeleton />;
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Inbox className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground">No reports found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          There are no reports in the queue yet. New submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar pr-1">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
