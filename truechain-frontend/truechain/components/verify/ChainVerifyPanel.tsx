"use client";

import { motion, AnimatePresence } from "framer-motion";
import ChainVisualizer from "./ChainVisualizer";
import { CheckCircle, XCircle, Loader, LinkChain } from "@/components/shared/icons";
import type { VerifyResponse } from "@/lib/types";

interface ChainVerifyPanelProps {
  result: VerifyResponse | null;
  loading: boolean;
  error: string | null;
  onVerify: () => void;
}

export default function ChainVerifyPanel({
  result,
  loading,
  error,
  onVerify,
}: ChainVerifyPanelProps) {
  return (
    <div className="card">
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader className="h-12 w-12 text-signal-teal" />
              <p className="text-text-muted">Walking the chain…</p>
            </motion.div>
          )}

          {!loading && !result && !error && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <LinkChain className="h-12 w-12 text-text-faint" />
              <p className="text-text-muted">
                Recompute every hash in the chain and confirm nothing has
                been altered.
              </p>
            </motion.div>
          )}

          {!loading && result?.verified && (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <CheckCircle className="h-16 w-16 text-signal-teal drop-shadow-[0_0_20px_rgba(45,217,196,0.5)]" />
              <p className="text-xl font-semibold text-signal-teal">
                Chain verified — {result.total_records} records, no tampering
                detected
              </p>
            </motion.div>
          )}

          {!loading && result && !result.verified && (
            <motion.div
              key="broken"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <XCircle className="h-16 w-16 text-status-high drop-shadow-[0_0_20px_rgba(241,98,107,0.5)]" />
              <p className="text-xl font-semibold text-status-high">
                Tampering detected at report #{result.broken_at_report_id}
              </p>
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <XCircle className="h-12 w-12 text-status-high" />
              <p className="text-status-high">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={onVerify} disabled={loading} className="btn-primary">
          {loading ? "Verifying…" : result ? "Re-run verification" : "Verify chain"}
        </button>
      </div>

      <div className="border-t border-line pt-2">
        <ChainVisualizer
          totalRecords={result?.total_records ?? 0}
          brokenAt={result?.broken_at_report_id ?? null}
          hasRun={Boolean(result)}
        />
      </div>
    </div>
  );
}
