'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, XCircle, Link2, Unlink } from 'lucide-react';

interface ChainNode {
  id: number;
  verified: boolean;
}

interface ChainVisualizerProps {
  reports: ChainNode[];
  brokenAtId: number | null;
}

export function ChainVisualizer({ reports, brokenAtId }: ChainVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  if (reports.length === 0) return null;

  const lastIndex = reports.length - 1;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto pb-4 custom-scrollbar"
      role="img"
      aria-label="Blockchain integrity visualization"
    >
      <div className="flex items-center gap-0 min-w-max px-2 py-4">
        {reports.map((report, index) => {
          const isBrokenNode = brokenAtId !== null && report.id === brokenAtId;
          const isAfterBreak = brokenAtId !== null && report.id > brokenAtId;
          const isVerified = report.verified && !isBrokenNode && !isAfterBreak;
          const linkIsBroken = brokenAtId !== null && report.id === brokenAtId;
          const linkIsAfterBreak = brokenAtId !== null && report.id > brokenAtId;
          const isLast = index === lastIndex;
          const shouldShowLink = !isLast;

          return (
            <div key={report.id} className="flex items-center">
              {/* Chain node box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 12 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.5, y: 12 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 min-w-[90px] transition-colors duration-300 ${
                  isBrokenNode
                    ? 'border-destructive bg-destructive/10'
                    : isAfterBreak
                    ? 'border-muted-foreground/30 bg-muted/50'
                    : 'border-primary/40 bg-primary/5'
                }`}
              >
                {/* Status icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={
                    isInView
                      ? { scale: 1 }
                      : { scale: 0 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: index * 0.12 + 0.2,
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                  }}
                >
                  {isBrokenNode ? (
                    <XCircle className="size-6 text-destructive" strokeWidth={2.5} />
                  ) : isAfterBreak ? (
                    <div className="size-6 rounded-full border-2 border-muted-foreground/30" />
                  ) : (
                    <CheckCircle2
                      className={`size-6 text-primary ${isVerified ? 'chain-node' : ''}`}
                      strokeWidth={2.5}
                    />
                  )}
                </motion.div>

                {/* Hash label */}
                <span
                  className={`font-mono text-xs font-semibold tracking-wide ${
                    isBrokenNode
                      ? 'text-destructive'
                      : isAfterBreak
                      ? 'text-muted-foreground/50'
                      : 'text-foreground/90'
                  }`}
                >
                  #R-{String(report.id).padStart(3, '0')}
                </span>

                {/* Subtle block number */}
                <span
                  className={`text-[10px] font-mono ${
                    isBrokenNode
                      ? 'text-destructive/60'
                      : isAfterBreak
                      ? 'text-muted-foreground/30'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  Block {index + 1}
                </span>

                {/* Broken glow effect */}
                {isBrokenNode && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-destructive/0"
                    animate={{
                      borderColor: [
                        'rgba(239, 68, 68, 0)',
                        'rgba(239, 68, 68, 0.6)',
                        'rgba(239, 68, 68, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.div>

              {/* Connecting line to next node */}
              {shouldShowLink && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={
                    isInView
                      ? { scaleX: 1 }
                      : { scaleX: 0 }
                  }
                  transition={{
                    duration: 0.35,
                    delay: index * 0.12 + 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative mx-1 flex h-[3px] w-6 items-center origin-left sm:w-8 lg:w-10 ${
                    linkIsBroken || linkIsAfterBreak
                      ? 'opacity-40'
                      : ''
                  }`}
                >
                  <div
                    className={`h-full w-full rounded-full ${
                      linkIsBroken
                        ? 'bg-destructive'
                        : linkIsAfterBreak
                        ? 'bg-muted-foreground/20'
                        : 'bg-primary/50'
                    }`}
                  />
                  {/* Link icon on the line */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{
                      duration: 0.3,
                      delay: index * 0.12 + 0.4,
                      type: 'spring',
                      stiffness: 300,
                    }}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-0.5 ${
                      linkIsBroken
                        ? 'bg-destructive/20 text-destructive'
                        : linkIsAfterBreak
                        ? 'bg-muted/50 text-muted-foreground/30'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {linkIsBroken ? (
                      <Unlink className="size-3" strokeWidth={2.5} />
                    ) : (
                      <Link2 className="size-3" strokeWidth={2.5} />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
