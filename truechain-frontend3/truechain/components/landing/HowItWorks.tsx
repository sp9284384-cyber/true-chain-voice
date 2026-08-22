"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    label: "Report",
    detail: "Describe what happened. No name or email field exists on the form.",
    icon: (
      <path d="M4 4h11l5 5v11H4V4z M15 4v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    label: "Sanitize",
    detail: "Any attached file has EXIF, GPS, and device metadata stripped before storage.",
    icon: <path d="M12 3l7 3v5c0 4.6-2.98 8.9-7 10-4.02-1.1-7-5.4-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />,
  },
  {
    label: "Encrypt",
    detail: "Content is encrypted at rest, decrypted only for an authenticated investigator.",
    icon: <path d="M6 11V8a6 6 0 0 1 12 0v3M4 11h16v9H4v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />,
  },
  {
    label: "Hash-chain",
    detail: "Each report is cryptographically linked to the one before it — edits break the chain.",
    icon: <path d="M8 12a4 4 0 0 1 4-4h2a4 4 0 0 1 0 8h-1M16 12a4 4 0 0 1-4 4H10a4 4 0 0 1 0-8h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />,
  },
  {
    label: "Investigator",
    detail: "An authorized reviewer triages and updates status — the original report is never edited.",
    icon: <path d="M12 3l8 4v5c0 5-3.4 8.7-8 9.9C7.4 20.7 4 17 4 12V7l8-4z M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" fill="none" />,
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-line bg-surface/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl text-ink">How it works</h2>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" className="text-trust" aria-hidden="true">
                {step.icon}
              </svg>
              <p className="mt-3 text-sm font-medium text-ink">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
