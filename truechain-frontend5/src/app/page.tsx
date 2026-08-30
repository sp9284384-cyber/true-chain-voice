'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FileText,
  ShieldOff,
  Lock,
  Link2,
  Search,
  UserX,
  FileX2,
  Fingerprint,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CHAIN_NODES = ['#H-001', '#H-002', '#H-003', '#H-004', '#H-005', '#H-006', '#H-007'];

const ARC_POSITIONS = [
  { x: -210, y: 60 },
  { x: -140, y: 15 },
  { x: -70, y: -20 },
  { x: 0, y: -30 },
  { x: 70, y: -20 },
  { x: 140, y: 15 },
  { x: 210, y: 60 },
];

const STEPS = [
  { icon: FileText, label: 'Submit your report anonymously', short: 'Report' },
  { icon: ShieldOff, label: 'Metadata and PII stripped automatically', short: 'Sanitize' },
  { icon: Lock, label: 'Content encrypted at rest', short: 'Encrypt' },
  { icon: Link2, label: 'Cryptographically linked to previous reports', short: 'Hash-Chain' },
  { icon: Search, label: 'Authorized investigators review securely', short: 'Investigate' },
];

const TRUST_CARDS = [
  {
    icon: UserX,
    title: 'Zero PII Collected',
    description: 'No name, email, phone, or IP address is ever stored.',
  },
  {
    icon: FileX2,
    title: 'Metadata Stripped Automatically',
    description: 'EXIF data, GPS coordinates, and document properties removed from uploads.',
  },
  {
    icon: Fingerprint,
    title: 'Tamper-Evident by Design',
    description: 'Every report is cryptographically linked. Any modification breaks the chain.',
  },
];

/* ------------------------------------------------------------------ */
/*  Pre-computed connector lines                                       */
/* ------------------------------------------------------------------ */

const CONNECTORS = ARC_POSITIONS.slice(0, -1).map((a, i) => {
  const b = ARC_POSITIONS[i + 1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return { x: a.x, y: a.y, length, angle, delay: 0.25 + i * 0.14 };
});

/* ------------------------------------------------------------------ */
/*  CSS 3D Hash-Chain Hero Visualization                              */
/* ------------------------------------------------------------------ */

function HashChainVisualization() {
  return (
    <div
      className="chain-group relative mx-auto h-[320px] w-full max-w-[520px] [perspective:800px] sm:h-[380px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {CONNECTORS.map((c, i) => (
        <motion.div
          key={'line-' + i}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[1.5px] origin-left"
          style={{
            width: c.length,
            transform: 'translate(' + c.x + 'px, ' + c.y + 'px) rotate(' + c.angle + 'deg)',
            background: 'linear-gradient(to right, rgba(13,148,136,0.6), rgba(13,148,136,0.35))',
            boxShadow: '0 0 6px rgba(13,148,136,0.3)',
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: c.delay }}
        />
      ))}

      {CHAIN_NODES.map((label, i) => {
        const pos = ARC_POSITIONS[i];
        return (
          <motion.div
            key={label}
            className="chain-node absolute flex flex-col items-center gap-1"
            style={{
              left: '50%',
              top: '50%',
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, scale: 0.3, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: pos.x,
              y: pos.y,
            }}
            transition={{
              duration: 0.55,
              delay: i * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="chain-node-enter flex h-[68px] w-[68px] items-center justify-center rounded-lg border border-[#0d9488]/50 bg-[#0d9488]/10 backdrop-blur-sm sm:h-[76px] sm:w-[76px]"
              style={{
                animationDelay: i * 0.15 + 's',
                boxShadow: '0 0 12px rgba(13,148,136,0.3), inset 0 0 12px rgba(13,148,136,0.08)',
              }}
            >
              <span className="font-mono text-[10px] font-semibold tracking-wide text-[#2dd4bf] sm:text-xs">
                {label}
              </span>
            </div>
            <span
              className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#0d9488]/60"
              style={{ boxShadow: '0 0 6px rgba(13,148,136,0.5)' }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            From submission to investigation — every step preserves your anonymity.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.short}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                className="flex flex-1 flex-col items-center gap-3 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-lg border border-[#0d9488]/30 bg-[#0d9488]/10">
                  <Icon className="size-5 text-[#0d9488]" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0d9488]">
                  {step.short}
                </span>
                <p className="max-w-[180px] text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {step.label}
                </p>
                {i < STEPS.length - 1 && (
                  <span className="hidden -mb-4 mt-0 text-[#0d9488]/40 sm:block">
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why Trust This                                                     */
/* ------------------------------------------------------------------ */

function WhyTrustThis() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="border-t border-border bg-card/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why Trust This Platform
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Built from the ground up so that the platform cannot know who you are.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.12 }}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-[#0d9488]/40"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#0d9488]/30 bg-[#0d9488]/10">
                  <Icon className="size-5 text-[#0d9488]" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div
            className="pointer-events-none absolute -right-40 top-1/2 -z-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-20 sm:right-0 sm:opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center gap-12 px-4 py-16 sm:px-6 md:min-h-[calc(100vh-3.5rem)] md:flex-row md:items-center md:gap-16 md:py-0">
            {/* Left: text */}
            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                Report without revealing your identity.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base"
              >
                Cryptographically secured, tamper-evident anonymous reporting for
                harassment, corruption, and misconduct.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[#0d9488] text-white hover:bg-[#0d9488]/90"
                >
                  <Link href="/report">
                    Submit a Report
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link href="/verify">Verify Chain Integrity</Link>
                </Button>
              </motion.div>

              {/* Evaluator & Investigator Note Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 w-full max-w-lg rounded-xl border border-[#0d9488]/30 bg-[#0d9488]/10 p-4 text-left shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-[#0d9488] font-semibold text-xs tracking-wider uppercase mb-1.5">
                  <Shield className="size-4 shrink-0" />
                  <span>Evaluator & Investigator Demo Access</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  After submitting a report, evaluators and investigators can log in to review decrypted report content and evidence attachments:
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-[#0d9488]/20 bg-background/80 px-3.5 py-2 text-xs font-mono">
                  <span>Username: <strong className="text-foreground select-all">admin</strong></span>
                  <span className="text-muted-foreground/40">|</span>
                  <span>Password: <strong className="text-foreground select-all">changeme123</strong></span>
                  <Link href="/investigator/login" className="ml-auto text-[#0d9488] underline font-sans font-medium hover:text-[#0d9488]/80">
                    Login Portal →
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right: 3D chain visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full max-w-md flex-1 items-center justify-center md:max-w-none"
            >
              <HashChainVisualization />
            </motion.div>
          </div>
        </section>

        <HowItWorks />
        <WhyTrustThis />
      </main>

      <Footer />
    </div>
  );
}
