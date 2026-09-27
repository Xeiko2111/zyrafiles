import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { usePreferences } from "../../hooks/usePreferences";
import { useRouter } from "../../lib/router";
import { UploadDetailModal } from "../activity/UploadDetailModal";
import { CommandPalette } from "./CommandPalette";
import { NAV_ITEMS } from "./nav";
import { PageTransition } from "./PageTransition";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ children }: { children: ReactNode }) {
  const { prefs, update } = usePreferences();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const gPressed = useRef(0);

  // Atajos: ⌘K / Ctrl+K búsqueda · "G" + letra para navegar · "N" nueva subida
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /input|textarea|select/i.test(t.tagName) || t.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "g") {
        gPressed.current = Date.now();
        return;
      }
      if (Date.now() - gPressed.current < 900) {
        const item = NAV_ITEMS.find((n) => n.key === k);
        if (item) {
          navigate(item.to);
          gPressed.current = 0;
        }
      } else if (k === "n") navigate("/app/upload");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => setMobileOpen(false), [path]);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar collapsed={prefs.sidebarCollapsed} onToggle={() => update({ sidebarCollapsed: !prefs.sidebarCollapsed })} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
            <motion.div
              className="relative h-full w-[280px] shadow-pop"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full bg-bg">
                <Sidebar collapsed={false} mobile onNavigate={() => setMobileOpen(false)} />
              </div>
              <button onClick={() => setMobileOpen(false)} className="absolute -right-12 top-4 rounded-full bg-card p-2 text-fg shadow-pop" aria-label="Cerrar menú">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
        <main className="relative flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(var(--primary)/0.10),transparent)]" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl">
            <PageTransition routeKey={path}>{children}</PageTransition>
          </div>
        </main>
      </div>

      <UploadDetailModal />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
