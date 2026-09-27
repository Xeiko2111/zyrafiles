import { CalendarRange } from "lucide-react";
import type { DateRange } from "../../hooks/useFilteredUploads";
import { useAuth } from "../../hooks/useAuth";
import { toISODate } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { SearchBar } from "../ui/SearchBar";
import { Segmented } from "../ui/Segmented";

export interface FilterValue {
  query: string;
  userId: string;
  range: DateRange;
  from: string;
  to: string;
}

export const RANGE_OPTIONS: Array<{ value: DateRange; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
  { value: "custom", label: "Personalizado" },
];

/** Barra de filtros: búsqueda + persona + fecha (con rango personalizado). */
export function ActivityFilters({ value, onChange, showUsers = true }: { value: FilterValue; onChange: (v: FilterValue) => void; showUsers?: boolean }) {
  const { users } = useAuth();
  const set = (patch: Partial<FilterValue>) => onChange({ ...value, ...patch });
  const today = toISODate(new Date());

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card/70 p-3 shadow-card backdrop-blur sm:p-4">
      <SearchBar value={value.query} onChange={(query) => set({ query })} placeholder="Buscar por título, descripción, persona, tipo o fecha" />
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        {showUsers && (
          <Segmented
            ariaLabel="Filtrar por persona"
            value={value.userId}
            onChange={(userId) => set({ userId })}
            options={[
              { value: "all", label: "Todos" },
              ...users.map((u) => ({ value: u.id, label: <><Avatar src={u.avatar} name={u.displayName} size="xs" className="-ml-1" />{u.displayName}</> })),
            ]}
          />
        )}
        <Segmented ariaLabel="Filtrar por fecha" size="sm" value={value.range} onChange={(range) => set({ range })} options={RANGE_OPTIONS} />
      </div>
      {value.range === "custom" && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-3">
          <CalendarRange className="h-4 w-4 text-primary" />
          <label className="flex items-center gap-2 text-sm text-fg-secondary">
            Desde
            <input type="date" value={value.from} max={value.to || today} onChange={(e) => set({ from: e.target.value })} className="h-9 rounded-lg border border-line bg-card px-2 text-sm text-fg outline-none focus:border-primary" />
          </label>
          <label className="flex items-center gap-2 text-sm text-fg-secondary">
            Hasta
            <input type="date" value={value.to} min={value.from} max={today} onChange={(e) => set({ to: e.target.value })} className="h-9 rounded-lg border border-line bg-card px-2 text-sm text-fg outline-none focus:border-primary" />
          </label>
        </div>
      )}
    </div>
  );
}
