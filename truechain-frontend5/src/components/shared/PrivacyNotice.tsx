'use client';

import { ShieldCheck } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5">
      <ShieldCheck className="size-4 shrink-0 text-primary" />
      <p className="text-xs text-muted-foreground">
        We never collect your name, email, or IP address.
      </p>
    </div>
  );
}
