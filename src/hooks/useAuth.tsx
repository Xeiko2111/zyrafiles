/**
 * Autenticación del PROTOTIPO.
 * Compara credenciales en el navegador: NO es seguro y no debe usarse
 * en producción. Para producción: sustituir `login` por una llamada a
 * la API (contraseñas con hash tipo argon2/bcrypt, sesión en cookie
 * httpOnly) manteniendo la misma interfaz del contexto.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { PublicUser, User } from "../types/user";
import { SEED_USERS } from "../data/users";
import { storage } from "../lib/storage";

type Overrides = Record<string, Partial<Pick<User, "displayName" | "avatar">>>;

interface Session {
  userId: string;
  since: string;
}

interface AuthState {
  user: PublicUser | null;
  users: PublicUser[];
  getUser: (id: string) => PublicUser | undefined;
  login: (username: string, password: string) => Promise<PublicUser>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "displayName" | "avatar">>) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

function strip(u: User): PublicUser {
  return { id: u.id, username: u.username, avatar: u.avatar, displayName: u.displayName, role: u.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(() => storage.get<Overrides>("user-overrides", {}));
  const [session, setSession] = useState<Session | null>(() => storage.get<Session | null>("session", null));

  const users = useMemo<PublicUser[]>(
    () => SEED_USERS.map((u) => ({ ...strip(u), ...overrides[u.id] })),
    [overrides],
  );
  const user = useMemo(() => users.find((u) => u.id === session?.userId) ?? null, [users, session]);
  const getUser = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 750)); // simula la latencia de red
    const name = username.trim().toLowerCase();
    const found = SEED_USERS.find(
      (u) => (u.username.toLowerCase() === name || u.aliases?.some((a) => a.toLowerCase() === name)) && u.password === password,
    );
    if (!found) throw new Error("Usuario o contraseña incorrectos");
    const s: Session = { userId: found.id, since: new Date().toISOString() };
    storage.set("session", s);
    setSession(s);
    return { ...strip(found), ...(storage.get<Overrides>("user-overrides", {})[found.id] ?? {}) };
  }, []);

  const logout = useCallback(() => {
    storage.remove("session");
    setSession(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, "displayName" | "avatar">>) => {
      if (!session) return false;
      const next = { ...overrides, [session.userId]: { ...overrides[session.userId], ...patch } };
      const ok = storage.set("user-overrides", next);
      setOverrides(next);
      return ok;
    },
    [overrides, session],
  );

  const value = useMemo(() => ({ user, users, getUser, login, logout, updateProfile }), [user, users, getUser, login, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
