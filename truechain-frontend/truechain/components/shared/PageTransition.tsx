"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Deliberately minimal: opacity-only fade, no layout-shifting motion,
// so it never fights with real content while a route resolves.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
