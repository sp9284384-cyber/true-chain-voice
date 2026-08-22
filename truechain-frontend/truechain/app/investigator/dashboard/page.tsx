"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getReports } from "@/lib/api";
import type { InvestigatorReportSummary, ApiError } from "@/lib/types";
import ReportQueue from "@/components/investigator/ReportQueue";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { AlertTriangle } from "@/components/shared/icons";

export default function DashboardPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<InvestigatorReportSummary[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getReports(token)
      .then((res) => {
        if (!cancelled) setReports(res);
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err.message || "Couldn't load reports.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-semibold sm:text-3xl">Report queue</h1>
      <p className="mt-1 text-sm text-text-muted">
        Sorted by AI-assigned urgency.
      </p>

      <div className="mt-8">
        {loading && <LoadingSpinner label="Loading reports…" />}

        {!loading && error && (
          <div className="card flex items-start gap-3 border-status-high/30 bg-status-high/5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-high" />
            <p className="text-sm text-status-high">{error}</p>
          </div>
        )}

        {!loading && !error && reports && <ReportQueue reports={reports} />}
      </div>
    </div>
  );
}
