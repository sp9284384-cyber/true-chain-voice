"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Scan, LinkChain } from "@/components/shared/icons";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "Zero PII collected",
    detail:
      "The report form has no name, email, or ID field to begin with — there's nothing to leak because it was never asked for.",
  },
  {
    icon: Scan,
    title: "Metadata stripped automatically",
    detail:
      "Every uploaded file is cleaned of EXIF, GPS, and device metadata before it's stored, closing the most common way anonymity leaks accidentally.",
  },
  {
    icon: LinkChain,
    title: "Tamper-evident by design",
    detail:
      "Each report is hashed together with the one before it. Altering any past record breaks the chain in a way that's mathematically detectable, not just logged.",
  },
];

export default function WhyTrust() {
  return (
    <section className="container-page py-20 sm:py-28">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="text-center text-2xl font-semibold sm:text-3xl"
      >
        Why trust this
      </motion.h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="card"
            >
              <Icon className="h-6 w-6 text-signal-teal" />
              <h3 className="mt-4 font-display text-base font-semibold">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{card.detail}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
