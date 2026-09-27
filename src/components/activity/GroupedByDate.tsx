import type { Upload } from "../../types/upload";
import { groupByDate } from "../../hooks/useFilteredUploads";
import { dayLabel, formatLongDate } from "../../lib/utils";
import { ActivityItem } from "./ActivityItem";

/** Publicaciones agrupadas por día ("Hoy", "Ayer", "25 septiembre 2026"…). */
export function GroupedByDate({ uploads, showUser = true }: { uploads: Upload[]; showUser?: boolean }) {
  const groups = groupByDate(uploads);
  return (
    <div className="flex flex-col gap-8">
      {groups.map(([date, items]) => {
        const label = dayLabel(date);
        return (
          <section key={date} aria-label={formatLongDate(date)}>
            <header className="sticky top-16 z-10 -mx-2 mb-2 flex items-baseline gap-3 bg-bg/85 px-2 py-2 backdrop-blur-md">
              <h3 className="h3 text-[15px]">{label}</h3>
              {label !== formatLongDate(date) && <span className="meta">{formatLongDate(date)}</span>}
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary tabular-nums">
                {items.length} {items.length === 1 ? "subida" : "subidas"}
              </span>
            </header>
            <ul className="flex flex-col gap-1">
              {items.map((u, i) => (
                <ActivityItem key={u.id} upload={u} index={i} showUser={showUser} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
