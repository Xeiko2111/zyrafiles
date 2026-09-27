import { useId } from "react";
import { cn } from "../../lib/utils";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  /** Anima el trazo del logo al montarse (pantalla de carga / login). */
  animated?: boolean;
}

/**
 * Marca ZyraFiles: una "Z" cuyo trazo superior es la pestaña doblada
 * de un documento. Funciona sobre fondo claro y oscuro.
 */
export function LogoMark({ size = 32, animated, className }: { size?: number; animated?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("shrink-0 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover/logo:rotate-[-8deg] group-hover/logo:scale-110", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`zf-g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4a8ff" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id={`zf-s-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0d0b14" />
      <rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke={`url(#zf-g-${id})`} strokeOpacity="0.9" strokeWidth="1.2" />
      <path
        d="M11 11H24.5L29 15.5L17.5 24.5H29V29H11V24.5L22.5 15.5H11Z"
        fill={`url(#zf-g-${id})`}
        className={animated ? "[animation:zf-draw_1.1s_cubic-bezier(.22,1,.36,1)_both]" : undefined}
      />
      <path d="M24.5 11V15.5H29Z" fill="#e9d5ff" className="origin-[26px_14px] transition-transform duration-500 group-hover/logo:scale-125" />
      <rect x="1" y="1" width="38" height="19" rx="11" fill={`url(#zf-s-${id})`} />
      <style>{`@keyframes zf-draw{from{opacity:0;transform:translateY(4px) scale(.9)}to{opacity:1;transform:none}}`}</style>
    </svg>
  );
}

export function Logo({ size = 32, withWordmark = true, className, animated }: LogoProps) {
  return (
    <span className={cn("group/logo inline-flex items-center gap-2.5", className)}>
      <span className="relative">
        <span className="absolute inset-0 rounded-xl bg-primary/40 opacity-0 blur-lg transition-opacity duration-500 group-hover/logo:opacity-100" aria-hidden="true" />
        <LogoMark size={size} animated={animated} className="relative" />
      </span>
      {withWordmark && (
        <span className="font-display text-[17px] font-extrabold tracking-[-0.03em] text-fg">
          Zyra<span className="text-gradient">Files</span>
        </span>
      )}
    </span>
  );
}
