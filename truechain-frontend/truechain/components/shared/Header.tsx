import Link from "next/link";
import { LinkChain } from "./icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink-950/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <LinkChain className="h-5 w-5 text-signal-teal" />
          TrueChain
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/verify"
            className="hidden rounded-md px-3 py-2 text-text-muted transition hover:text-signal-teal sm:inline-block"
          >
            Verify chain
          </Link>
          <Link
            href="/investigator/login"
            className="hidden rounded-md px-3 py-2 text-text-muted transition hover:text-signal-teal sm:inline-block"
          >
            Investigator login
          </Link>
          <Link href="/report" className="btn-primary !px-4 !py-2 text-sm">
            Submit a report
          </Link>
        </nav>
      </div>
    </header>
  );
}
