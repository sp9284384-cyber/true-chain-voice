"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";
import { HeroChainFallback } from "./HeroChainFallback";

// The 3D scene never renders on the server (WebGL doesn't exist there) and
// is loaded lazily on the client. The Suspense fallback below covers both
// the dynamic-import wait and the scene's own first paint, so there's never
// a blank box — just the static chain graphic until the real one is ready.
const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <HeroChainFallback />,
});

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="order-2 md:order-1">
          <h1 className="font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            Report without revealing your identity.
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink-muted">
            Submit a report with no name, no email, no account — and get a tamper-evident record that anyone can
            verify, including you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/report"
              className="rounded-card bg-trust px-5 py-3 text-sm font-medium text-paper hover:opacity-90"
            >
              Submit a report
            </Link>
            <Link
              href="/verify"
              className="rounded-card border border-line bg-surface px-5 py-3 text-sm font-medium text-ink hover:bg-surface-raised"
            >
              Verify chain integrity
            </Link>
          </div>
        </div>

        <div className="order-1 h-64 sm:h-80 md:order-2 md:h-[420px]">
          <Suspense fallback={<HeroChainFallback />}>
            <HeroScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
