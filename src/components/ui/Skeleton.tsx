import { cn } from "../../lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-fg/[0.06]", className)} aria-hidden="true">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-fg/[0.06] to-transparent" />
    </div>
  );
}

export function ActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Cargando">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
