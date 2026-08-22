interface Props {
  totalRecords: number;
  brokenAtId: string | number | null; // report id/number where the chain breaks, or null if intact
}

/**
 * The single strongest visual in the app: a horizontal chain of linked
 * boxes, one per report. Every box before the break is a solid teal link;
 * the break itself renders as a snapped connector and a red box; everything
 * downstream of it is shown as unverifiable (dashed, muted) since a break
 * anywhere invalidates trust in what follows it.
 */
export function ChainVisualizer({ totalRecords, brokenAtId }: Props) {
  const boxes = Array.from({ length: totalRecords }, (_, i) => i + 1);
  const brokenAtIndex = brokenAtId === null ? null : Number(brokenAtId);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center px-1 py-4">
        {boxes.map((n, idx) => {
          const isBroken = brokenAtIndex !== null && n === brokenAtIndex;
          const isAfterBreak = brokenAtIndex !== null && n > brokenAtIndex;
          const isVerified = brokenAtIndex === null || n < brokenAtIndex;

          return (
            <div key={n} className="flex items-center">
              {idx > 0 && (
                <div
                  aria-hidden="true"
                  className={`h-[2px] w-6 ${isBroken ? "bg-alert" : isAfterBreak ? "" : "bg-trust"}`}
                  style={
                    isAfterBreak
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(90deg, #3A4451 0 4px, transparent 4px 8px)",
                        }
                      : undefined
                  }
                />
              )}
              <div
                title={`Report #${n}`}
                className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-card border text-xs font-medium transition-colors ${
                  isBroken
                    ? "border-alert bg-alert-soft text-alert"
                    : isVerified
                    ? "border-trust/40 bg-trust-soft text-trust"
                    : "border-dashed border-line bg-surface text-ink-muted"
                }`}
              >
                {isBroken ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 15l6-6M4 9l4-4a4 4 0 0 1 6 0M20 15l-4 4a4 4 0 0 1-6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : isVerified ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
                  </svg>
                )}
                <span className="mt-1 font-mono text-[10px]">#{n}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
