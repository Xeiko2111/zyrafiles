import type { UploadType } from "../types/upload";

export function cn(...parts: unknown[]): string {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD en hora local. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const WEEKDAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** "27 septiembre 2026" */
export function formatLongDate(d: Date | string): string {
  const date = typeof d === "string" ? (d.length === 10 ? parseISODate(d) : new Date(d)) : d;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** "27 septiembre 2026 · 18:42" */
export function formatDateTime(iso: string): string {
  return `${formatLongDate(iso)} · ${formatTime(iso)}`;
}

/** "sábado, 27 septiembre 2026 a las 18:42" (para tooltips) */
export function formatFull(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]}, ${formatLongDate(d)} a las ${formatTime(d)}`;
}

export function daysBetween(a: Date, b: Date): number {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((A - B) / 86_400_000);
}

/** Etiqueta de día: "Hoy", "Ayer" o fecha larga. */
export function dayLabel(isoDate: string): string {
  const diff = daysBetween(new Date(), parseISODate(isoDate));
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return formatLongDate(isoDate);
}

/** "hace 5 min", "hace 3 h", "ayer, 17:20", "27 sept." */
export function relativeTime(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.round(diffMs / 60_000);
  if (min < 1) return "ahora mismo";
  if (min < 60) return `hace ${min} min`;
  const days = daysBetween(new Date(), d);
  if (days === 0) return `hace ${Math.round(min / 60)} h`;
  if (days === 1) return `ayer, ${formatTime(d)}`;
  if (days < 7) return `hace ${days} días`;
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}.`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 6 && h < 14) return "Buenos días";
  if (h >= 14 && h < 21) return "Buenas tardes";
  return "Buenas noches";
}

export const TYPE_LABELS: Record<UploadType, string> = {
  file: "Archivo",
  image: "Imagen",
  document: "Documento",
  text: "Texto",
  other: "Otro",
};

export function guessType(file: File): UploadType {
  if (file.type.startsWith("image/")) return "image";
  if (/pdf|word|document|presentation|spreadsheet|text\/plain|rtf|opendocument/.test(file.type) || /\.(pdf|docx?|xlsx?|pptx?|odt|md|txt)$/i.test(file.name)) return "document";
  return "file";
}

export function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Normaliza para búsquedas: minúsculas y sin tildes. */
export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
