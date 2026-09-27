import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, CloudUpload, Trash2 } from "lucide-react";
import { cn, formatBytes, guessType } from "../../lib/utils";
import { TypeTile } from "../ui/TypeBadge";

interface FileUploaderProps {
  file: File | null;
  onChange: (f: File | null) => void;
  accept?: string;
  /** Texto principal de la zona. */
  title?: string;
  compact?: boolean;
  id?: string;
}

/** Zona de arrastrar y soltar + tarjeta del archivo seleccionado. */
export function FileUploader({ file, onChange, accept, title = "Arrastra tus archivos aquí", compact, id }: FileUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const preview = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onChange(f);
  };

  return (
    <div>
      <input
        ref={input}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.04]"
          >
            {preview && (
              <div className="border-b border-line bg-bg-secondary">
                <img src={preview} alt={`Vista previa de ${file.name}`} className="mx-auto max-h-64 object-contain" />
              </div>
            )}
            <div className="flex items-center gap-3 p-4">
              <TypeTile type={guessType(file)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">{file.name}</p>
                <p className="meta">
                  {formatBytes(file.size)} · {file.type || "tipo desconocido"}
                </p>
              </div>
              <span className="hidden items-center gap-1 text-xs font-semibold text-success sm:flex">
                <CircleCheck className="h-4 w-4" /> Listo
              </span>
              <button type="button" onClick={() => onChange(null)} className="rounded-lg p-2 text-fg-muted transition hover:bg-danger/10 hover:text-danger" aria-label={`Quitar ${file.name}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="drop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={cn(
              "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition-[border-color,background-color] duration-200",
              compact ? "px-4 py-7" : "px-6 py-12",
              drag ? "border-primary bg-primary/[0.08]" : "border-line bg-bg-secondary/40 hover:border-primary/40",
            )}
          >
            {drag && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(var(--primary)/0.18),transparent_70%)]" />}
            <motion.span
              animate={drag ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
              className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary"
            >
              <CloudUpload className="h-6 w-6" />
            </motion.span>
            <p className="relative text-[15px] font-semibold text-fg">{drag ? "Suelta para añadir" : title}</p>
            <p className="relative mt-1 text-sm text-fg-muted">
              o{" "}
              <button type="button" onClick={() => input.current?.click()} className="font-semibold text-primary underline-offset-4 hover:underline">
                Seleccionar archivo
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
