"use client";

import { useState } from "react";
import { Copy, CheckCircle } from "@/components/shared/icons";

export default function TokenDisplay({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in some contexts — the token is still
      // selectable text, so this isn't a dead end for the user.
    }
  }

  return (
    <div className="rounded-md border border-signal-teal/30 bg-ink-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <code className="select-all break-all font-mono text-lg text-signal-teal">
          {token}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary shrink-0 !px-3 !py-2 text-xs"
        >
          {copied ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
