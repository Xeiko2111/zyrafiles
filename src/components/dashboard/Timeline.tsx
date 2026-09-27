import { motion } from "motion/react";
import type { Upload } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { useUploads } from "../../hooks/useUploads";
import { formatFull, formatTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { TypeBadge } from "../ui/TypeBadge";

/** Línea de tiempo vertical: hora · avatar · usuario · título · tipo. */
export function Timeline({ uploads, delay = 0 }: { uploads: Upload[]; delay?: number }) {
  const { getUser } = useAuth();
  const { openUpload } = useUploads();
  return (
    <ol className="relative">
      <span className="absolute bottom-3 left-[72px] top-3 w-px bg-gradient-to-b from-primary/60 via-line to-transparent" aria-hidden="true" />
      {uploads.map((u, i) => {
        const a = getUser(u.userId);
        const name = a?.displayName ?? u.username;
        return (
          <motion.li
            key={u.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={() => openUpload(u.id)} className="group flex w-full items-center gap-4 rounded-xl py-2.5 pr-2 text-left transition hover:bg-fg/[0.03]">
              <time dateTime={u.createdAt} title={formatFull(u.createdAt)} className="meta w-10 shrink-0 text-right">
                {formatTime(u.createdAt)}
              </time>
              <span className="relative z-10 rounded-full ring-4 ring-card">
                <Avatar src={a?.avatar} name={name} size="sm" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-fg">{name}</span>
                <span className="block truncate text-[14px] text-fg-secondary transition group-hover:text-fg">{u.title}</span>
              </span>
              <TypeBadge type={u.type} className="hidden sm:inline-flex" />
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}
