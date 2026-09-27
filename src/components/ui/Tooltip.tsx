import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom";
  disabled?: boolean;
  className?: string;
}

const pos = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-3",
};
const offset = { top: { y: 4 }, bottom: { y: -4 }, right: { x: -4 } };

export function Tooltip({ content, children, side = "top", disabled, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && !disabled && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, ...offset[side] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className={cn(
              "pointer-events-none absolute z-[90] whitespace-nowrap rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-medium text-fg shadow-pop",
              pos[side],
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
