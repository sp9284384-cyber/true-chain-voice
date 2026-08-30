'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Shield, KeyRound } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StatusLookupPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) return;

    router.push(`/status/${encodeURIComponent(cleanToken)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          {/* Header section */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Shield className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Check Report Status
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your secret 64-character session token to view your report&apos;s progress.
            </p>
          </div>

          <PrivacyNotice />

          {/* Token search form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="token-input" className="text-sm font-medium text-foreground flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                Session Token
              </Label>
              <Input
                id="token-input"
                type="text"
                placeholder="e.g. x9r4_87ww2CW_scMb2c7wtw6CnhyGCx5NC_-h73_WUQ"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Your token was provided when you submitted your report. It is the only link to your report.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!tokenInput.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Search className="mr-2 size-4" />
              Check Status
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
