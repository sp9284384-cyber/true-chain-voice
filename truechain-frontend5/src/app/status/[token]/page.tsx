'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, Calendar, Tag, Gauge, Shield } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getReportStatus } from '@/lib/api';
import type { ReportStatus } from '@/lib/types';

function formatStatus(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function statusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'resolved':
      return 'default';
    case 'dismissed':
      return 'destructive';
    case 'investigating':
    case 'under_review':
      return 'secondary';
    default:
      return 'outline';
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
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

function StatusSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export default function StatusPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<ReportStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function fetchStatus() {
      try {
        const result = await getReportStatus(token);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch status.';
          if (msg.includes('not found') || msg.includes('404')) {
            setError('This token does not match any report. Please check and try again.');
          } else {
            setError(msg);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          {/* Page header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Shield className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Report Status
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Check the current status of your anonymous report.
            </p>
          </div>

          <PrivacyNotice />

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            {loading && <StatusSkeleton />}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {data && !error && (
              <div className="space-y-5">
                {/* Status badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <Badge variant={statusColor(data.status)}>
                    {formatStatus(data.status)}
                  </Badge>
                </div>

                {/* Category */}
                <div className="flex items-center gap-3">
                  <Tag className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Category</span>
                  <span className="text-sm capitalize text-foreground">{data.category || 'Unspecified'}</span>
                </div>

                {/* Urgency */}
                <div className="flex items-center gap-3">
                  <Gauge className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Urgency</span>
                  <span className="text-sm capitalize text-foreground">{data.urgency || 'N/A'}</span>
                </div>

                {/* Submission date */}
                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                  <span className="text-sm text-foreground">{formatDate(data.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
