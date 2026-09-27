import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "../lib/storage";

export type ThemePreference = "dark" | "light" | "system";
type Resolved = "dark" | "light";

interface ThemeState {
  preference: ThemePreference;
  resolved: Resolved;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

function systemTheme(): Resolved {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "dark";
  }
}

function apply(theme: Resolved, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 500);
  }
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>(() => storage.get<ThemePreference>("theme", "dark"));
  const [system, setSystem] = useState<Resolved>(systemTheme);
  const resolved: Resolved = preference === "system" ? system : preference;

  useEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return;
    }
    const onChange = () => setSystem(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const current: Resolved = root.classList.contains("dark") ? "dark" : "light";
    apply(resolved, current !== resolved);
  }, [resolved]);

  const setPreference = useCallback((p: ThemePreference) => {
    setPref(p);
    storage.set("theme", p);
  }, []);

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
