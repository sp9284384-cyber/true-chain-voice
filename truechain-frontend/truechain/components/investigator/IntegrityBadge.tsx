import { CheckCircle, XCircle, Loader } from "@/components/shared/icons";

type IntegrityState = "checking" | "verified" | "tampered" | "unknown";

/**
 * Deliberately its own component, separate from UrgencyBadge, because
 * integrity status comes from the hash-chain service while urgency comes
 * from AI triage — two unrelated backends. A bug in one should never be
 * able to affect the other's rendering.
 */
export default function IntegrityBadge({ state }: { state: IntegrityState }) {
  if (state === "checking") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-text-muted">
        <Loader className="h-3 w-3" />
        Checking
      </span>
    );
  }

  if (state === "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-teal/30 bg-signal-teal/10 px-2.5 py-0.5 text-xs font-medium text-signal-teal">
        <CheckCircle className="h-3 w-3" />
        Verified
      </span>
    );
  }

  if (state === "tampered") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-status-high/30 bg-status-high/10 px-2.5 py-0.5 text-xs font-medium text-status-high">
        <XCircle className="h-3 w-3" />
        Tampered
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs text-text-faint">
      Unknown
    </span>
  );
}

export type { IntegrityState };
