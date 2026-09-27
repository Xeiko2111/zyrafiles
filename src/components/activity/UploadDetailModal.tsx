import { useEffect, useState } from "react";
import { Calendar, Clock, Download, ExternalLink, Trash2, X } from "lucide-react";
import { useUploads } from "../../hooks/useUploads";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../ui/Toast";
import { useRouter } from "../../lib/router";
import { formatBytes, formatLongDate, formatTime, TYPE_LABELS } from "../../lib/utils";
import type { Upload } from "../../types/upload";
import { Modal } from "../ui/Modal";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { TypeBadge, TypeTile } from "../ui/TypeBadge";

function download(u: Upload) {
  let href = u.fileUrl ?? u.imageUrl;
  let name = u.file?.name ?? u.image?.name ?? `${u.title}.txt`;
  let revoke = false;
  if (!href) {
    // Publicación sin binario guardado: descargamos una ficha de texto.
    const body = `${u.title}\n${"=".repeat(u.title.length)}\n\n${u.description}\n\n${u.textContent ?? ""}\n\nSubido por ${u.username} el ${formatLongDate(u.createdAt)} a las ${formatTime(u.createdAt)} · ZyraFiles`;
    href = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    if (!u.textContent) name = `${u.file?.name ?? u.title}.txt`;
    revoke = true;
  } else if (!u.fileUrl && u.imageUrl && !u.image) {
    name = `${u.title}.svg`;
  }
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (revoke) window.setTimeout(() => URL.revokeObjectURL(href!), 2000);
}

function openInNewTab(url: string) {
  // Las data: URL no pueden abrirse directamente en una pestaña; se convierten en blob.
  if (url.startsWith("data:")) {
    fetch(url)
      .then((r) => r.blob())
      .then((b) => window.open(URL.createObjectURL(b), "_blank", "noopener"));
  } else window.open(url, "_blank", "noopener");
}

export function UploadDetailModal() {
  const { uploads, selectedId, closeUpload, removeUpload } = useUploads();
  const { getUser, user } = useAuth();
  const { success } = useToast();
  const { navigate } = useRouter();
  const [confirming, setConfirming] = useState(false);
  const upload = uploads.find((u) => u.id === selectedId) ?? null;
  const [last, setLast] = useState<Upload | null>(upload);

  useEffect(() => {
    if (upload) setLast(upload);
    setConfirming(false);
  }, [upload]);

  const u = upload ?? last;
  const author = u ? getUser(u.userId) : undefined;
  const name = author?.displayName ?? u?.username ?? "";
  const isMine = !!u && user?.id === u.userId;
  const openable = u && (u.fileUrl || u.imageUrl) && /image|pdf|text|svg/.test(u.file?.mime ?? u.image?.mime ?? "image");

  return (
    <Modal open={!!upload} onClose={closeUpload} bare className="sm:max-w-2xl" labelledBy="upload-detail-title">
      {u && (
        <article>
          {u.imageUrl ? (
            <div className="relative bg-bg-secondary">
              <img src={u.imageUrl} alt={u.title} className="max-h-[48vh] w-full object-contain" />
            </div>
          ) : (
            <div className="h-2 bg-[linear-gradient(90deg,rgb(var(--primary-deep)),rgb(var(--primary)),rgb(var(--primary-hover)))]" />
          )}
          <button
            onClick={closeUpload}
            className="glass absolute right-4 top-4 rounded-full border border-line p-2 text-fg transition hover:scale-105"
            aria-label="Cerrar detalle"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={u.type} />
              <span className="meta flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatLongDate(u.createdAt)}
              </span>
              <span className="meta flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatTime(u.createdAt)}
              </span>
            </div>

            <div>
              <h2 id="upload-detail-title" className="h2 text-2xl sm:text-[28px]">
                {u.title}
              </h2>
              {u.description && <p className="mt-2 text-[15px] leading-relaxed text-fg-secondary">{u.description}</p>}
            </div>

            <button
              onClick={() => {
                closeUpload();
                navigate(`/app/user/${u.userId}`);
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-bg-secondary/60 p-3 text-left transition hover:border-primary/40"
            >
              <Avatar src={author?.avatar} name={name} size="md" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{name}</span>
                <span className="block text-xs text-fg-muted">
                  Subido el {formatLongDate(u.createdAt)} a las {formatTime(u.createdAt)}
                </span>
              </span>
              <span className="text-xs font-medium text-primary">Ver perfil</span>
            </button>

            {u.textContent && (
              <div>
                <p className="label mb-2">Texto</p>
                <div className="whitespace-pre-line rounded-2xl border border-line bg-bg-secondary/60 p-4 font-mono text-[13px] leading-relaxed text-fg-secondary">
                  {u.textContent}
                </div>
              </div>
            )}

            {(u.file || u.fileUrl || u.imageUrl) && (
              <div>
                <p className="label mb-2">Archivo</p>
                <div className="flex flex-col gap-3 rounded-2xl border border-line p-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <TypeTile type={u.type} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.file?.name ?? u.image?.name ?? `${u.title} (vista previa)`}</p>
                      <p className="meta">
                        {u.file ? `${formatBytes(u.file.size)} · ` : ""}
                        {TYPE_LABELS[u.type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {openable && (
                      <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-3.5 w-3.5" />} onClick={() => openInNewTab((u.fileUrl ?? u.imageUrl)!)}>
                        Abrir
                      </Button>
                    )}
                    <Button size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={() => download(u)}>
                      Descargar archivo
                    </Button>
                  </div>
                </div>
                {!u.fileUrl && u.file && (
                  <p className="mt-2 text-xs text-fg-muted">El archivo no se guardó en el navegador (era demasiado grande); la descarga genera una ficha con los datos de la publicación.</p>
                )}
              </div>
            )}

            {isMine && (
              <div className="flex items-center justify-end gap-2 border-t border-line pt-5">
                {confirming ? (
                  <>
                    <span className="mr-auto text-sm text-fg-secondary">¿Eliminar esta publicación?</span>
                    <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        closeUpload();
                        await removeUpload(u.id);
                        success("Publicación eliminada");
                      }}
                    >
                      Eliminar
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setConfirming(true)}>
                    Eliminar
                  </Button>
                )}
              </div>
            )}
          </div>
        </article>
      )}
    </Modal>
  );
}
