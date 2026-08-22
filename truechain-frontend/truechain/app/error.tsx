"use client";

import { useEffect } from "react";
import { AlertTriangle } from "@/components/shared/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 text-center text-text-primary">
      <AlertTriangle className="h-10 w-10 text-status-high" />
      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-text-muted">
        That's on us, not you. Try again, and if it keeps happening, come
        back later.
      </p>
      <button onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
