"use client";

import { useEffect, useState } from "react";
import { verifyChain } from "@/lib/api";
import type { VerifyResponse } from "@/lib/types";
import { ChainVisualizer } from "./ChainVisualizer";

type LoadState = "idle" | "loading" | "loaded" | "error";

export function ChainVerifyPanel({ autoVerifyOnLoad = true }: { autoVerifyOnLoad?: boolean }) {
  const [state, setState] = useState<LoadState>("idle");
  const [result, setResult] = useState<VerifyResponse | null>(null);

  async function runVerify() {
    setState("loading");
    try {
      const res = await verifyChain();
      setResult(res);
      setState("loaded");
    } catch {
      setState("error");
    }
  }

  useEffect(() => {
    if (autoVerifyOnLoad) runVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-ink">Chain integrity</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Every report is cryptographically linked to the one before it. This check recomputes each hash and
            confirms nothing has been altered.
          </p>
        </div>
        <button
          onClick={runVerify}
          disabled={state === "loading"}
          className="shrink-0 rounded-card bg-ink px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {state === "loading" ? "Verifying…" : "Verify chain"}
        </button>
      </div>

      <div className="mt-6 min-h-[88px]">
        {state === "idle" && <p className="text-sm text-ink-muted">Checking on load…</p>}

        {state === "error" && (
          <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
            Couldn't reach the verification service. Try again.
          </p>
        )}

        {state === "loaded" && result && (
          <>
            <div
              className={`flex items-center gap-3 rounded-card border px-4 py-3.5 ${
                result.verified ? "border-trust/40 bg-trust-soft" : "border-alert/40 bg-alert-soft"
              }`}
            >
              {result.verified ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-trust">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-alert">
                  <path d="M12 3l9 16H3L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M12 9.5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="16.7" r="1" fill="currentColor" />
                </svg>
              )}
              <p className={`text-base font-medium ${result.verified ? "text-trust" : "text-alert"}`}>
                {result.verified
                  ? `Chain verified — ${result.record_count} records, no tampering detected.`
                  : `Tampering detected at report #${result.broken_at}.`}
              </p>
            </div>

            <ChainVisualizer recordCount={result.record_count} brokenAt={result.verified ? null : result.broken_at} />
          </>
        )}
      </div>
    </div>
  );
}
