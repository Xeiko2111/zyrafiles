/**
 * Router mínimo basado en hash (#/app/files).
 * Funciona en cualquier hosting estático sin configurar rewrites.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

interface RouterState {
  path: string;
  query: URLSearchParams;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterState | null>(null);

function readHash(): string {
  const h = window.location.hash.replace(/^#/, "");
  return h.startsWith("/") ? h : "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [full, setFull] = useState(readHash);

  useEffect(() => {
    const onChange = () => setFull(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const target = "#" + to;
    if (opts?.replace) {
      try {
        history.replaceState(null, "", target);
      } catch {
        window.location.hash = to;
      }
      setFull(to);
    } else if (window.location.hash !== target) {
      window.location.hash = to;
      setFull(to);
    }
    window.scrollTo({ top: 0 });
  }, []);

  const value = useMemo<RouterState>(() => {
    const [path, qs = ""] = full.split("?");
    return { path: path || "/", query: new URLSearchParams(qs), navigate };
  }, [full, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter debe usarse dentro de <RouterProvider>");
  return ctx;
}

/** Devuelve los parámetros si `pattern` (p. ej. "/app/user/:id") coincide con la ruta actual. */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const a = path.split("/").filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
  }
  return params;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={"#" + to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
