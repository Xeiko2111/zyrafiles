import { useRouter } from "../../lib/router";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../ui/Logo";
import { scrollToId } from "./scroll";

export function Footer() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const links = [
    { label: "Inicio", action: () => scrollToId("inicio") },
    { label: "Actividad", action: () => scrollToId("actividad") },
    { label: "Acceder", action: () => navigate(user ? "/app" : "/login") },
    { label: "Configuración", action: () => navigate(user ? "/app/settings" : "/login?next=/app/settings") },
  ];
  return (
    <footer className="border-t border-line px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-fg-muted">Todo lo que haces. En un solo lugar.</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <button onClick={l.action} className="text-sm text-fg-secondary transition hover:text-primary">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-line pt-6 text-xs text-fg-muted sm:flex-row sm:justify-between">
        <span>© 2026 ZyraFiles</span>
        <span>Un producto de ZYRA · digitalzyra.com</span>
      </div>
    </footer>
  );
}
