"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shared/Header";
import TokenDisplay from "@/components/report/TokenDisplay";
import { AlertTriangle, ArrowRight } from "@/components/shared/icons";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

function ConfirmationContent() {
  const params = useSearchParams();
  const token = params.get("token");

  if (!token) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-text-muted">
          No session token was found. If you just submitted a report,
          something went wrong — please{" "}
          <Link href="/report" className="text-signal-teal underline">
            try again
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">Report received</h1>
      <p className="mt-3 text-text-muted">
        Your report has been recorded and linked into the tamper-evident
        chain. This token is the only way to check on it later.
      </p>

      <div className="mt-8 text-left">
        <TokenDisplay token={token} />
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-md border border-status-medium/30 bg-status-medium/10 px-4 py-3 text-left text-sm text-status-medium">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Save this token now. We cannot recover it for you, and it will not
          be shown again.
        </p>
      </div>

      <Link
        href={`/status/${encodeURIComponent(token)}`}
        className="btn-secondary mt-8 inline-flex"
      >
        Check status with this token
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-16 sm:py-24">
        <Suspense fallback={<LoadingSpinner />}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </div>
  );
}
