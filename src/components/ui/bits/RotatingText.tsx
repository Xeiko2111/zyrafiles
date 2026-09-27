/** Frases que se suceden con blur + slide (estilo "Rotating Text" de React Bits). */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../lib/utils";

export function RotatingText({ items, interval = 2400, className }: { items: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % items.length), interval);
    return () => window.clearInterval(t);
  }, [items.length, interval]);
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          className="col-start-1 row-start-1 inline-block"
          initial={{ y: "60%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-60%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
