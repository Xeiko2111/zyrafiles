import { Menu, Plus, Search } from "lucide-react";
import { useRouter } from "../../lib/router";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NAV_ITEMS, isActive } from "./nav";

interface TopbarProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

export function Topbar({ onOpenMenu, onOpenSearch }: TopbarProps) {
  const { path, navigate } = useRouter();
  const current = NAV_ITEMS.find((n) => isActive(n, path));
  const crumbs = [{ label: "ZyraFiles", to: "/app" }];
  if (path.startsWith("/app/user/")) crumbs.push({ label: "Actividad del equipo", to: "/app/activity" }, { label: "Perfil", to: "" });
  else if (current && current.to !== "/app") crumbs.push({ label: current.label, to: "" });
  else crumbs.push({ label: "Dashboard", to: "" });

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line px-4 sm:px-6 lg:px-8" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <button onClick={onOpenMenu} className="-ml-1 rounded-lg p-2 text-fg-secondary transition hover:bg-fg/5 lg:hidden" aria-label="Abrir menú">
        <Menu className="h-5 w-5" />
      </button>
      <div className="lg:hidden">
        <Logo size={26} />
      </div>
      <div className="hidden lg:block">
        <Breadcrumbs items={crumbs.map((c) => ({ label: c.label, to: c.to || undefined }))} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="flex h-9 items-center gap-2 whitespace-nowrap rounded-xl border border-line bg-card px-2.5 text-sm text-fg-muted transition hover:border-line-hover hover:text-fg sm:w-64 sm:px-3"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar en ZyraFiles…</span>
          <kbd className="ml-auto hidden rounded-md border border-line px-1.5 font-mono text-[10px] sm:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
        </button>
        <ThemeToggle className="lg:hidden" />
        {path !== "/app/upload" && (
          <Button size="sm" className="hidden h-9 sm:inline-flex" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate("/app/upload")}>
            Nueva subida
          </Button>
        )}
      </div>
    </header>
  );
}
