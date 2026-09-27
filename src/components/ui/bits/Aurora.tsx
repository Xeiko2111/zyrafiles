/**
 * Manchas de luz violeta que se desplazan lentamente (estilo "Aurora" de React Bits).
 * Solo CSS: barato y respeta prefers-reduced-motion.
 */
import { cn } from "../../../lib/utils";

export function Aurora({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div
        className="absolute -top-[30%] left-[10%] h-[70%] w-[60%] rounded-full md:blur-[110px] animate-[aurora-a_18s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(closest-side, rgb(var(--primary) / ${0.42 * intensity}), transparent)` }}
      />
      <div
        className="absolute -top-[10%] right-[-10%] h-[60%] w-[45%] rounded-full md:blur-[120px] animate-[aurora-b_22s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(closest-side, rgb(var(--primary-deep) / ${0.5 * intensity}), transparent)` }}
      />
      <div
        className="absolute bottom-[-20%] left-[30%] h-[50%] w-[40%] rounded-full md:blur-[120px] animate-[aurora-a_26s_ease-in-out_infinite_reverse]"
        style={{ background: `radial-gradient(closest-side, rgb(217 70 239 / ${0.16 * intensity}), transparent)` }}
      />
      <style>{`
        @keyframes aurora-a { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(8%, 6%) scale(1.12) } }
        @keyframes aurora-b { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(-10%, 8%) scale(0.92) } }
      `}</style>
    </div>
  );
}
