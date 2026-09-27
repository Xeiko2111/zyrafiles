import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpDown, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type { Upload, UploadType } from "../types/upload";
import { useUploads } from "../hooks/useUploads";
import { useAuth } from "../hooks/useAuth";
import { useFilteredUploads } from "../hooks/useFilteredUploads";
import { storage } from "../lib/storage";
import { cn, TYPE_LABELS } from "../lib/utils";
import { PageHeader } from "../components/layout/PageHeader";
import { UploadCard } from "../components/activity/UploadCard";
import { FileRow } from "../components/files/FileRow";
import { SearchBar } from "../components/ui/SearchBar";
import { Dropdown } from "../components/ui/Dropdown";
import { Segmented } from "../components/ui/Segmented";
import { Skeleton } from "../components/ui/Skeleton";
import { Tooltip } from "../components/ui/Tooltip";
import { EmptyState, ErrorState } from "../components/ui/States";

type SortKey = "date" | "name" | "user" | "type";
type ViewMode = "grid" | "list";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "date", label: "Fecha" },
  { value: "name", label: "Nombre" },
  { value: "user", label: "Usuario" },
  { value: "type", label: "Tipo" },
];

function sortBy(list: Upload[], key: SortKey, asc: boolean): Upload[] {
  const s = [...list].sort((a, b) => {
    switch (key) {
      case "name":
        return a.title.localeCompare(b.title, "es");
      case "user":
        return a.username.localeCompare(b.username, "es") || b.createdAt.localeCompare(a.createdAt);
      case "type":
        return TYPE_LABELS[a.type].localeCompare(TYPE_LABELS[b.type], "es") || b.createdAt.localeCompare(a.createdAt);
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
  // "Fecha" por defecto va de más reciente a más antigua; el resto A→Z.
  return asc ? s : s.reverse();
}

export default function Files() {
  const { uploads, status, reload } = useUploads();
  const { users } = useAuth();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<UploadType | "all">("all");
  const [userId, setUserId] = useState("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [asc, setAsc] = useState(true);
  const [view, setViewState] = useState<ViewMode>(() => storage.get<ViewMode>("files-view", "grid"));
  const setView = (v: ViewMode) => {
    setViewState(v);
    storage.set("files-view", v);
  };

  const filtered = useFilteredUploads(uploads, { query, type, userId });
  const list = useMemo(() => sortBy(filtered, sort, asc), [filtered, sort, asc]);

  return (
    <div>
      <PageHeader eyebrow="Biblioteca" title="Todos los archivos" subtitle={`${uploads.length} elementos subidos por el equipo.`} />

      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-bg/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar archivos…" className="lg:max-w-sm lg:flex-1" />
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <Dropdown
              value={type}
              onChange={setType}
              icon={<SlidersHorizontal className="h-4 w-4 text-fg-muted" />}
              align="left"
              options={[{ value: "all", label: "Todos los tipos" }, ...(Object.keys(TYPE_LABELS) as UploadType[]).map((t) => ({ value: t, label: TYPE_LABELS[t] }))]}
            />
            <Dropdown value={userId} onChange={setUserId} align="left" options={[{ value: "all", label: "Todo el equipo" }, ...users.map((u) => ({ value: u.id, label: u.displayName }))]} />
            <Dropdown value={sort} onChange={setSort} label="Ordenar:" icon={<ArrowDownAZ className="h-4 w-4 text-fg-muted" />} options={SORTS} />
            <Tooltip content={asc ? (sort === "date" ? "Más recientes primero" : "A → Z") : sort === "date" ? "Más antiguos primero" : "Z → A"}>
              <button
                onClick={() => setAsc((a) => !a)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-fg-secondary transition hover:border-line-hover hover:text-fg"
                aria-label="Invertir orden"
              >
                <ArrowUpDown className={cn("h-4 w-4 transition-transform duration-300", !asc && "rotate-180")} />
              </button>
            </Tooltip>
            <Segmented
              ariaLabel="Vista"
              value={view}
              onChange={setView}
              options={[
                { value: "grid", label: <LayoutGrid className="h-4 w-4" />, ariaLabel: "Vista cuadrícula" },
                { value: "list", label: <List className="h-4 w-4" />, ariaLabel: "Vista lista" },
              ]}
            />
          </div>
        </div>
      </div>

      {status === "loading" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-[280px] rounded-2xl" />)}
        </div>
      ) : status === "error" ? (
        <ErrorState onRetry={reload} />
      ) : list.length === 0 ? (
        uploads.length ? (
          <EmptyState title="Sin resultados" description="Ningún archivo coincide con la búsqueda o los filtros." showUploadAction={false} />
        ) : (
          <EmptyState />
        )
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" key={`g-${sort}-${asc}`}>
          {list.map((u, i) => (
            <UploadCard key={u.id} upload={u} index={i} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-card" key={`l-${sort}-${asc}`}>
          <div className="hidden grid-cols-[40px_minmax(0,2.2fr)_minmax(0,1fr)_110px_90px_150px] gap-4 border-b border-line px-6 py-3 md:grid">
            <span />
            <span className="label">Nombre</span>
            <span className="label">Usuario</span>
            <span className="label">Tipo</span>
            <span className="label">Tamaño</span>
            <span className="label text-right">Fecha</span>
          </div>
          <ul className="divide-y divide-line/60 p-2 md:p-3">
            {list.map((u, i) => (
              <FileRow key={u.id} upload={u} index={i} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
