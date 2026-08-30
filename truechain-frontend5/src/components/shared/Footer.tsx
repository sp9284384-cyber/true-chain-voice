'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  const handleVerifyClick = (e: React.MouseEvent) => {
    if (pathname === '/verify') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('reverify-chain'));
    }
  };

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
          onClick={handleVerifyClick}
          className="text-xs text-primary transition-colors hover:text-primary/80"
        >
          Verify Chain Integrity →
        </Link>
      </div>
    </footer>
  );
}
