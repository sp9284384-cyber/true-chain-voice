"use client";

import { motion } from "framer-motion";
import { FileText, Scan, Lock, LinkChain, Eye } from "@/components/shared/icons";

const STEPS = [
  { icon: FileText, label: "Report", detail: "Free-text submission, no identity fields" },
  { icon: Scan, label: "Sanitize", detail: "EXIF, GPS, and device metadata stripped" },
  { icon: Lock, label: "Encrypt", detail: "Content encrypted before it touches disk" },
  { icon: LinkChain, label: "Hash-chain", detail: "Linked to every prior record" },
  { icon: Eye, label: "Investigator", detail: "Reviewed without ever seeing who filed it" },
];

export default function HowItWorks() {
  return (
    <section className="container-page py-20 sm:py-28">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="text-center text-2xl font-semibold sm:text-3xl"
      >
        How it works
      </motion.h2>

      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-5 sm:gap-y-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="relative flex flex-col items-center text-center"
            >
              {i < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-7 hidden h-px w-full bg-line sm:block" />
              )}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-ink-900">
                <Icon className="h-6 w-6 text-signal-teal" />
              </div>
              <p className="mt-4 font-display text-sm font-semibold">
                {step.label}
              </p>
              <p className="mt-1 max-w-[9rem] text-xs text-text-faint">
                {step.detail}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
