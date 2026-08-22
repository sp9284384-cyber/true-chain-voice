import Link from "next/link";
import { Header } from "@/components/shared/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-2xl flex-col items-start px-6 py-20">
        <h1 className="font-display text-4xl leading-tight text-ink">
          Report without revealing your identity.
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          No name, no email, no account. Just what happened — recorded in a way that can't be quietly edited later.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/report" className="rounded-card bg-ink px-5 py-3 text-sm font-medium text-white hover:opacity-90">
            File a report
          </Link>
          <Link
            href="/verify"
            className="rounded-card border border-line bg-surface px-5 py-3 text-sm font-medium text-ink hover:bg-paper"
          >
            Verify the chain
          </Link>
        </div>
      </main>
    </div>
  );
}
