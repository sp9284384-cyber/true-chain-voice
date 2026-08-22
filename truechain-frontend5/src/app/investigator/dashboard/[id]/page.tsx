'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { getInvestigatorReportDetail } from '@/lib/api';
import { UrgencyBadge } from '@/components/investigator/UrgencyBadge';
import { StatusUpdateForm } from '@/components/investigator/StatusUpdateForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CalendarDays,
  Hash,
  Link2,
  Paperclip,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import type { InvestigatorReportDetail } from '@/lib/types';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25' },
  under_review: { label: 'Under Review', className: 'bg-sky-500/15 text-sky-300 border-sky-500/25' },
  investigating: { label: 'Investigating', className: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  resolved: { label: 'Resolved', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  dismissed: { label: 'Dismissed', className: 'bg-zinc-600/15 text-zinc-400 border-zinc-600/25' },
};

function formatDateString(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const [report, setReport] = useState<InvestigatorReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = Number(params.id);

  const fetchReport = useCallback(async () => {
    if (!token || isNaN(id)) return;

    setLoading(true);
    setError('');
    try {
      const data = await getInvestigatorReportDetail(token, id);
      setReport(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load report.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    if (!token) {
      router.replace('/investigator/login');
      return;
    }
    fetchReport();
  }, [token, router, fetchReport]);

  if (!token) {
    return null;
  }

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4 sm:px-6">
            <Link href="/investigator/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Back to dashboard">
              <ArrowLeft className="size-5" />
            </Link>
            <Shield className="size-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">Report Detail</h1>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <AlertTriangle className="size-8 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Error loading report</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">{error || 'Report not found.'}</p>
            <Button variant="outline" className="mt-6" onClick={() => router.push('/investigator/dashboard')}>
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const status = statusConfig[report.status] ?? { label: report.status, className: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25' };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/investigator/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <Shield className="size-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">Report Detail</h1>
          <span className="ml-auto font-mono text-sm text-muted-foreground">
            #{String(report.id).padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 space-y-6 page-enter">
        {/* Metadata card */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-medium">
                {formatCategory(report.category)}
              </Badge>
              <UrgencyBadge urgency={report.urgency} />
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1.5 mt-1">
              <CalendarDays className="size-3" />
              Submitted {formatDateString(report.created_at)}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Decrypted content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decrypted Report Content</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-md bg-muted/50 border border-border p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {report.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technical details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="size-4 text-muted-foreground" />
              Chain Integrity
            </CardTitle>
            <CardDescription>Cryptographic hashes for tamper verification</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">Report Hash (SHA-256)</p>
              <code className="block rounded-md bg-muted/50 border border-border px-3 py-2 text-xs font-mono text-foreground/70 break-all leading-relaxed">
                {report.report_hash}
              </code>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                <Link2 className="size-3" />
                Previous Hash
              </p>
              <code className="block rounded-md bg-muted/50 border border-border px-3 py-2 text-xs font-mono text-foreground/70 break-all leading-relaxed">
                {report.prev_hash}
              </code>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <Paperclip className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Attached evidence files:</span>
              <span className="font-semibold text-foreground tabular-nums">{report.evidence_count}</span>
            </div>
          </CardContent>
        </Card>

        {/* Status update */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update Report Status</CardTitle>
            <CardDescription>
              Change the investigation status. The original report content cannot be modified.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <StatusUpdateForm
              reportId={report.id}
              token={token}
              currentStatus={report.status}
              onUpdated={fetchReport}
            />
          </CardContent>
        </Card>

        {/* Back link */}
        <div className="pb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/investigator/dashboard">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4 sm:px-6">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 space-y-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </main>
    </div>
  );
}
