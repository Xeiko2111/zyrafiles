import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropdownProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  label?: string;
  icon?: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown<T extends string>({ value, onChange, options, label, icon, align = "right", className }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-card px-3.5 text-sm font-medium text-fg-secondary transition hover:border-line-hover hover:text-fg"
      >
        {icon}
        {label && <span className="text-fg-muted">{label}</span>}
        <span className="text-fg">{current?.label}</span>
        <ChevronDown className={cn("h-4 w-4 text-fg-muted transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-line bg-card p-1 shadow-pop",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition",
                    o.value === value ? "bg-primary/10 text-primary" : "text-fg-secondary hover:bg-fg/5 hover:text-fg",
                  )}
                >
                  {o.icon}
                  <span className="flex-1">{o.label}</span>
                  {o.value === value && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
