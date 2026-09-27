import { formatFull, relativeTime } from "../../lib/utils";

/** Fecha relativa; la fecha completa aparece al pasar el cursor. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  return (
    <time dateTime={iso} title={formatFull(iso)} className={className}>
      {relativeTime(iso)}
    </time>
  );
}
