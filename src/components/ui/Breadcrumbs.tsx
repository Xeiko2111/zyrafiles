import { ChevronRight } from "lucide-react";
import { Link } from "../../lib/router";

export function Breadcrumbs({ items }: { items: Array<{ label: string; to?: string }> }) {
  return (
    <nav aria-label="Ruta de navegación" className="flex items-center gap-1 text-xs text-fg-muted">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
          {it.to ? (
            <Link to={it.to} className="transition hover:text-fg">
              {it.label}
            </Link>
          ) : (
            <span className="text-fg-secondary" aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
