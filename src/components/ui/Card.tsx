import { useRef, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Eleva la tarjeta y le da borde violeta al pasar el cursor. */
  interactive?: boolean;
  /** Foco de luz que sigue al cursor (estilo React Bits "Spotlight Card"). */
  spotlight?: boolean;
  padded?: boolean;
}

export function Card({ interactive, spotlight, padded = true, className, children, onMouseMove, ...rest }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (!spotlight || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-line bg-card shadow-card",
        padded && "p-5",
        interactive &&
          "cursor-pointer transition-[transform,border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-primary/40 hover:bg-card-hover hover:shadow-[0_18px_40px_-18px_rgb(var(--primary-glow)/0.45)]",
        className,
      )}
      {...rest}
    >
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgb(var(--primary) / 0.12), transparent 60%)" }}
        />
      )}
      <div
        className="relative h-full"
        style={{ display: "inherit", flexDirection: "inherit", flexWrap: "inherit", gap: "inherit", alignItems: "inherit", justifyContent: "inherit" }}
      >
        {children}
      </div>
    </div>
  );
}
