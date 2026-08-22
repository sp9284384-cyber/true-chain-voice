import { Header } from "@/components/shared/Header";
import { PrivacyNotice } from "@/components/shared/PrivacyNotice";
import { ReportForm } from "@/components/report/ReportForm";

export const metadata = { title: "File a report — TrueChain" };

export default function ReportPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl text-ink">File a report</h1>
        <p className="mt-2 text-ink-muted">
          Take your time. There's no account, no name, and no way for us to know who you are.
        </p>

        <PrivacyNotice className="my-6" />

        <ReportForm />
      </main>
    </div>
  );
}
