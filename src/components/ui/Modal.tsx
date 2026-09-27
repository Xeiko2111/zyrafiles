import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Oculta la cabecera por defecto (para layouts propios). */
  bare?: boolean;
  labelledBy?: string;
}

export function Modal({ open, onClose, title, children, className, bare, labelledBy }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => panel.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-card shadow-pop outline-none sm:max-w-lg sm:rounded-3xl",
              className,
            )}
          >
            {!bare && (
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                <h2 id={labelledBy} className="h3 text-lg">
                  {title}
                </h2>
                <button onClick={onClose} className="rounded-lg p-1.5 text-fg-muted transition hover:bg-fg/5 hover:text-fg" aria-label="Cerrar">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
