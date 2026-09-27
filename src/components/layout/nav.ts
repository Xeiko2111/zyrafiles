import { Activity, FolderOpen, LayoutDashboard, Settings, CloudUpload, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Tecla para el atajo "G + tecla". */
  key: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, key: "d" },
  { to: "/app/upload", label: "Subir contenido", icon: CloudUpload, key: "u" },
  { to: "/app/me", label: "Mi actividad", icon: Activity, key: "m" },
  { to: "/app/activity", label: "Actividad del equipo", icon: Users, key: "e" },
  { to: "/app/files", label: "Todos los archivos", icon: FolderOpen, key: "f" },
  { to: "/app/settings", label: "Configuración", icon: Settings, key: "c" },
];

export function isActive(item: NavItem, path: string): boolean {
  if (item.to === "/app") return path === "/app" || path === "/app/";
  return path === item.to || path.startsWith(item.to + "/");
}
