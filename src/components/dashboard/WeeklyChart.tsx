import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Upload } from "../../types/upload";
import { cn, toISODate, WEEKDAYS_SHORT } from "../../lib/utils";

/** Barras de los últimos 7 días (hoy a la derecha). */
export function WeeklyChart({ uploads, delay = 0 }: { uploads: Upload[]; delay?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const days = useMemo(() => {
    const out: Array<{ key: string; label: string; count: number; isToday: boolean }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toISODate(d);
      out.push({ key, label: WEEKDAYS_SHORT[d.getDay()], count: uploads.filter((u) => u.date === key).length, isToday: i === 0 });
    }
    return out;
  }, [uploads]);

  const max = Math.max(4, ...days.map((d) => d.count));
  const niceMax = Math.ceil(max / 2) * 2;
  const ticks = [niceMax, niceMax / 2, 0];
  const total = days.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[13px] font-medium text-fg-secondary">Actividad semanal</p>
          <p className="mt-1 font-display text-2xl font-extrabold tracking-tight tabular-nums">
            {total} <span className="text-sm font-medium text-fg-muted">subidas en 7 días</span>
          </p>
        </div>
      </div>
      <div className="relative mt-6 flex h-52 gap-3">
        <div className="flex flex-col justify-between pb-6 text-right font-mono text-[10px] text-fg-muted tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">{t}</span>
          ))}
        </div>
        <div className="relative flex flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between" aria-hidden="true">
            {ticks.map((t) => (
              <div key={t} className={cn("h-px w-full", t === 0 ? "bg-line" : "border-t border-dashed border-line/70")} />
            ))}
          </div>
          <ul className="relative flex flex-1 items-end gap-2 pb-6 sm:gap-3" aria-label="Subidas por día">
            {days.map((d, i) => (
              <li
                key={d.key}
                className="relative flex h-full flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${d.label}: ${d.count} subidas`}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute z-10 rounded-md border border-line bg-card px-2 py-1 font-mono text-[11px] font-medium text-fg shadow-pop transition-opacity",
                    hover === i ? "opacity-100" : "opacity-0",
                  )}
                  style={{ bottom: `calc(${(d.count / niceMax) * 100}% + 6px)` }}
                >
                  {d.count}
                </span>
                <motion.div
                  className={cn(
                    "w-full max-w-[44px] origin-bottom rounded-t-lg rounded-b-[4px]",
                    d.isToday
                      ? "bg-[linear-gradient(to_top,rgb(var(--primary-deep)),rgb(var(--primary))_60%,rgb(var(--primary-hover)))] shadow-[0_0_24px_-4px_rgb(var(--primary-glow)/0.7)]"
                      : "bg-primary/25 transition-colors hover:bg-primary/45",
                  )}
                  style={{ height: `${Math.max(2, (d.count / niceMax) * 100)}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className={cn("absolute -bottom-6 text-[11px] font-medium leading-6", d.isToday ? "text-primary" : "text-fg-muted")}>
                  {d.isToday ? "Hoy" : d.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
