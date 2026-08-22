import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/60 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="size-3.5" />
          <p className="text-sm">
            Your privacy is non-negotiable.
          </p>
        </div>
        <Link
          href="/verify"
          className="text-xs text-primary transition-colors hover:text-primary/80"
        >
          Verify Chain Integrity →
        </Link>
      </div>
    </footer>
  );
}
