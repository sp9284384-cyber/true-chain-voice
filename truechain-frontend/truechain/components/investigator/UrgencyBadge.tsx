import type { Urgency } from "@/lib/types";

const STYLES: Record<Urgency, string> = {
  high: "bg-status-high/15 text-status-high border-status-high/30",
  medium: "bg-status-medium/15 text-status-medium border-status-medium/30",
  low: "bg-status-low/15 text-status-low border-status-low/30",
};

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[urgency]}`}
    >
      {urgency}
    </span>
  );
}
