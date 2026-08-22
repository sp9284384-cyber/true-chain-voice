"use client";

import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
  error: string | null;
  onError: (message: string | null) => void;
}

export function FileUpload({ file, onChange, error, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function validateAndSet(candidate: File | null) {
    if (!candidate) {
      onChange(null);
      onError(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      onError("Only JPG, PNG, or PDF files are accepted.");
      onChange(null);
      return;
    }
    if (candidate.size > MAX_BYTES) {
      onError("File is larger than 10MB.");
      onChange(null);
      return;
    }
    onError(null);
    onChange(candidate);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        Evidence <span className="font-normal text-ink-muted">(optional — JPG, PNG, or PDF, up to 10MB)</span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndSet(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`rounded-card border border-dashed px-4 py-6 text-center transition-colors ${
          isDragging ? "border-trust bg-trust-soft" : "border-line bg-surface"
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="truncate text-ink">{file.name}</span>
            <button
              type="button"
              onClick={() => validateAndSet(null)}
              className="text-ink-muted underline underline-offset-2 hover:text-alert"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-muted">Drag a file here, or</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1.5 text-sm font-medium text-trust underline underline-offset-2"
            >
              choose a file
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0] ?? null)}
        />
      </div>

      <p className="mt-1.5 text-xs text-ink-muted">
        Metadata like location and device info is stripped before this file is stored.
      </p>
      {error && <p className="mt-1.5 text-xs text-alert">{error}</p>}
    </div>
  );
}
