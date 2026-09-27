import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: ReactNode; ariaLabel?: string }>;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

/** Control segmentado con indicador que se desliza entre opciones. */
export function Segmented<T extends string>({ value, onChange, options, size = "md", className, ariaLabel }: SegmentedProps<T>) {
  const wrap = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`);
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [value, options.length]);

  return (
    <div
      ref={wrap}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("relative inline-flex max-w-full items-center overflow-x-auto rounded-xl border border-line bg-bg-secondary p-1", className)}
    >
      {ind && (
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-lg border border-line bg-card shadow-card transition-[left,width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ left: ind.left, width: ind.width }}
        />
      )}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          aria-label={o.ariaLabel}
          data-value={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative z-10 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors",
            size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-[13px]",
            o.value === value ? "text-fg" : "text-fg-muted hover:text-fg-secondary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
