import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>We never collect your name, email, or IP address.</p>
        <Link href="/verify" className="text-trust hover:opacity-80">
          Verify chain integrity →
        </Link>
      </div>
    </footer>
  );
}
