import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useRouter } from "../../lib/router";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { scrollToId } from "./scroll";

const LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "que-es", label: "Qué es" },
  { id: "actividad", label: "Actividad" },
];

export function Navbar() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      let current = "inicio";
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top < 160) current = l.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };
  const access = () => navigate(user ? "/app" : "/login");

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
    >
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center gap-4 rounded-2xl border px-3 pl-4 transition-[background-color,border-color,box-shadow] duration-300",
          scrolled ? "glass border-line shadow-card" : "border-transparent",
        )}
        aria-label="Principal"
      >
        <button onClick={() => go("inicio")} className="rounded-xl" aria-label="ZyraFiles, inicio">
          <Logo size={28} />
        </button>
        <ul className="ml-6 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={cn("relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", active === l.id ? "text-fg" : "text-fg-muted hover:text-fg")}
              >
                {l.label}
                {active === l.id && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />}
              </button>
            </li>
          ))}
          <li>
            <button onClick={access} className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg">
              Acceder
            </button>
          </li>
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" className="hidden h-9 sm:inline-flex" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={access}>
            {user ? "Ir al dashboard" : "Acceder"}
          </Button>
          <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-fg md:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-2xl border border-line p-2 shadow-pop md:hidden"
          >
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="block w-full rounded-xl px-4 py-3 text-left text-[15px] font-medium text-fg-secondary hover:bg-fg/5 hover:text-fg">
                {l.label}
              </button>
            ))}
            <Button className="mt-2 w-full" onClick={access}>
              {user ? "Ir al dashboard" : "Acceder"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
