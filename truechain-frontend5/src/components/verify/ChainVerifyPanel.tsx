'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyChain } from '@/lib/api';
import type { VerifyResponse } from '@/lib/types';
import { ChainVisualizer } from './ChainVisualizer';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Fingerprint,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChainNode {
  id: number;
  verified: boolean;
}

export function ChainVerifyPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chainReports, setChainReports] = useState<ChainNode[]>([]);

  const handleVerify = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setChainReports([]);

    try {
      const data = await verifyChain();
      setResult(data);

      // Build the chain report nodes for visualization
      const nodes: ChainNode[] = [];
      for (let i = 1; i <= data.total_records; i++) {
        const isBroken = data.broken_at_report_id !== null && i >= data.broken_at_report_id;
        nodes.push({ id: i, verified: !isBroken });
      }
      setChainReports(nodes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleVerify();
  }, [handleVerify]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Verify button section */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-muted-foreground text-sm"
        >
          <Fingerprint className="size-4 text-primary/60" />
          <span>Cryptographic hash verification</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            onClick={handleVerify}
            disabled={loading}
            size="lg"
            className="relative gap-2.5 bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Verifying Chain...
              </>
            ) : result ? (
              <>
                <RefreshCw className="size-4" />
                Re-verify Chain
              </>
            ) : (
              <>
                <ShieldCheck className="size-5" />
                Verify Chain
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Loading skeleton */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Walking the chain and computing hash digests...
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Verification Failed</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result display */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Status banner */}
            <div
              className={`rounded-2xl border-2 p-6 text-center ${
                result.verified
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-destructive/40 bg-destructive/5'
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                  delay: 0.1,
                }}
                className="mx-auto mb-4"
              >
                {result.verified ? (
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/15">
                    <CheckCircle2 className="size-9 text-primary" strokeWidth={2} />
                  </div>
                ) : (
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-destructive/15">
                    <XCircle className="size-9 text-destructive" strokeWidth={2} />
                  </div>
                )}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`text-xl font-bold sm:text-2xl ${
                  result.verified ? 'text-primary' : 'text-destructive'
                }`}
              >
                {result.verified
                  ? 'Chain Verified'
                  : 'Tampering Detected'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-2 text-sm sm:text-base text-muted-foreground"
              >
                {result.verified
                  ? `Chain verified — ${result.total_records} record${result.total_records !== 1 ? 's' : ''}, no tampering detected`
                  : `Tampering detected at report #${result.broken_at_report_id}`}
              </motion.p>

              {/* Additional detail */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-1.5 text-xs font-mono text-muted-foreground/50"
              >
                {result.message}
              </motion.p>
            </div>

            {/* Chain visualization */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Chain Visualization
                </span>
              </div>
              <ChainVisualizer
                reports={chainReports}
                brokenAtId={result.broken_at_report_id}
              />

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="size-3.5 text-destructive" />
                  <span>Tampered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3.5 rounded-full border-2 border-muted-foreground/30" />
                  <span>Unverified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-[3px] w-4 rounded-full bg-primary/50" />
                  <span>Valid Link</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-[3px] w-4 rounded-full bg-destructive" />
                  <span>Broken Link</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
