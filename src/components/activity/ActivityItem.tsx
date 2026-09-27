import { motion } from "motion/react";
import type { Upload } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { useUploads } from "../../hooks/useUploads";
import { Link } from "../../lib/router";
import { cn, formatFull, formatTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { TypeBadge, TypeTile } from "../ui/TypeBadge";

interface ActivityItemProps {
  upload: Upload;
  index?: number;
  /** Muestra la hora en lugar de la fecha relativa. */
  showUser?: boolean;
  compact?: boolean;
}

/** Fila de actividad: avatar, usuario, título, tipo, hora y miniatura. */
export function ActivityItem({ upload, index = 0, showUser = true, compact }: ActivityItemProps) {
  const { getUser } = useAuth();
  const { openUpload } = useUploads();
  const author = getUser(upload.userId);
  const name = author?.displayName ?? upload.username;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 10) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => openUpload(upload.id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openUpload(upload.id))}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-transparent text-left transition-[background-color,border-color,transform] duration-200 hover:border-line hover:bg-card-hover sm:gap-4",
          compact ? "p-2.5" : "p-3",
        )}
        aria-label={`${upload.title}, de ${name}`}
      >
        {showUser ? (
          <Link to={`/app/user/${upload.userId}`} onClick={(e) => e.stopPropagation()} className="shrink-0 rounded-full" aria-label={`Perfil de ${name}`} tabIndex={-1}>
            <Avatar src={author?.avatar} name={name} size="md" />
          </Link>
        ) : (
          <TypeTile type={upload.type} />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {showUser && <span className="text-[13px] font-semibold text-fg">{name}</span>}
            {showUser && <span className="hidden text-fg-muted/60 sm:inline" aria-hidden="true">·</span>}
            <TypeBadge type={upload.type} className="hidden sm:inline-flex" />
          </div>
          <p className="truncate text-[14px] text-fg-secondary transition-colors group-hover:text-fg">{upload.title}</p>
        </div>
        {upload.imageUrl && (
          <img src={upload.imageUrl} alt="" className="hidden h-11 w-16 shrink-0 rounded-lg border border-line object-cover sm:block" loading="lazy" />
        )}
        <time dateTime={upload.createdAt} title={formatFull(upload.createdAt)} className="meta shrink-0">
          {formatTime(upload.createdAt)}
        </time>
      </div>
    </motion.li>
  );
}
