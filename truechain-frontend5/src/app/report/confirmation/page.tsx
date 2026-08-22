'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Copy, Check, AlertTriangle, Shield } from 'lucide-react';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { useToast } from '@/hooks/use-toast';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Store this token in a safe place.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please manually select and copy the token.',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
        <p className="text-muted-foreground">No session token found. Please submit a report first.</p>
      </main>
      <Footer />
    </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          {/* Success icon */}
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
              <Shield className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Report Submitted
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your report has been encrypted and added to the chain.
            </p>
          </div>

          <PrivacyNotice />

          {/* Token box */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-3 text-sm font-medium text-foreground">
              Your Session Token
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-secondary/50 px-4 py-3 font-mono text-sm text-foreground">
              <span className="min-w-0 flex-1 select-all break-all">{token}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="size-8 shrink-0 text-primary hover:bg-primary/10"
                aria-label="Copy token"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>

            {/* Warning */}
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">
                Save this token — it is the only way to check your report later. We cannot recover it for you.
              </p>
            </div>

            {/* Link to check status */}
            <div className="mt-6 text-center">
              <Link href={`/status/${encodeURIComponent(token)}`}>
                <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/10 hover:text-primary">
                  Check Report Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
