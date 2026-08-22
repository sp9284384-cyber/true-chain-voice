'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ChainVerifyPanel } from '@/components/verify/ChainVerifyPanel';
import { Lock, Eye, ShieldCheck } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center sm:mb-14"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10"
            >
              <ShieldCheck className="size-7 text-primary" />
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Verify Chain Integrity
            </h1>

            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Anyone can verify that no reports have been tampered with.
            </p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 grid grid-cols-1 gap-3 sm:mb-12 sm:grid-cols-3"
          >
            {[
              {
                icon: Lock,
                label: 'Cryptographic',
                desc: 'SHA-256 hash chain',
              },
              {
                icon: Eye,
                label: 'Public',
                desc: 'No login required',
              },
              {
                icon: ShieldCheck,
                label: 'Tamper-proof',
                desc: 'Detects any modification',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main verification panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChainVerifyPanel />
          </motion.div>

          {/* How it works section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 rounded-2xl border border-border bg-card/30 p-6 sm:mt-16 sm:p-8"
          >
            <h2 className="mb-5 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              How It Works
            </h2>
            <div className="mx-auto max-w-xl space-y-4">
              {[
                {
                  step: '1',
                  title: 'Each report is hashed',
                  desc: 'When a report is submitted, a SHA-256 cryptographic hash is generated from its content.',
                },
                {
                  step: '2',
                  title: 'Hashes are chained together',
                  desc: "Each report\u2019s hash includes the previous report\u2019s hash, creating an immutable chain.",
                },
                {
                  step: '3',
                  title: 'Any change breaks the chain',
                  desc: 'If a single report is modified, its hash changes and every subsequent link fails verification.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
