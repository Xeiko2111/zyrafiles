import { File, FileText, Image, Shapes, Type } from "lucide-react";
import type { UploadType } from "../../types/upload";
import { cn, TYPE_LABELS } from "../../lib/utils";

const ICONS = { file: File, image: Image, document: FileText, text: Type, other: Shapes };

export function TypeIcon({ type, className }: { type: UploadType; className?: string }) {
  const I = ICONS[type];
  return <I className={cn("h-4 w-4", className)} />;
}

/** Icono grande dentro de un recuadro (listas de archivos). */
export function TypeTile({ type, className }: { type: UploadType; className?: string }) {
  return (
    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary", className)}>
      <TypeIcon type={type} className="h-[18px] w-[18px]" />
    </span>
  );
}

export function TypeBadge({ type, className }: { type: UploadType; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-line bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-fg-secondary", className)}>
      <TypeIcon type={type} className="h-3 w-3 text-primary" />
      {TYPE_LABELS[type]}
    </span>
  );
}
