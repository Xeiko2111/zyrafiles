/** Contador animado 0 → valor (estilo "Count Up" de React Bits). */
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../../lib/utils";

export function CountUp({ to, duration = 1.2, delay = 0, className }: { to: number; duration?: number; delay?: number; className?: string }) {
  const [val, setVal] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion() || document.documentElement.classList.contains("reduce-motion")) {
      setVal(to);
      from.current = to;
      return;
    }
    let raf = 0;
    const start = from.current;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (to - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);

  return <span className={className ?? "tabular-nums"}>{val}</span>;
}
