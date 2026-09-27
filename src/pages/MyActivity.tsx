import { useMemo, useState } from "react";
import { CalendarCheck, Clock, Layers, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUploads } from "../hooks/useUploads";
import { inRange, useFilteredUploads } from "../hooks/useFilteredUploads";
import { dayLabel, formatTime } from "../lib/utils";
import { PageHeader } from "../components/layout/PageHeader";
import { StatCard } from "../components/dashboard/StatCard";
import { GroupedByDate } from "../components/activity/GroupedByDate";
import { ActivityFilters, type FilterValue } from "../components/activity/ActivityFilters";
import { ActivitySkeleton, Skeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/States";

export default function MyActivity() {
  const { user } = useAuth();
  const { uploads, status, reload } = useUploads();
  const mine = useMemo(() => uploads.filter((u) => u.userId === user?.id), [uploads, user]);
  const [filters, setFilters] = useState<FilterValue>({ query: "", userId: "all", range: "all", from: "", to: "" });
  const list = useFilteredUploads(mine, filters);
  const last = mine[0];

  return (
    <div>
      <PageHeader eyebrow="Personal" title="Mi actividad" subtitle="Solo tus publicaciones, ordenadas por día." />
      {status === "error" ? (
        <ErrorState onRetry={reload} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {status === "loading" ? (
              Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)
            ) : (
              <>
                <StatCard index={0} label="Total de publicaciones" value={mine.length} icon={<Layers className="h-4 w-4" />} />
                <StatCard index={1} label="Publicaciones de hoy" value={mine.filter((u) => inRange(u, "today")).length} icon={<CalendarCheck className="h-4 w-4" />} />
                <StatCard index={2} label="Esta semana" value={mine.filter((u) => inRange(u, "week")).length} icon={<TrendingUp className="h-4 w-4" />} />
                <StatCard index={3} label="Última actividad" value={last ? formatTime(last.createdAt) : "—"} hint={last ? dayLabel(last.date) : "Aún no has subido nada"} icon={<Clock className="h-4 w-4" />} />
              </>
            )}
          </div>
          <div className="mt-8">
            <ActivityFilters value={filters} onChange={setFilters} showUsers={false} />
          </div>
          <div className="mt-6">
            {status === "loading" ? (
              <ActivitySkeleton />
            ) : list.length ? (
              <GroupedByDate uploads={list} showUser={false} />
            ) : mine.length ? (
              <EmptyState title="Sin resultados" description="Prueba con otra búsqueda o rango de fechas." showUploadAction={false} />
            ) : (
              <EmptyState title="Todavía no has subido nada" description="Tu primera publicación aparecerá aquí, ordenada por fecha." />
            )}
          </div>
        </>
      )}
    </div>
  );
}
