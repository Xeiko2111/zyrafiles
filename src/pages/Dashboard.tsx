import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Clock, Files, TrendingUp, CloudUpload } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUploads } from "../hooks/useUploads";
import { inRange } from "../hooks/useFilteredUploads";
import { useRouter, Link } from "../lib/router";
import { formatTime, greeting, relativeTime, toISODate } from "../lib/utils";
import { StatCard } from "../components/dashboard/StatCard";
import { WeeklyChart } from "../components/dashboard/WeeklyChart";
import { Timeline } from "../components/dashboard/Timeline";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { ActivitySkeleton, Skeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/States";

export default function Dashboard() {
  const { user, users } = useAuth();
  const { uploads, status, reload } = useUploads();
  const { navigate } = useRouter();

  const stats = useMemo(() => {
    const today = toISODate(new Date());
    const todays = uploads.filter((u) => u.date === today);
    const week = uploads.filter((u) => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return u.date >= toISODate(d);
    });
    return { today: todays.length, total: uploads.length, week: week.length, last: uploads[0], todays };
  }, [uploads]);

  const byUserToday = useMemo(
    () => users.map((u) => ({ user: u, count: uploads.filter((x) => x.userId === u.id && inRange(x, "today")).length, last: uploads.find((x) => x.userId === u.id) })),
    [users, uploads],
  );

  if (!user) return null;
  const recent = stats.todays.length >= 3 ? stats.todays.slice(0, 6) : uploads.slice(0, 6);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h2 text-[clamp(1.9rem,4vw,2.75rem)]"
          >
            {greeting()}, <span className="text-gradient">{user.displayName}</span> <span className="inline-block origin-[70%_70%] animate-[wave_1.6s_ease-in-out_0.6s_2]">👋</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="mt-2 text-[15px] text-fg-secondary">
            Esto es lo que ha ocurrido hoy.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button leftIcon={<CloudUpload className="h-4 w-4" />} onClick={() => navigate("/app/upload")}>
            Subir contenido
          </Button>
        </motion.div>
      </div>
      <style>{`@keyframes wave{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-8deg)}60%{transform:rotate(12deg)}80%{transform:rotate(-4deg)}}`}</style>

      {status === "error" ? (
        <ErrorState onRetry={reload} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {status === "loading" ? (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)
            ) : (
              <>
                <StatCard index={0} label="Subidas hoy" value={stats.today} icon={<CloudUpload className="h-4 w-4" />} hint={<span>de {users.length} personas</span>} />
                <StatCard index={1} label="Archivos totales" value={stats.total} icon={<Files className="h-4 w-4" />} hint="desde el inicio" />
                <StatCard index={2} label="Actividad semanal" value={stats.week} icon={<TrendingUp className="h-4 w-4" />} hint="últimos 7 días" />
                <StatCard
                  index={3}
                  label="Última subida"
                  value={stats.last ? formatTime(stats.last.createdAt) : "—"}
                  icon={<Clock className="h-4 w-4" />}
                  hint={stats.last ? <span className="line-clamp-1">{stats.last.username} · {relativeTime(stats.last.createdAt)}</span> : "sin actividad"}
                />
              </>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="h-full">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="h3 text-lg">Actividad reciente</h2>
                    <p className="text-xs text-fg-muted">{stats.todays.length >= 3 ? "Hoy" : "Últimas subidas"}</p>
                  </div>
                  <Link to="/app/activity" className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline">
                    Ver todo <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {status === "loading" ? <ActivitySkeleton rows={4} /> : recent.length ? <Timeline uploads={recent} delay={0.6} /> : <EmptyState />}
              </Card>
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <Card>{status === "loading" ? <Skeleton className="h-64" /> : <WeeklyChart uploads={uploads} delay={0.75} />}</Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.5 }}>
                <Card>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="h3 text-lg">Equipo hoy</h2>
                    <CalendarDays className="h-4 w-4 text-fg-muted" />
                  </div>
                  <ul className="flex flex-col gap-1">
                    {byUserToday.map(({ user: u, count, last }) => (
                      <li key={u.id}>
                        <Link to={`/app/user/${u.id}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-fg/[0.04]">
                          <Avatar src={u.avatar} name={u.displayName} size="sm" online={count > 0} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{u.displayName}</span>
                            <span className="block truncate text-xs text-fg-muted">{last ? `Última: ${last.title}` : "Sin actividad"}</span>
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary tabular-nums">
                            {count} hoy
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
