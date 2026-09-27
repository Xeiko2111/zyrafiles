import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Upload } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { groupByDate } from "../../hooks/useFilteredUploads";
import { cn, dayLabel, formatLongDate } from "../../lib/utils";
import { Link } from "../../lib/router";
import { Avatar } from "../ui/Avatar";
import { RelativeTime } from "../ui/RelativeTime";
import { ActivityItem } from "./ActivityItem";

/** Acordeón por persona → días → publicaciones. */
export function GroupedByUser({ uploads }: { uploads: Upload[] }) {
  const { users } = useAuth();
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const withItems = users.map((u) => ({ user: u, items: uploads.filter((x) => x.userId === u.id) })).filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-4">
      {withItems.map(({ user, items }) => {
        const open = !closed[user.id];
        const panelId = `group-${user.id}`;
        return (
          <section key={user.id} className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
            <div className="flex items-center gap-3 p-4">
              <Link to={`/app/user/${user.id}`} className="rounded-full" aria-label={`Perfil de ${user.displayName}`}>
                <Avatar src={user.avatar} name={user.displayName} size="lg" />
              </Link>
              <button
                onClick={() => setClosed((c) => ({ ...c, [user.id]: open }))}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="h3 block text-lg">{user.displayName}</span>
                  <span className="text-xs text-fg-muted">
                    {items.length} {items.length === 1 ? "publicación" : "publicaciones"} · última <RelativeTime iso={items[0].createdAt} />
                  </span>
                </span>
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-full border border-line text-fg-muted transition-transform duration-300", open && "rotate-180 border-primary/40 text-primary")}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </div>
            <div id={panelId} className="collapse-grid" data-open={open}>
              <div>
                <div className="flex flex-col gap-5 border-t border-line px-3 pb-4 pt-4 sm:px-4">
                  {groupByDate(items).map(([date, list]) => (
                    <div key={date}>
                      <p className="mb-1 flex items-center gap-2 px-3 text-[13px] font-semibold text-fg-secondary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {dayLabel(date) === formatLongDate(date) ? formatLongDate(date) : `${dayLabel(date)} · ${formatLongDate(date)}`}
                      </p>
                      <ul className="flex flex-col">
                        {list.map((u, i) => (
                          <ActivityItem key={u.id} upload={u} index={i} showUser={false} compact />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
