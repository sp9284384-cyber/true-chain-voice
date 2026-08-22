import type { Urgency } from "@/lib/types";

const STYLES: Record<Urgency, string> = {
  high: "bg-alert-soft text-alert border-alert/30",
  medium: "bg-amber-soft text-amber border-amber/30",
  low: "bg-low-soft text-low border-low/30",
};

const LABEL: Record<Urgency, string> = { high: "High", medium: "Medium", low: "Low" };

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[urgency]}`}>
      {LABEL[urgency]}
    </span>
  );
}
