import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link, useRouter } from "../../lib/router";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../ui/Toast";
import { Avatar } from "../ui/Avatar";
import { Logo } from "../ui/Logo";
import { Tooltip } from "../ui/Tooltip";
import { ThemeToggle } from "../ui/ThemeToggle";
import { NAV_ITEMS, isActive } from "./nav";

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
  /** En el menú móvil: cerrar al navegar. */
  onNavigate?: () => void;
  mobile?: boolean;
}

export function Sidebar({ collapsed, onToggle, onNavigate, mobile }: SidebarProps) {
  const { path, navigate } = useRouter();
  const { user, logout } = useAuth();
  const { success } = useToast();
  const c = collapsed && !mobile;

  const handleLogout = () => {
    logout();
    success("Sesión cerrada", "Hasta pronto 👋");
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-line bg-bg-secondary/80",
        !mobile && "transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
        mobile ? "w-[280px]" : c ? "w-[76px]" : "w-[264px]",
      )}
      aria-label="Navegación principal"
    >
      <div className={cn("flex h-16 items-center border-b border-line", c ? "justify-center px-2" : "justify-between px-5")}>
        <Link to="/app" onClick={onNavigate} aria-label="ZyraFiles, ir al dashboard" className="rounded-xl">
          <Logo withWordmark={!c} size={c ? 34 : 30} />
        </Link>
        {!c && !mobile && onToggle && (
          <Tooltip content="Contraer" side="bottom">
            <button onClick={onToggle} className="rounded-lg p-1.5 text-fg-muted transition hover:bg-fg/5 hover:text-fg" aria-label="Contraer barra lateral">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {!c && <p className="label mb-2 px-3">Espacio de trabajo</p>}
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, path);
            const Icon = item.icon;
            const link = (
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                aria-label={c ? item.label : undefined}
                className={cn(
                  "group/nav relative flex h-10 items-center gap-3 rounded-xl text-[14px] font-medium transition-colors duration-200",
                  c ? "w-11 justify-center" : "w-full px-3",
                  active ? "bg-primary/[0.12] text-fg" : "text-fg-secondary hover:bg-fg/[0.05] hover:text-fg",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_rgb(var(--primary-glow))]" aria-hidden="true" />
                )}
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover/nav:scale-110",
                    active ? "text-primary" : "text-fg-muted group-hover/nav:text-fg",
                  )}
                />
                {!c && <span className="truncate">{item.label}</span>}
                {!c && !mobile && (
                  <kbd className="ml-auto hidden font-mono text-[10px] text-fg-muted opacity-0 transition group-hover/nav:opacity-100 lg:inline">
                    G {item.key.toUpperCase()}
                  </kbd>
                )}
              </Link>
            );
            return (
              <li key={item.to} className={cn(c && "flex justify-center")}>
                {c ? (
                  <Tooltip content={item.label} side="right">
                    {link}
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        {c ? (
          <div className="flex flex-col items-center gap-2">
            {onToggle && (
              <Tooltip content="Expandir" side="right">
                <button onClick={onToggle} className="rounded-lg p-2 text-fg-muted transition hover:bg-fg/5 hover:text-fg" aria-label="Expandir barra lateral">
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
            <ThemeToggle />
            {user && (
              <Tooltip content={`${user.displayName} · Activo`} side="right">
                <Link to={`/app/user/${user.id}`} aria-label="Mi perfil" className="rounded-full">
                  <Avatar src={user.avatar} name={user.displayName} size="md" online />
                </Link>
              </Tooltip>
            )}
            <Tooltip content="Cerrar sesión" side="right">
              <button onClick={handleLogout} className="rounded-lg p-2 text-fg-muted transition hover:bg-danger/10 hover:text-danger" aria-label="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        ) : (
          user && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-card p-2.5">
                <Link to={`/app/user/${user.id}`} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl" aria-label="Ver mi perfil">
                  <Avatar src={user.avatar} name={user.displayName} size="md" online />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-fg">{user.displayName}</span>
                    <span className="flex items-center gap-1.5 text-xs text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      Activo
                    </span>
                  </span>
                </Link>
                <ThemeToggle className="h-8 w-8" />
              </div>
              <button
                onClick={handleLogout}
                className="flex h-9 items-center justify-center gap-2 rounded-xl text-[13px] font-medium text-fg-muted transition hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )
        )}
      </div>
    </aside>
  );
}
