import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-text-faint sm:flex-row">
        <p>We never collect your name, email, or IP address.</p>
        <Link href="/verify" className="text-text-muted hover:text-signal-teal">
          Verify chain integrity →
        </Link>
      </div>
    </footer>
  );
}
