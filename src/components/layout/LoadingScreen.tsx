import { motion } from "motion/react";
import { LogoMark } from "../ui/Logo";

/** Pantalla de carga inicial: logo con fade, escala y brillo violeta. */
export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-label="Cargando ZyraFiles"
    >
      <div className="relative">
        <motion.div
          className="absolute inset-[-40%] rounded-full bg-primary/40 blur-3xl"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}>
          <LogoMark size={72} />
        </motion.div>
      </div>
      <motion.p
        className="mt-6 font-display text-2xl font-extrabold tracking-[-0.03em] text-fg"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        Zyra<span className="text-gradient">Files</span>
      </motion.p>
      <div className="mt-6 h-[2px] w-28 overflow-hidden rounded-full bg-fg/10">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </motion.div>
  );
}
