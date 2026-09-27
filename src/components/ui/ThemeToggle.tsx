import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";

/** Botón rápido 🌙/☀️: la luna gira y se convierte en sol (y al revés). */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, setPreference } = useTheme();
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      onClick={() => setPreference(dark ? "light" : "dark")}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-card text-fg-secondary transition hover:border-primary/50 hover:text-primary",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25 }}
          className="inline-flex"
        >
          {dark ? <Moon className="h-[17px] w-[17px]" /> : <Sun className="h-[17px] w-[17px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
