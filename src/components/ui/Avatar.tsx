import { useState } from "react";
import { cn } from "../../lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
const sizes: Record<Size, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
};

interface AvatarProps {
  src?: string;
  name: string;
  size?: Size;
  /** Punto verde de "Activo". */
  online?: boolean;
  ring?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = "md", online, ring, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full bg-primary-soft font-semibold text-primary",
          ring && "ring-2 ring-primary/60 ring-offset-2 ring-offset-bg",
          sizes[size],
        )}
      >
        {src && !failed ? (
          <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} draggable={false} />
        ) : (
          <span aria-label={name}>{name.slice(0, 1).toUpperCase()}</span>
        )}
      </span>
      {online && (
        <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-success animate-pulse-ring" />
          <span className="relative h-2.5 w-2.5 rounded-full border-2 border-bg bg-success" />
        </span>
      )}
    </span>
  );
}
