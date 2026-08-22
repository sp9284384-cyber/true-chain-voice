"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { updateReportStatus } from "@/lib/api";
import type { ReportStatus } from "@/lib/types";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "resolved", label: "Resolved" },
];

interface Props {
  reportId: string;
  currentStatus: ReportStatus;
  onUpdated: (newStatus: ReportStatus) => void;
}

// Deliberately narrow: this can only PATCH /status. There is no path from
// this component to editing report content — the backend enforces
// append-only, and the UI doesn't offer an "edit report" option to begin
// with, so there's nothing here that could accidentally call it.
export function StatusUpdateForm({ reportId, currentStatus, onUpdated }: Props) {
  const { token } = useAuth();
  const [selected, setSelected] = useState<ReportStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || selected === currentStatus) return;
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateReportStatus(reportId, selected, token);
      onUpdated(selected);
      setSaved(true);
    } catch {
      setError("Couldn't save the status update. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink">
          Update status
        </label>
        <select
          id="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as ReportStatus)}
          className="rounded-card border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSaving || selected === currentStatus}
        className="rounded-card bg-ink px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? <LoadingSpinner label="Saving" /> : "Save update"}
      </button>
      {saved && <span className="text-sm text-trust">Saved.</span>}
      {error && <span className="text-sm text-alert">{error}</span>}
    </form>
  );
}
