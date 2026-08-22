"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getInvestigatorReports, ApiError } from "@/lib/api";
import type { InvestigatorReportSummary } from "@/lib/types";
import { ReportQueue } from "@/components/investigator/ReportQueue";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { token, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<InvestigatorReportSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Middleware only knows a session cookie exists — it can't see the
    // actual token, which lives in memory and is gone after a page refresh.
    // If that's happened, send the investigator back to log in again.
    if (!isAuthenticated) {
      router.replace("/investigator/login");
      return;
    }
    getInvestigatorReports(token!)
      .then(setReports)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/investigator/login");
        } else {
          setError("Couldn't load the report queue. Please try again.");
        }
      });
  }, [token, isAuthenticated, router, logout]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg text-ink">Investigator dashboard</span>
          <button
            onClick={() => {
              logout();
              router.push("/investigator/login");
            }}
            className="text-sm text-ink-muted hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-2xl text-ink">Report queue</h1>
        <p className="mt-1 text-sm text-ink-muted">Sorted by urgency.</p>

        <div className="mt-6">
          {error && (
            <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
              {error}
            </p>
          )}
          {!error && !reports && <LoadingSpinner label="Loading queue" />}
          {!error && reports && <ReportQueue reports={reports} />}
        </div>
      </main>
    </div>
  );
}
