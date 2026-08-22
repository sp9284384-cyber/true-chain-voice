"use client";

import { useMemo, useState } from "react";
import ReportCard from "./ReportCard";
import type { InvestigatorReportSummary, Urgency } from "@/lib/types";

type SortMode = "urgency" | "newest";

const URGENCY_RANK: Record<Urgency, number> = { high: 0, medium: 1, low: 2 };

export default function ReportQueue({
  reports,
}: {
  reports: InvestigatorReportSummary[];
}) {
  // Backend already returns reports pre-sorted by urgency — "urgency" mode
  // simply preserves that order rather than re-deriving it.
  const [sortMode, setSortMode] = useState<SortMode>("urgency");

  const sorted = useMemo(() => {
    if (sortMode === "newest") {
      return [...reports].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return [...reports].sort(
      (a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]
    );
  }, [reports, sortMode]);

  if (reports.length === 0) {
    return (
      <div className="card text-center text-text-muted">
        No reports in the queue yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-text-faint">
          {reports.length} report{reports.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-1 rounded-md border border-line p-1 text-xs">
          {(["urgency", "newest"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`rounded px-3 py-1.5 capitalize transition ${
                sortMode === mode
                  ? "bg-signal-teal/15 text-signal-teal"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
