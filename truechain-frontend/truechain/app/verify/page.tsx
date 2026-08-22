"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import ChainVerifyPanel from "@/components/verify/ChainVerifyPanel";
import { verifyChain } from "@/lib/api";
import type { VerifyResponse, ApiError } from "@/lib/types";

export default function VerifyPage() {
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runVerification = useCallback(() => {
    setLoading(true);
    setError(null);
    verifyChain()
      .then(setResult)
      .catch((err: ApiError) =>
        setError(err.message || "Verification failed to run.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    runVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Verify chain integrity
          </h1>
          <p className="mt-3 text-text-muted">
            Every report is cryptographically linked to the one before it.
            This page recomputes the entire chain live — anyone can run it,
            no login required.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <ChainVerifyPanel
            result={result}
            loading={loading}
            error={error}
            onVerify={runVerification}
          />
        </div>
      </main>
    </div>
  );
}
