import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { ReportForm } from '@/components/report/ReportForm';
import { Shield } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Page header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Shield className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Submit an Anonymous Report
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your identity is never recorded. Reports are cryptographically
              chained for tamper evidence.
            </p>
          </div>

          <PrivacyNotice />

          {/* Form card */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <ReportForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
