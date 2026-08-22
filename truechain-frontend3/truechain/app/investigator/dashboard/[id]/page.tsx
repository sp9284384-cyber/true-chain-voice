"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getReportDetail, ApiError } from "@/lib/api";
import type { InvestigatorReportDetail, ReportStatus } from "@/lib/types";
import { UrgencyBadge } from "@/components/investigator/UrgencyBadge";
import { StatusUpdateForm } from "@/components/investigator/StatusUpdateForm";
import { Skeleton } from "@/components/shared/Skeleton";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { token, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<InvestigatorReportDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/investigator/login");
      return;
    }
    getReportDetail(params.id, token!)
      .then(setReport)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          router.replace("/investigator/login");
        } else {
          setError("Couldn't load this report.");
        }
      });
  }, [params.id, token, isAuthenticated, router, logout]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link href="/investigator/dashboard" className="text-sm text-ink-muted hover:text-ink">
            ← Back to queue
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {error && (
          <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
            {error}
          </p>
        )}

        {!error && !report && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {report && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <UrgencyBadge urgency={report.urgency} />
              <span className="text-sm text-ink-muted">
                {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
              </span>
              <span className="text-sm text-ink-muted">·</span>
              <span className="text-sm text-ink-muted">{STATUS_LABEL[report.status] ?? report.status}</span>
            </div>

            <h1 className="mt-3 font-display text-2xl text-ink">Report #{report.id}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Submitted {new Date(report.created_at).toLocaleDateString()} · {report.evidence_count} file
              {report.evidence_count === 1 ? "" : "s"} attached
            </p>

            <div className="mt-6 whitespace-pre-wrap rounded-card border border-line bg-surface p-5 leading-relaxed text-ink">
              {report.content}
            </div>

            <div className="mt-6 grid gap-2 rounded-card border border-line bg-paper p-4 font-mono text-xs text-ink-muted">
              <div className="flex gap-2">
                <span className="shrink-0 text-ink">report_hash</span>
                <span className="break-all">{report.report_hash}</span>
              </div>
              <div className="flex gap-2">
                <span className="shrink-0 text-ink">prev_hash</span>
                <span className="break-all">{report.prev_hash ?? "— (first record in chain)"}</span>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <StatusUpdateForm
                reportId={report.id}
                currentStatus={report.status}
                onUpdated={(newStatus: ReportStatus) => setReport({ ...report, status: newStatus })}
              />
              <p className="mt-3 text-xs text-ink-muted">
                This appends a new status entry — the original report is never edited or overwritten.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
