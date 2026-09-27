import { useState } from "react";
import { CalendarDays, FilterX, Users } from "lucide-react";
import { useUploads } from "../hooks/useUploads";
import { useFilteredUploads } from "../hooks/useFilteredUploads";
import { useRouter } from "../lib/router";
import { storage } from "../lib/storage";
import { toISODate } from "../lib/utils";
import { PageHeader } from "../components/layout/PageHeader";
import { ActivityFilters, type FilterValue } from "../components/activity/ActivityFilters";
import { GroupedByDate } from "../components/activity/GroupedByDate";
import { GroupedByUser } from "../components/activity/GroupedByUser";
import { Segmented } from "../components/ui/Segmented";
import { Button } from "../components/ui/Button";
import { ActivitySkeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/States";

type View = "day" | "user";

export default function Activity() {
  const { uploads, status, reload } = useUploads();
  const { query } = useRouter();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const initial: FilterValue = { query: "", userId: query.get("user") ?? "all", range: "all", from: toISODate(weekAgo), to: toISODate(new Date()) };
  const [filters, setFilters] = useState<FilterValue>(initial);
  const [view, setViewState] = useState<View>(() => storage.get<View>("activity-view", "day"));
  const setView = (v: View) => {
    setViewState(v);
    storage.set("activity-view", v);
  };

  const list = useFilteredUploads(uploads, filters);
  const filtered = filters.query || filters.userId !== "all" || filters.range !== "all";

  return (
    <div>
      <PageHeader
        eyebrow="Equipo"
        title="Actividad del equipo"
        subtitle="Todo lo que ha subido cada persona, por día o agrupado por miembro."
        actions={
          <Segmented
            ariaLabel="Agrupar"
            value={view}
            onChange={setView}
            options={[
              { value: "day", label: <><CalendarDays className="h-3.5 w-3.5" />Por día</> },
              { value: "user", label: <><Users className="h-3.5 w-3.5" />Por persona</> },
            ]}
          />
        }
      />
      <ActivityFilters value={filters} onChange={setFilters} />

      <div className="mt-4 flex items-center justify-between px-1 text-sm text-fg-muted">
        <span>
          <span className="font-semibold text-fg tabular-nums">{list.length}</span> {list.length === 1 ? "publicación" : "publicaciones"}
        </span>
        {filtered && (
          <button onClick={() => setFilters({ ...initial, userId: "all" })} className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
            <FilterX className="h-3.5 w-3.5" /> Limpiar filtros
          </button>
        )}
      </div>

      <div className="mt-4">
        {status === "loading" ? (
          <ActivitySkeleton rows={6} />
        ) : status === "error" ? (
          <ErrorState onRetry={reload} />
        ) : list.length === 0 ? (
          filtered ? (
            <EmptyState
              title="Sin resultados"
              description="No hay publicaciones que coincidan con estos filtros."
              action={<Button variant="secondary" onClick={() => setFilters({ ...initial, userId: "all" })}>Limpiar filtros</Button>}
            />
          ) : (
            <EmptyState />
          )
        ) : view === "day" ? (
          <GroupedByDate uploads={list} />
        ) : (
          <GroupedByUser uploads={list} />
        )}
      </div>
    </div>
  );
}
