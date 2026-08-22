"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { PrivacyNotice } from "@/components/shared/PrivacyNotice";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ApiError, getReportStatus } from "@/lib/api";
import type { ReportStatusResponse } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

const URGENCY_LABEL: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function StatusPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<ReportStatusResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getReportStatus(params.token)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setLoadError("Couldn't load status right now. Please try again in a moment.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.token]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-xl px-6 py-12">
        <h1 className="font-display text-2xl text-ink">Report status</h1>
        <p className="mt-1.5 break-all font-mono text-xs text-ink-muted">{params.token}</p>

        <div className="mt-6">
          {isLoading && <LoadingSpinner label="Looking up your report" />}

          {!isLoading && notFound && (
            <div className="rounded-card border border-line bg-surface px-5 py-6 text-center">
              <p className="font-medium text-ink">We couldn't find a report for this token.</p>
              <p className="mt-1.5 text-sm text-ink-muted">
                Double-check it against what you saved at submission — tokens are case-sensitive and can't be
                reissued if lost.
              </p>
              <Link href="/report" className="mt-4 inline-block text-sm font-medium text-trust underline underline-offset-2">
                File a new report
              </Link>
            </div>
          )}

          {!isLoading && loadError && (
            <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
              {loadError}
            </p>
          )}

          {!isLoading && data && (
            <dl className="divide-y divide-line rounded-card border border-line bg-surface">
              <Row label="Status" value={STATUS_LABEL[data.status] ?? data.status} />
              <Row label="Category" value={data.category.charAt(0).toUpperCase() + data.category.slice(1)} />
              <Row label="Urgency" value={URGENCY_LABEL[data.urgency] ?? data.urgency} />
              <Row
                label="Submitted"
                value={new Date(data.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </dl>
          )}
        </div>

        <PrivacyNotice className="mt-8" />
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
