import Link from "next/link";
import UrgencyBadge from "./UrgencyBadge";
import type { InvestigatorReportSummary } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

export default function ReportCard({
  report,
}: {
  report: InvestigatorReportSummary;
}) {
  return (
    <Link
      href={`/investigator/dashboard/${report.id}`}
      className="flex items-center justify-between gap-4 rounded-md border border-line bg-ink-800/40 px-4 py-3.5 transition hover:border-signal-teal/40 hover:bg-ink-800"
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="font-mono text-xs text-text-faint">
          #{report.id}
        </span>
        <UrgencyBadge urgency={report.urgency} />
        <span className="hidden rounded-full border border-line px-2.5 py-0.5 text-xs capitalize text-text-muted sm:inline-block">
          {report.category}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-xs text-text-faint">
        <span>{STATUS_LABEL[report.status] ?? report.status}</span>
        <span className="hidden sm:inline">
          {new Date(report.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
