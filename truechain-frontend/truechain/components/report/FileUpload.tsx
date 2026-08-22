"use client";

import { useRef } from "react";
import { Upload, CheckCircle, XCircle, FileText, Loader } from "@/components/shared/icons";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export type EvidenceUploadState = "idle" | "uploading" | "success" | "error";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null, error?: string) => void;
  uploadState: EvidenceUploadState;
  metadataRemoved?: string;
  uploadError?: string;
}

/**
 * Kept separate from ReportForm because it owns a distinct concern: local
 * file validation, plus the "metadata stripped ✓" confirmation that only
 * appears once the backend has actually sanitized the file. That's UI
 * feedback worth testing on its own.
 */
export default function FileUpload({
  file,
  onFileChange,
  uploadState,
  metadataRemoved,
  uploadError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSet(selected: File | undefined) {
    if (!selected) return onFileChange(null);
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onFileChange(null, "Only JPG, PNG, or PDF files are accepted.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      onFileChange(null, "File is too large. Maximum size is 10MB.");
      return;
    }
    onFileChange(selected);
  }

  return (
    <div>
      <label className="field-label">
        Supporting evidence <span className="text-text-faint">(optional)</span>
      </label>

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-line px-4 py-8 text-center transition hover:border-signal-teal/50"
        >
          <Upload className="h-5 w-5 text-text-muted" />
          <span className="text-sm text-text-primary">
            Click to attach a file
          </span>
          <span className="text-xs text-text-faint">
            JPG, PNG, or PDF · up to 10MB
          </span>
        </button>
      ) : (
        <div className="rounded-md border border-line bg-ink-900 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText className="h-4 w-4 shrink-0 text-text-muted" />
              <span className="truncate text-sm text-text-primary">
                {file.name}
              </span>
              <span className="shrink-0 text-xs text-text-faint">
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
            {uploadState === "idle" && (
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="shrink-0 text-xs text-text-muted underline hover:text-signal-teal"
              >
                Remove
              </button>
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-2 text-xs">
            {uploadState === "uploading" && (
              <>
                <Loader className="h-3.5 w-3.5 text-signal-teal" />
                <span className="text-text-muted">
                  Stripping metadata and encrypting…
                </span>
              </>
            )}
            {uploadState === "success" && (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-signal-teal" />
                <span className="text-signal-teal">
                  Metadata stripped
                  {metadataRemoved ? ` — removed ${metadataRemoved}` : ""}
                </span>
              </>
            )}
            {uploadState === "error" && (
              <>
                <XCircle className="h-3.5 w-3.5 text-status-high" />
                <span className="text-status-high">
                  {uploadError ?? "Upload failed. Try again."}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />
    </div>
  );
}
