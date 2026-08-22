"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PrivacyNotice } from "@/components/shared/PrivacyNotice";

function ConfirmationContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable; the token is still selectable text.
    }
  }

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-ink-muted">No token to display. If you just submitted a report, go back and try again.</p>
        <Link href="/report" className="mt-4 text-sm font-medium text-trust underline underline-offset-2">
          Back to report form
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-card border border-trust/30 bg-trust-soft px-4 py-2.5 text-center text-sm font-medium text-trust">
        Report submitted
      </div>

      <h1 className="mt-6 font-display text-2xl text-ink">Save this token</h1>
      <p className="mt-2 text-sm text-ink-muted">
        It's the only way to check your report later. We cannot recover it for you — not by email, not by phone,
        not for anyone, under any circumstance.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-4">
        <code className="break-all font-mono text-sm text-ink">{token}</code>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded-card bg-trust px-3 py-1.5 text-xs font-medium text-paper hover:opacity-90"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <PrivacyNotice className="mt-6" />

      <Link
        href={`/status/${encodeURIComponent(token)}`}
        className="mt-8 text-center text-sm font-medium text-trust underline underline-offset-2"
      >
        Check status with this token
      </Link>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
