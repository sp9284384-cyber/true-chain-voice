import { ShieldCheck } from "./icons";

/**
 * Reused, word-for-word identical, on every report-facing page. That
 * consistency matters: judges (and real reporters) evaluating trust
 * should see the exact same promise every time, not a paraphrase.
 */
export default function PrivacyNotice({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-md border border-line bg-ink-900/60 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal-teal" />
      <p className="text-sm text-text-muted">
        We never collect your name, email, or IP address.
      </p>
    </div>
  );
}
