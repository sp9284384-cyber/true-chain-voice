"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, submitReport, uploadEvidence } from "@/lib/api";
import type { Category } from "@/lib/types";
import { CategorySelect } from "./CategorySelect";
import { FileUpload } from "./FileUpload";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const MIN_LENGTH = 20;

export function ReportForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTooShort = description.trim().length > 0 && description.trim().length < MIN_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (description.trim().length < MIN_LENGTH) {
      setSubmitError(`Please describe what happened in at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (fileError) return;

    setIsSubmitting(true);
    try {
      const { report_id, session_token } = await submitReport({
        content: description.trim(),
        ...(category ? { category } : {}),
      });

      if (file) {
        try {
          await uploadEvidence(report_id, file);
        } catch {
          // The report itself is already saved; evidence failing shouldn't
          // block the reporter from getting their token.
          setSubmitError(
            "Your report was submitted, but the file didn't upload. You can still use your token to check status."
          );
        }
      }

      router.push(`/report/confirmation?token=${encodeURIComponent(session_token)}`);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 0
          ? "Can't reach the server right now — check your connection and try again."
          : "Something went wrong submitting your report. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
          What happened?
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={9}
          placeholder="Describe the incident in as much detail as you're comfortable sharing — what happened, when, and who was involved. Avoid including your own name."
          className="w-full resize-y rounded-card border border-line bg-surface px-3.5 py-3 leading-relaxed text-ink placeholder:text-ink-muted/70 focus-visible:outline-none"
        />
        {isTooShort && (
          <p className="mt-1.5 text-xs text-ink-muted">
            {MIN_LENGTH - description.trim().length} more characters needed.
          </p>
        )}
      </div>

      <CategorySelect value={category} onChange={setCategory} />
      <FileUpload file={file} onChange={setFile} error={fileError} onError={setFileError} />

      {submitError && (
        <p role="alert" className="rounded-card border border-alert/30 bg-alert-soft px-3.5 py-2.5 text-sm text-alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-card bg-trust px-4 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? <LoadingSpinner label="Submitting" /> : "Submit report anonymously"}
      </button>
    </form>
  );
}
