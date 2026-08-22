"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategorySelect from "./CategorySelect";
import FileUpload, { type EvidenceUploadState } from "./FileUpload";
import { submitReport, uploadEvidence } from "@/lib/api";
import type { Category, ApiError } from "@/lib/types";
import { Loader, ArrowRight } from "@/components/shared/icons";

const MIN_LENGTH = 20;

export default function ReportForm() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [evidenceState, setEvidenceState] =
    useState<EvidenceUploadState>("idle");
  const [metadataRemoved, setMetadataRemoved] = useState<string>();
  const [evidenceError, setEvidenceError] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const remaining = MIN_LENGTH - content.trim().length;
  const canSubmit = content.trim().length >= MIN_LENGTH && !submitting;

  function handleFileChange(next: File | null, error?: string) {
    setFile(next);
    setFileError(error ?? null);
    setEvidenceState("idle");
    setEvidenceError(undefined);
    setMetadataRemoved(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const report = await submitReport({
        content: content.trim(),
        ...(category ? { category } : {}),
      });

      if (file) {
        setEvidenceState("uploading");
        try {
          const evidence = await uploadEvidence(report.report_id, file);
          setEvidenceState("success");
          setMetadataRemoved(evidence.metadata_removed);
        } catch (err) {
          // Evidence failure shouldn't block the report from being
          // considered submitted — the report itself already exists.
          const apiErr = err as ApiError;
          setEvidenceState("error");
          setEvidenceError(apiErr.message);
        }
      }

      router.push(
        `/report/confirmation?token=${encodeURIComponent(
          report.session_token
        )}`
      );
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(
        apiErr.message || "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="field-label">
          What happened?
        </label>
        <textarea
          id="content"
          className="field-input min-h-[220px] resize-y"
          placeholder="Describe the incident in as much detail as you're comfortable sharing. Include dates, locations, and people involved if relevant — you don't need to identify yourself."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <p className="mt-1.5 text-xs text-text-faint">
          {remaining > 0
            ? `At least ${remaining} more characters`
            : `${content.trim().length} characters`}
        </p>
      </div>

      <CategorySelect value={category} onChange={setCategory} />

      <div>
        <FileUpload
          file={file}
          onFileChange={handleFileChange}
          uploadState={evidenceState}
          metadataRemoved={metadataRemoved}
          uploadError={evidenceError}
        />
        {fileError && (
          <p className="mt-1.5 text-xs text-status-high">{fileError}</p>
        )}
      </div>

      {submitError && (
        <div className="rounded-md border border-status-high/30 bg-status-high/10 px-4 py-3 text-sm text-status-high">
          {submitError}
        </div>
      )}

      <button type="submit" disabled={!canSubmit} className="btn-primary w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader className="h-4 w-4" />
            Submitting…
          </>
        ) : (
          <>
            Submit report
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
