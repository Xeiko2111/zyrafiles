import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { CircleCheck, FileText } from "lucide-react";
import { useUploads } from "../../hooks/useUploads";
import { formatTime, greeting, toISODate } from "../../lib/utils";
import { TypeIcon } from "../ui/TypeBadge";
import { useAuth } from "../../hooks/useAuth";
import { LogoMark } from "../ui/Logo";

/** Ventana de producto flotante con parallax sutil al hacer scroll. */
export function HeroVisual() {
  const { user, getUser } = useAuth();
  const { uploads } = useUploads();
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, window.scrollY / 600);
        el.style.transform = `perspective(1400px) rotateX(${14 - p * 14}deg) translateY(${p * -20}px) scale(${0.96 + p * 0.04})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Todo sale de las publicaciones reales del equipo.
  const today = toISODate(new Date());
  const rows = uploads.slice(0, 4);
  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return uploads.filter((u) => u.date === toISODate(d)).length;
  });
  const maxBar = Math.max(1, ...bars);
  const weekTotal = bars.reduce((a, b) => a + b, 0);
  const last = uploads[0];

  return (
    <div className="relative mx-auto mt-16 w-full max-w-5xl sm:mt-20">
      <div className="absolute -inset-x-10 -top-10 bottom-0 hidden rounded-[40px] bg-primary/20 blur-[90px] md:block" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div ref={wrap} className="origin-top will-change-transform" style={{ transform: "perspective(1400px) rotateX(14deg) scale(.96)" }}>
          <div className="overflow-hidden rounded-[22px] border border-line bg-card/90 shadow-pop ring-1 ring-primary/10 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
              <span className="mx-auto rounded-md bg-bg-secondary px-3 py-1 font-mono text-[11px] text-fg-muted">zyrafiles.app/dashboard</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
              <div className="hidden flex-col gap-1 border-r border-line p-3 md:flex">
                <div className="mb-3 flex items-center gap-2 px-2"><LogoMark size={22} /><span className="text-xs font-bold">ZyraFiles</span></div>
                {["Dashboard", "Subir contenido", "Mi actividad", "Actividad del equipo", "Todos los archivos"].map((l, i) => (
                  <div key={l} className={`rounded-lg px-2.5 py-1.5 text-[11px] ${i === 0 ? "bg-primary/15 font-semibold text-fg" : "text-fg-muted"}`}>{l}</div>
                ))}
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-left font-display text-lg font-bold sm:text-xl">{user ? `${greeting()}, ${user.displayName} 👋` : `${greeting()} 👋`}</p>
                <p className="text-left text-xs text-fg-muted">Esto es lo que ha ocurrido hoy.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[["Subidas hoy", String(uploads.filter((u) => u.date === today).length)], ["Archivos totales", String(uploads.length)], ["Esta semana", String(weekTotal)], ["Última subida", last ? formatTime(last.createdAt) : "—"]].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-line bg-bg-secondary/60 p-2.5 text-left">
                      <p className="text-[10px] text-fg-muted">{k}</p>
                      <p className="font-display text-lg font-bold tabular-nums">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-xl border border-line p-2">
                    {rows.length === 0 && (
                      <p className="px-2 py-6 text-center text-[11px] text-fg-muted">Todavía no hay actividad. Lo que subáis aparecerá aquí.</p>
                    )}
                    {rows.map((r, i) => {
                      const a = getUser(r.userId);
                      return (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left"
                        >
                          <img src={a?.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-semibold">{a?.displayName ?? r.username}</span>
                            <span className="block truncate text-[11px] text-fg-secondary">{r.title}</span>
                          </span>
                          <TypeIcon type={r.type} className="h-3 w-3 text-primary" />
                          <span className="font-mono text-[10px] text-fg-muted">{formatTime(r.createdAt)}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="hidden items-end gap-1.5 rounded-xl border border-line p-3 sm:flex">
                    {bars.map((b, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 origin-bottom rounded-md bg-gradient-to-t from-primary-deep to-primary"
                        style={{ height: `${Math.max(4, (b / maxBar) * 90)}%` }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas flotantes */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute -left-2 top-[38%] hidden lg:block xl:-left-12"
      >
        <div className="glass flex animate-float items-center gap-3 rounded-2xl border border-line p-3 pr-5 shadow-pop">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><FileText className="h-5 w-5" /></span>
          <span className="text-left">
            <span className="block text-sm font-semibold">documento.pdf</span>
            <span className="block font-mono text-[11px] text-fg-muted">2.4 MB · <span className="text-success">✓ Listo</span></span>
          </span>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.6 }}
        className="absolute -right-2 top-[16%] hidden lg:block xl:-right-10"
      >
        <div className="glass flex items-center gap-2.5 rounded-2xl border border-success/25 px-4 py-3 shadow-pop [animation:float_8s_ease-in-out_infinite_1s]">
          <CircleCheck className="h-5 w-5 text-success" />
          <span className="text-sm font-semibold">Subido correctamente</span>
        </div>
      </motion.div>
    </div>
  );
}
