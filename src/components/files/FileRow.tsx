import { motion } from "motion/react";
import type { Upload } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { useUploads } from "../../hooks/useUploads";
import { formatBytes, formatFull, formatLongDate, formatTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { TypeBadge, TypeTile } from "../ui/TypeBadge";

/** Fila de la vista lista. En móvil se convierte en tarjeta compacta. */
export function FileRow({ upload, index = 0 }: { upload: Upload; index?: number }) {
  const { getUser } = useAuth();
  const { openUpload } = useUploads();
  const a = getUser(upload.userId);
  const name = a?.displayName ?? upload.username;
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 14) * 0.025 }}
      className="list-none"
    >
      <button
        onClick={() => openUpload(upload.id)}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-card-hover md:grid-cols-[auto_minmax(0,2.2fr)_minmax(0,1fr)_110px_90px_150px] md:gap-4"
      >
        {upload.imageUrl ? (
          <img src={upload.imageUrl} alt="" className="h-10 w-10 rounded-xl border border-line object-cover" loading="lazy" />
        ) : (
          <TypeTile type={upload.type} />
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-fg">{upload.title}</span>
          <span className="block truncate text-xs text-fg-muted">{upload.file?.name ?? upload.description}</span>
        </span>
        <span className="hidden items-center gap-2 md:flex">
          <Avatar src={a?.avatar} name={name} size="xs" />
          <span className="truncate text-sm text-fg-secondary">{name}</span>
        </span>
        <span className="hidden md:block">
          <TypeBadge type={upload.type} />
        </span>
        <span className="meta hidden md:block">{upload.file ? formatBytes(upload.file.size) : "—"}</span>
        <time dateTime={upload.createdAt} title={formatFull(upload.createdAt)} className="meta whitespace-nowrap text-right">
          <span className="hidden md:inline">{formatLongDate(upload.createdAt).replace(/ \d{4}$/, "")} · </span>
          {formatTime(upload.createdAt)}
        </time>
      </button>
    </motion.li>
  );
}
