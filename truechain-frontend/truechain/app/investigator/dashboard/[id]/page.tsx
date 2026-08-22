"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getReportDetail, verifyChain } from "@/lib/api";
import type { InvestigatorReportDetail, ApiError, ReportStatus } from "@/lib/types";
import UrgencyBadge from "@/components/investigator/UrgencyBadge";
import IntegrityBadge, { type IntegrityState } from "@/components/investigator/IntegrityBadge";
import StatusUpdateForm from "@/components/investigator/StatusUpdateForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { AlertTriangle, FileText } from "@/components/shared/icons";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

function truncateHash(hash: string | null) {
  if (!hash) return "—";
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

export default function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useAuth();
  const [report, setReport] = useState<InvestigatorReportDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrity, setIntegrity] = useState<IntegrityState>("checking");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getReportDetail(token, params.id)
      .then((res) => {
        if (cancelled) return;
        setReport(res);
      })
      .catch((err: ApiError) => {
        if (!cancelled) setError(err.message || "Couldn't load this report.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    verifyChain(Number(params.id))
      .then((res) => {
        if (!cancelled) setIntegrity(res.verified ? "verified" : "tampered");
      })
      .catch(() => {
        if (!cancelled) setIntegrity("unknown");
      });

    return () => {
      cancelled = true;
    };
  }, [token, params.id]);

  if (loading) return <LoadingSpinner label="Loading report…" />;

  if (error || !report) {
    return (
      <div className="card flex items-start gap-3 border-status-high/30 bg-status-high/5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-high" />
        <p className="text-sm text-status-high">
          {error || "Report not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/investigator/dashboard"
        className="text-sm text-text-muted hover:text-signal-teal"
      >
        ← Back to queue
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Report #{report.id}
        </h1>
        <UrgencyBadge urgency={report.urgency} />
        <IntegrityBadge state={integrity} />
        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs capitalize text-text-muted">
          {report.category}
        </span>
      </div>
      <p className="mt-1 text-sm text-text-faint">
        Submitted {new Date(report.created_at).toLocaleString()} ·{" "}
        {STATUS_LABEL[report.status] ?? report.status}
      </p>

      <div className="card mt-6">
        <h2 className="text-sm font-medium text-text-muted">Content</h2>
        <p className="mt-3 whitespace-pre-wrap text-text-primary">
          {report.content}
        </p>
      </div>

      <div className="card mt-4 flex items-center gap-2 text-sm text-text-muted">
        <FileText className="h-4 w-4" />
        {report.evidence_count} evidence file
        {report.evidence_count === 1 ? "" : "s"} attached
      </div>

      <div className="card mt-4">
        <h2 className="text-sm font-medium text-text-muted">
          Chain record{" "}
          <span className="font-normal text-text-faint">
            (for demo credibility — not editable)
          </span>
        </h2>
        <dl className="mt-3 grid gap-2 font-mono text-xs text-text-faint sm:grid-cols-2">
          <div>
            <dt className="inline text-text-muted">report_hash: </dt>
            <dd className="inline">{truncateHash(report.report_hash)}</dd>
          </div>
          <div>
            <dt className="inline text-text-muted">prev_hash: </dt>
            <dd className="inline">{truncateHash(report.prev_hash)}</dd>
          </div>
        </dl>
      </div>

      <div className="card mt-4">
        <StatusUpdateForm
          token={token!}
          reportId={report.id}
          currentStatus={report.status}
          onUpdated={(newStatus: ReportStatus) =>
            setReport((prev) => (prev ? { ...prev, status: newStatus } : prev))
          }
        />
      </div>
    </div>
  );
}
