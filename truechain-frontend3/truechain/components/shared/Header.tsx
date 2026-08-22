import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          TrueChain
        </Link>
        <nav className="flex items-center gap-5 text-sm text-ink-muted">
          <Link href="/report" className="hover:text-ink">
            File a report
          </Link>
          <Link href="/verify" className="hover:text-ink">
            Verify chain
          </Link>
        </nav>
      </div>
    </header>
  );
}
