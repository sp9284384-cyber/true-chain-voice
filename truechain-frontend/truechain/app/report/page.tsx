import Header from "@/components/shared/Header";
import PrivacyNotice from "@/components/shared/PrivacyNotice";
import ReportForm from "@/components/report/ReportForm";

export const metadata = { title: "Submit a report — TrueChain" };

export default function ReportPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Submit a report
          </h1>
          <p className="mt-3 text-text-muted">
            No account, no name, no email. Just tell us what happened.
          </p>

          <div className="mt-6">
            <PrivacyNotice />
          </div>

          <div className="mt-8">
            <ReportForm />
          </div>
        </div>
      </main>
    </div>
  );
}
