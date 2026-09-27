import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { useUploads } from "../../hooks/useUploads";
import { useAuth } from "../../hooks/useAuth";
import { matchesQuery } from "../../hooks/useFilteredUploads";
import { useRouter } from "../../lib/router";
import { cn, formatLongDate, formatTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { TypeBadge } from "../ui/TypeBadge";
import { NAV_ITEMS } from "./nav";

/** Búsqueda global (⌘K / Ctrl+K): título, descripción, usuario, tipo y fecha. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { uploads, openUpload } = useUploads();
  const { getUser } = useAuth();
  const { navigate } = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (q.trim() ? uploads.filter((u) => matchesQuery(u, q)).slice(0, 8) : uploads.slice(0, 5)), [uploads, q]);
  const pages = useMemo(() => NAV_ITEMS.filter((n) => q.trim() && n.label.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  const total = pages.length + results.length;

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      window.setTimeout(() => input.current?.focus(), 40);
    }
  }, [open]);
  useEffect(() => setActive(0), [q]);

  const choose = (i: number) => {
    onClose();
    if (i < pages.length) navigate(pages[i].to);
    else openUpload(results[i - pages.length].id);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(total - 1, a + 1)));
    if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    if (e.key === "Enter" && total) (e.preventDefault(), choose(active));
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Búsqueda global"
            onKeyDown={onKey}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-card shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-primary" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca por título, persona, tipo o fecha… (p. ej. logo)"
                className="h-14 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-muted"
                aria-label="Buscar en ZyraFiles"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">ESC</kbd>
            </div>
            <div className="max-h-[56vh] overflow-y-auto p-2">
              {pages.length > 0 && <p className="label px-3 pb-1 pt-2">Páginas</p>}
              {pages.map((p, i) => (
                <button
                  key={p.to}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm", active === i ? "bg-primary/10 text-fg" : "text-fg-secondary")}
                >
                  <p.icon className="h-4 w-4 text-primary" />
                  {p.label}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                </button>
              ))}
              <p className="label px-3 pb-1 pt-2">{q.trim() ? `Publicaciones · ${results.length}` : "Recientes"}</p>
              {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-fg-muted">Sin resultados para “{q}”.</p>}
              {results.map((u, j) => {
                const i = j + pages.length;
                const a = getUser(u.userId);
                return (
                  <button
                    key={u.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left", active === i ? "bg-primary/10" : "")}
                  >
                    <Avatar src={a?.avatar} name={a?.displayName ?? u.username} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg">{u.title}</span>
                      <span className="block truncate text-xs text-fg-muted">
                        {a?.displayName ?? u.username} · {formatLongDate(u.createdAt)} · {formatTime(u.createdAt)}
                      </span>
                    </span>
                    <TypeBadge type={u.type} className="hidden sm:inline-flex" />
                    {active === i && <CornerDownLeft className="h-3.5 w-3.5 text-fg-muted" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
