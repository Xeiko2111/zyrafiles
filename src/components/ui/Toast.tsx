import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "../../lib/utils";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastApi {
  toast: (t: Omit<ToastItem, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const icons = {
  success: <CircleCheck className="h-[18px] w-[18px] text-success" />,
  error: <TriangleAlert className="h-[18px] w-[18px] text-warning" />,
  info: <Info className="h-[18px] w-[18px] text-primary" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = ++counter.current;
      setItems((l) => [...l.slice(-3), { ...t, id }]);
      window.setTimeout(() => dismiss(id), t.kind === "error" ? 5200 : 3600);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      toast,
      success: (title, description) => toast({ kind: "success", title, description }),
      error: (title, description) => toast({ kind: "error", title, description }),
      info: (title, description) => toast({ kind: "info", title, description }),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end" aria-live="polite" role="status">
          <AnimatePresence>
            {items.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line py-3 pl-4 pr-3 shadow-pop",
                  t.kind === "success" && "border-success/25",
                  t.kind === "error" && "border-warning/30",
                )}
              >
                <span className="mt-0.5">{icons[t.kind]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-[13px] leading-snug text-fg-secondary">{t.description}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="rounded-md p-1 text-fg-muted transition hover:text-fg" aria-label="Cerrar notificación">
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
