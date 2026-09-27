import { motion } from "motion/react";
import type { Upload } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { useUploads } from "../../hooks/useUploads";
import { formatBytes } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { RelativeTime } from "../ui/RelativeTime";
import { TypeBadge, TypeIcon } from "../ui/TypeBadge";

/** Tarjeta con vista previa para la vista en cuadrícula. */
export function UploadCard({ upload, index = 0 }: { upload: Upload; index?: number }) {
  const { getUser } = useAuth();
  const { openUpload } = useUploads();
  const author = getUser(upload.userId);
  const name = author?.displayName ?? upload.username;

  return (
    <motion.button
      type="button"
      onClick={() => openUpload(upload.id)}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card text-left shadow-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_40px_-20px_rgb(var(--primary-glow)/0.5)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg-secondary">
        {upload.imageUrl ? (
          <img src={upload.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : upload.textContent ? (
          <p className="line-clamp-5 whitespace-pre-line p-4 font-mono text-[12px] leading-relaxed text-fg-secondary">{upload.textContent}</p>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <TypeIcon type={upload.type} className="h-5 w-5" />
            </span>
            {upload.file && <span className="max-w-[80%] truncate font-mono text-[11px]">{upload.file.name}</span>}
          </div>
        )}
        <TypeBadge type={upload.type} className="glass absolute left-3 top-3 border-white/10" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-[15px] font-semibold text-fg">{upload.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-fg-muted">{upload.description}</p>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <Avatar src={author?.avatar} name={name} size="xs" />
          <span className="text-xs font-medium text-fg-secondary">{name}</span>
          <span className="ml-auto flex items-center gap-2 text-[11px] text-fg-muted">
            {upload.file && <span className="font-mono">{formatBytes(upload.file.size)}</span>}
            <RelativeTime iso={upload.createdAt} />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
