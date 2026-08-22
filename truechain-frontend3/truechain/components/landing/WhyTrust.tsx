"use client";

import { motion } from "framer-motion";

const CARDS = [
  {
    title: "Zero PII collected",
    detail: "No name, email, phone, or employee ID field exists anywhere in the submission flow.",
  },
  {
    title: "Metadata stripped automatically",
    detail: "EXIF, GPS, and device metadata are removed from uploads before anything touches disk.",
  },
  {
    title: "Tamper-evident by design",
    detail: "Each report's hash depends on the one before it — modifying history breaks verification.",
  },
];

export function WhyTrust() {
  return (
    <section className="border-b border-line py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-2xl text-ink">Why trust this</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
              className="rounded-card border border-line bg-surface p-5"
            >
              <p className="text-sm font-medium text-ink">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{card.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
