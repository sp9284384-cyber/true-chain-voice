"use client";

import { useState } from "react";
import { updateStatus } from "@/lib/api";
import type { ReportStatus, ApiError } from "@/lib/types";
import { Loader, CheckCircle } from "@/components/shared/icons";

const OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "resolved", label: "Resolved" },
];

/**
 * This component's API surface is intentionally narrow: it can only call
 * PATCH /status. There is no path in this component that touches the
 * report's content, which is what makes "nothing is ever overwritten" true
 * at the UI layer, not just enforced server-side.
 */
export default function StatusUpdateForm({
  token,
  reportId,
  currentStatus,
  onUpdated,
}: {
  token: string;
  reportId: number;
  currentStatus: ReportStatus;
  onUpdated: (newStatus: ReportStatus) => void;
}) {
  const [selected, setSelected] = useState<ReportStatus>(currentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justUpdated, setJustUpdated] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected === currentStatus) return;

    setSubmitting(true);
    setError(null);
    try {
      await updateStatus(token, reportId, selected);
      onUpdated(selected);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2500);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Couldn't update the status.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="field-label" htmlFor="status-select">
        Update status
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          id="status-select"
          className="field-input"
          value={selected}
          onChange={(e) => setSelected(e.target.value as ReportStatus)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting || selected === currentStatus}
          className="btn-primary shrink-0"
        >
          {submitting ? (
            <>
              <Loader className="h-4 w-4" />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>

      {justUpdated && (
        <p className="flex items-center gap-1.5 text-sm text-signal-teal">
          <CheckCircle className="h-4 w-4" />
          Status updated — appended a new chain-linked entry.
        </p>
      )}
      {error && <p className="text-sm text-status-high">{error}</p>}
    </form>
  );
}
