import { motion } from "motion/react";
import { RotatingText } from "../ui/bits/RotatingText";

/** Frase rotatoria: haces → creas → compartes → organizado. */
export function Statement() {
  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28" aria-label="Lema">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="h2 mx-auto max-w-5xl text-[clamp(2rem,6vw,4.25rem)] text-fg"
      >
        <RotatingText
          items={["Todo lo que haces.", "Todo lo que creas.", "Todo lo que compartes.", "Todo organizado."]}
          className="[&>span]:bg-[linear-gradient(100deg,rgb(var(--text)),rgb(var(--primary)))] [&>span]:bg-clip-text [&>span]:pb-2 [&>span]:text-transparent"
          interval={2200}
        />
      </motion.p>
      <div className="mx-auto mt-6 h-px max-w-5xl bg-gradient-to-r from-primary/60 via-line to-transparent" />
    </section>
  );
}
