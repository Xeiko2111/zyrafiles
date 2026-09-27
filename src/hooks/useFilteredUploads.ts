import { useMemo } from "react";
import type { Upload, UploadType } from "../types/upload";
import { daysBetween, formatLongDate, normalize, parseISODate, TYPE_LABELS } from "../lib/utils";

export type DateRange = "all" | "today" | "yesterday" | "week" | "month" | "custom";

export interface UploadFilters {
  query?: string;
  userId?: string | "all";
  type?: UploadType | "all";
  range?: DateRange;
  from?: string;
  to?: string;
}

export function matchesQuery(u: Upload, q: string): boolean {
  if (!q.trim()) return true;
  const hay = normalize(
    [u.title, u.description, u.username, TYPE_LABELS[u.type], u.type, u.file?.name ?? "", u.textContent ?? "", formatLongDate(u.date), u.date].join(" "),
  );
  return normalize(q).split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

export function inRange(u: Upload, range: DateRange, from?: string, to?: string): boolean {
  const d = parseISODate(u.date);
  const now = new Date();
  const diff = daysBetween(now, d);
  switch (range) {
    case "today":
      return diff === 0;
    case "yesterday":
      return diff === 1;
    case "week": {
      // semana natural: desde el lunes
      const dow = (now.getDay() + 6) % 7;
      return diff >= 0 && diff <= dow;
    }
    case "month":
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    case "custom":
      return (!from || u.date >= from) && (!to || u.date <= to);
    default:
      return true;
  }
}

export function useFilteredUploads(uploads: Upload[], f: UploadFilters): Upload[] {
  return useMemo(
    () =>
      uploads.filter(
        (u) =>
          (!f.userId || f.userId === "all" || u.userId === f.userId) &&
          (!f.type || f.type === "all" || u.type === f.type) &&
          inRange(u, f.range ?? "all", f.from, f.to) &&
          matchesQuery(u, f.query ?? ""),
      ),
    [uploads, f.userId, f.type, f.range, f.from, f.to, f.query],
  );
}

/** Agrupa por fecha (YYYY-MM-DD), de más reciente a más antigua. */
export function groupByDate(list: Upload[]): Array<[string, Upload[]]> {
  const map = new Map<string, Upload[]>();
  for (const u of list) {
    const arr = map.get(u.date) ?? [];
    arr.push(u);
    map.set(u.date, arr);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
