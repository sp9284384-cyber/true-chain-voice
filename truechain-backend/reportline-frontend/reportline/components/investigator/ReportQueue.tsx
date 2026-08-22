"use client";

import Link from "next/link";
import type { InvestigatorReportSummary } from "@/lib/types";
import { UrgencyBadge } from "./UrgencyBadge";

const URGENCY_RANK = { high: 0, medium: 1, low: 2 } as const;

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

export function ReportQueue({ reports }: { reports: InvestigatorReportSummary[] }) {
  const sorted = [...reports].sort((a, b) => URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]);

  if (sorted.length === 0) {
    return <p className="rounded-card border border-line bg-surface px-5 py-8 text-center text-sm text-ink-muted">No reports yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
            <th className="px-5 py-3 font-medium">Urgency</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((report) => (
            <tr key={report.id} className="border-b border-line last:border-0 hover:bg-paper">
              <td className="px-5 py-3.5">
                <Link href={`/investigator/dashboard/${report.id}`} className="block">
                  <UrgencyBadge urgency={report.urgency} />
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <Link href={`/investigator/dashboard/${report.id}`} className="block text-ink">
                  {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <Link href={`/investigator/dashboard/${report.id}`} className="block text-ink-muted">
                  {STATUS_LABEL[report.status] ?? report.status}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <Link href={`/investigator/dashboard/${report.id}`} className="block text-ink-muted">
                  {new Date(report.created_at).toLocaleDateString()}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
