import { motion } from "motion/react";
import type { PublicUser } from "../../types/user";
import type { Upload } from "../../types/upload";
import { dayLabel, formatTime } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { CountUp } from "../ui/bits/CountUp";

/** Cabecera de perfil: foto, nombre, @usuario, publicaciones y última actividad. */
export function UserProfile({ user, uploads, isMe }: { user: PublicUser; uploads: Upload[]; isMe?: boolean }) {
  const last = uploads[0];
  const days = new Set(uploads.map((u) => u.date)).size;
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-line bg-card shadow-card"
    >
      <div className="relative h-28 overflow-hidden sm:h-36">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgb(var(--primary-deep)),rgb(var(--primary))_55%,#c084fc)]" />
        <div className="bg-grid absolute inset-0 opacity-40 [--grid-line:255_255_255] [--grid-alpha:0.12]" />
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-start">
          <div className="rounded-full border-4 border-card bg-card">
            <Avatar src={user.avatar} name={user.displayName} size="xl" />
          </div>
          <div className="flex-1 sm:pt-16">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="h2 text-3xl">{user.displayName}</h1>
              {isMe && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">Tú</span>}
            </div>
            <p className="font-mono text-sm text-fg-muted">
              @{user.username} · {user.role}
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3 sm:pt-14">
            <div className="rounded-2xl border border-line bg-bg-secondary px-4 py-3">
              <dt className="text-[11px] text-fg-muted">Publicaciones</dt>
              <dd className="font-display text-2xl font-extrabold tabular-nums"><CountUp to={uploads.length} /></dd>
            </div>
            <div className="rounded-2xl border border-line bg-bg-secondary px-4 py-3">
              <dt className="text-[11px] text-fg-muted">Días activos</dt>
              <dd className="font-display text-2xl font-extrabold tabular-nums"><CountUp to={days} /></dd>
            </div>
            <div className="rounded-2xl border border-line bg-bg-secondary px-4 py-3">
              <dt className="text-[11px] text-fg-muted">Última actividad</dt>
              <dd className="mt-1 text-sm font-semibold">{last ? `${dayLabel(last.date)}, ${formatTime(last.createdAt)}` : "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.section>
  );
}
