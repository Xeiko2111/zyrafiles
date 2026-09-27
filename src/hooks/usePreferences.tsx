import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "../lib/storage";

export interface Preferences {
  notifications: boolean;
  animations: boolean;
  sidebarCollapsed: boolean;
}

const DEFAULTS: Preferences = { notifications: true, animations: true, sidebarCollapsed: false };

interface PrefState {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
}

const PrefContext = createContext<PrefState | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(() => ({ ...DEFAULTS, ...storage.get<Partial<Preferences>>("prefs", {}) }));

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", !prefs.animations);
  }, [prefs.animations]);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      storage.set("prefs", next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ prefs, update }), [prefs, update]);
  return <PrefContext.Provider value={value}>{children}</PrefContext.Provider>;
}

export function usePreferences(): PrefState {
  const ctx = useContext(PrefContext);
  if (!ctx) throw new Error("usePreferences debe usarse dentro de <PreferencesProvider>");
  return ctx;
}
