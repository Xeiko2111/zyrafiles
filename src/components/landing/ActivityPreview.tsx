import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useUploads } from "../../hooks/useUploads";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "../../lib/router";
import { formatDateTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { TypeBadge } from "../ui/TypeBadge";
import { Skeleton } from "../ui/Skeleton";

export function ActivityPreview() {
  const { uploads, status } = useUploads();
  const { getUser, user } = useAuth();
  const { navigate } = useRouter();
  const recent = uploads.slice(0, 3);

  return (
    <section id="actividad" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6 }}>
          <p className="label mb-4 text-primary">Actividad</p>
          <h2 className="h2 text-[clamp(2rem,4.5vw,3.25rem)]">Actividad reciente</h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-fg-secondary">
            Lo último que ha subido el equipo, con su autor y la hora exacta. Entra para ver el historial completo, filtrar por persona o buscar cualquier cosa.
          </p>
          <Button className="mt-8" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => navigate(user ? "/app/activity" : "/login?next=/app/activity")}>
            Ver toda la actividad
          </Button>
        </motion.div>

        <div className="relative">
          <div className="absolute -inset-6 hidden rounded-[36px] bg-primary/10 blur-3xl md:block" aria-hidden="true" />
          <ol className="relative flex flex-col gap-3">
            {status === "loading"
              ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)
              : recent.length === 0
              ? (
                  <li className="glass rounded-2xl border border-dashed border-line p-8 text-center">
                    <p className="text-[15px] font-semibold text-fg">Todavía no hay actividad</p>
                    <p className="mt-1 text-sm text-fg-muted">Cuando alguien del equipo suba algo aparecerá aquí.</p>
                  </li>
                )
              : recent.map((u, i) => {
                  const a = getUser(u.userId);
                  return (
                    <motion.li
                      key={u.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="glass flex items-center gap-4 rounded-2xl border border-line p-4 shadow-card transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/40 sm:p-5"
                      style={{ marginLeft: `${i * 4}%` }}
                    >
                      <Avatar src={a?.avatar} name={a?.displayName ?? u.username} size="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-fg">{a?.displayName ?? u.username}</p>
                        <p className="truncate text-[15px] text-fg-secondary">{u.title}</p>
                        <p className="meta mt-1">{formatDateTime(u.createdAt)}</p>
                      </div>
                      <TypeBadge type={u.type} className="hidden sm:inline-flex" />
                    </motion.li>
                  );
                })}
          </ol>
        </div>
      </div>
    </section>
  );
}
