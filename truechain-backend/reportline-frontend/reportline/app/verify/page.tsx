import { Header } from "@/components/shared/Header";
import { ChainVerifyPanel } from "@/components/verify/ChainVerifyPanel";

export const metadata = { title: "Verify chain — ReportLine" };

export default function VerifyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl text-ink">Public chain verification</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Anyone can run this check — no login required. It walks every report in the system and confirms none of
          them have been altered since submission.
        </p>

        <div className="mt-8">
          <ChainVerifyPanel />
        </div>
      </main>
    </div>
  );
}
