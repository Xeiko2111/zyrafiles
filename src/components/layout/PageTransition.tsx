import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Transición suave (fade + slide + escala mínima) entre páginas. */
export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 14, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
