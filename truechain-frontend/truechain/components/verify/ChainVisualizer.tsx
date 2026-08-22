"use client";

import { motion } from "framer-motion";
import { LinkChain } from "@/components/shared/icons";

interface ChainVisualizerProps {
  totalRecords: number;
  brokenAt: number | null;
  hasRun: boolean;
}

/**
 * A row of linked blocks representing every report in the chain. Before
 * verification runs, blocks sit neutral. After: everything up to (and
 * including) a tamper point turns red and the link breaks visually there;
 * everything else lights up teal. This is the demo's single strongest
 * visual, kept isolated here so it can be polished independently.
 */
export default function ChainVisualizer({
  totalRecords,
  brokenAt,
  hasRun,
}: ChainVisualizerProps) {
  const count = Math.max(totalRecords, 1);
  const blocks = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-0 px-1 py-4">
        {blocks.map((n, i) => {
          const isBroken = hasRun && brokenAt !== null && n === brokenAt;
          const isPastBreak =
            hasRun && brokenAt !== null && n > brokenAt;
          const isVerified = hasRun && !isPastBreak && !isBroken;

          return (
            <div key={n} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className={`relative flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md border text-xs font-mono transition-colors duration-500 ${
                  isBroken
                    ? "border-status-high bg-status-high/15 text-status-high shadow-[0_0_20px_-4px_rgba(241,98,107,0.6)]"
                    : isVerified
                      ? "border-signal-teal/60 bg-signal-teal/10 text-signal-teal"
                      : isPastBreak
                        ? "border-status-high/30 bg-status-high/5 text-status-high/70"
                        : "border-line bg-ink-800 text-text-faint"
                }`}
              >
                <span className="text-[10px] opacity-70">#{n}</span>
                {isVerified && <span className="mt-0.5">✓</span>}
                {(isBroken || isPastBreak) && <span className="mt-0.5">✕</span>}
              </motion.div>

              {n !== count && (
                <div
                  className={`h-[2px] w-6 shrink-0 transition-colors duration-500 ${
                    isBroken
                      ? "bg-status-high"
                      : isVerified
                        ? "bg-signal-teal/60"
                        : isPastBreak
                          ? "bg-status-high/30"
                          : "bg-line"
                  }`}
                  style={
                    isBroken
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 3px, #F1626B 3px, #F1626B 5px)",
                        }
                      : undefined
                  }
                />
              )}
            </div>
          );
        })}
        {!hasRun && (
          <div className="ml-4 flex items-center gap-2 text-text-faint">
            <LinkChain className="h-4 w-4" />
            <span className="text-xs">Awaiting verification…</span>
          </div>
        )}
      </div>
    </div>
  );
}
