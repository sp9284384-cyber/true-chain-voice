'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { getInvestigatorReports } from '@/lib/api';
import { ReportQueue } from '@/components/investigator/ReportQueue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogOut, ArrowLeft, FileText } from 'lucide-react';
import type { InvestigatorReport } from '@/lib/types';

export default function InvestigatorDashboardPage() {
  const router = useRouter();
  const { token, clearToken } = useAuthStore();
  const [reports, setReports] = useState<InvestigatorReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.replace('/investigator/login');
      return;
    }

    let cancelled = false;

    async function fetchReports(authToken: string) {
      try {
        const data = await getInvestigatorReports(authToken);
        if (!cancelled) {
          setReports(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load reports.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchReports(token);

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  const handleLogout = () => {
    clearToken();
    router.push('/investigator/login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Back to public site">
              <ArrowLeft className="size-5" />
            </Link>
            <Shield className="size-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">Investigator Dashboard</h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 page-enter">
        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <MiniStat label="Total Reports" value={reports.length} />
          <MiniStat
            label="Submitted"
            value={reports.filter((r) => r.status === 'submitted').length}
          />
          <MiniStat
            label="Investigating"
            value={reports.filter((r) => r.status === 'investigating').length}
          />
          <MiniStat
            label="Resolved"
            value={reports.filter((r) => r.status === 'resolved').length}
          />
        </div>

        {/* Report queue */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-primary" />
              Report Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {error ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-red-400">
                {error}
              </div>
            ) : (
              <ReportQueue reports={reports} token={token} loading={loading} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
