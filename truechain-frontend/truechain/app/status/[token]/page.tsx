"use client";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import PrivacyNotice from "@/components/shared/PrivacyNotice";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getReportStatus } from "@/lib/api";
import type { ReportStatusResponse, ApiError } from "@/lib/types";
import { AlertTriangle, CheckCircle } from "@/components/shared/icons";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

const STATUS_DOT: Record<string, string> = {
  submitted: "bg-status-low",
  under_review: "bg-status-medium",
  resolved: "bg-status-good",
};

export default function StatusPage({
  params,
}: {
  params: { token: string };
}) {
  const [data, setData] = useState<ReportStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    getReportStatus(params.token)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message || "Couldn't load this report's status.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.token]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Report status
          </h1>
          <p className="mt-3 break-all text-sm text-text-faint">
            Token: <span className="font-mono">{params.token}</span>
          </p>

          <div className="mt-8">
            {loading && <LoadingSpinner label="Looking up your report…" />}

            {!loading && notFound && (
              <div className="card flex items-start gap-3 border-status-high/30 bg-status-high/5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-status-high" />
                <div>
                  <p className="font-medium text-status-high">
                    We couldn&apos;t find a report for this token.
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Double-check that you copied it exactly, including any
                    dashes or letters. Tokens can&apos;t be recovered if
                    lost.
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="card border-status-high/30 bg-status-high/5 text-sm text-status-high">
                {error}
              </div>
            )}

            {!loading && data && (
              <div className="card space-y-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[data.status]}`}
                  />
                  <span className="text-lg font-medium">
                    {STATUS_LABEL[data.status] ?? data.status}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-text-faint">Category</dt>
                    <dd className="mt-1 capitalize text-text-primary">
                      {data.category ?? "Pending review"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-faint">Urgency</dt>
                    <dd className="mt-1 capitalize text-text-primary">
                      {data.urgency ?? "Pending review"}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-text-faint">Submitted</dt>
                    <dd className="mt-1 text-text-primary">
                      {new Date(data.created_at).toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-center gap-2 border-t border-line pt-4 text-xs text-text-faint">
                  <CheckCircle className="h-3.5 w-3.5 text-signal-teal" />
                  This report is permanently linked into TrueChain&apos;s
                  tamper-evident record.
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <PrivacyNotice compact />
          </div>
        </div>
      </main>
    </div>
  );
}
