import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, File as FileIcon, FileText, Image as ImageIcon, Shapes, Type, Send } from "lucide-react";
import type { UploadType } from "../../types/upload";
import { useAuth } from "../../hooks/useAuth";
import { useUploads } from "../../hooks/useUploads";
import { usePreferences } from "../../hooks/usePreferences";
import { useRouter } from "../../lib/router";
import { cn, guessType, readAsDataURL, toISODate } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input, Textarea } from "../ui/Field";
import { Segmented } from "../ui/Segmented";
import { useToast } from "../ui/Toast";
import { FileUploader } from "./FileUploader";

const TYPES: Array<{ value: UploadType; label: string; icon: typeof FileIcon }> = [
  { value: "file", label: "Archivo", icon: FileIcon },
  { value: "image", label: "Imagen", icon: ImageIcon },
  { value: "document", label: "Documento", icon: FileText },
  { value: "text", label: "Texto", icon: Type },
  { value: "other", label: "Otro", icon: Shapes },
];

/** Máximo que guardamos en el navegador (el prototipo usa localStorage). */
const MAX_INLINE = 2.5 * 1024 * 1024;

/** Reduce imágenes grandes para que quepan en el almacenamiento local. */
async function compressImage(file: File): Promise<string> {
  const src = await readAsDataURL(file);
  if (file.type === "image/svg+xml" || file.type === "image/gif") return src;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

type Phase = "idle" | "loading" | "done";

export function UploadForm() {
  const { user } = useAuth();
  const { addUpload, openUpload } = useUploads();
  const { prefs } = usePreferences();
  const { success, error, info } = useToast();
  const { navigate } = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<UploadType>("file");
  const [typeTouched, setTypeTouched] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [date, setDate] = useState(toISODate(new Date()));
  const [phase, setPhase] = useState<Phase>("idle");
  const [titleError, setTitleError] = useState("");
  const [lastId, setLastId] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setDescription("");
    setType("file");
    setTypeTouched(false);
    setFile(null);
    setImage(null);
    setText("");
    setDate(toISODate(new Date()));
    setPhase("idle");
  };

  const onFile = (f: File | null) => {
    setFile(f);
    if (f && !typeTouched) setType(guessType(f));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) {
      setTitleError("Escribe un título para saber qué has hecho.");
      document.getElementById("upload-title")?.focus();
      return;
    }
    setTitleError("");
    setPhase("loading");
    try {
      let fileUrl: string | undefined;
      let imageUrl: string | undefined;
      let tooBig = false;
      if (file) {
        if (file.type.startsWith("image/")) imageUrl = await compressImage(file);
        else if (file.size <= MAX_INLINE) fileUrl = await readAsDataURL(file);
        else tooBig = true;
        if (file.type.startsWith("image/") && file.size <= MAX_INLINE) fileUrl = await readAsDataURL(file);
      }
      if (image) imageUrl = await compressImage(image);

      // Si la fecha elegida no es hoy, la marca temporal se sitúa en ese día.
      const now = new Date();
      const createdAt = date === toISODate(now) ? undefined : new Date(`${date}T${now.toTimeString().slice(0, 8)}`);
      const { upload, persisted } = await addUpload(
        {
          title: title.trim(),
          description: description.trim(),
          type,
          fileUrl,
          imageUrl,
          textContent: text.trim() || undefined,
          date,
          createdAt: createdAt?.toISOString(),
          file: file ? { name: file.name, size: file.size, mime: file.type } : undefined,
          image: image ? { name: image.name, size: image.size, mime: image.type } : undefined,
        },
        user,
      );

      setLastId(upload.id);
      setPhase("done");
      if (prefs.notifications) success("Subido correctamente", `“${upload.title}” ya aparece en la actividad.`);
      if (!persisted) error("No se pudo subir el archivo", "No cabía en el almacenamiento del navegador. La publicación se guardó sin el archivo.");
      else if (tooBig) info("Archivo registrado", "En este prototipo solo se guardan en el navegador archivos de hasta 2,5 MB; se han guardado su nombre y tamaño.");
    } catch {
      setPhase("idle");
      error("No se pudo subir el archivo", "Inténtalo de nuevo en unos segundos.");
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {phase === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Card className="flex flex-col items-center px-6 py-16 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success"
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/20" />
                <Check className="h-10 w-10" strokeWidth={2.5} />
              </motion.div>
              <h2 className="h2 text-2xl">Subido correctamente</h2>
              <p className="mt-2 max-w-sm text-sm text-fg-secondary">Tu publicación ya forma parte de la actividad del equipo.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={() => lastId && openUpload(lastId)}>
                  Ver publicación
                </Button>
                <Button variant="secondary" onClick={() => navigate("/app/me")}>
                  Ir a mi actividad
                </Button>
                <Button onClick={reset}>Subir otra</Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-[1.25fr_1fr]" noValidate>
            <div className="flex flex-col gap-6">
              <Card className="flex flex-col gap-5">
                <Input
                  id="upload-title"
                  label="Título"
                  placeholder="¿Qué has hecho?"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) setTitleError("");
                  }}
                  error={titleError}
                  maxLength={120}
                  autoFocus
                />
                <Textarea
                  id="upload-description"
                  label="Descripción"
                  placeholder="Describe brevemente lo realizado..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={600}
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-fg-secondary" id="type-label">Tipo</span>
                  <Segmented
                    ariaLabel="Tipo de contenido"
                    value={type}
                    onChange={(v) => {
                      setType(v);
                      setTypeTouched(true);
                    }}
                    options={TYPES.map((t) => ({ value: t.value, label: <><t.icon className="h-3.5 w-3.5" />{t.label}</> }))}
                    className="w-full sm:w-auto"
                  />
                </div>
              </Card>

              <Card className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-fg-secondary">Archivo</span>
                  <span className="text-xs text-fg-muted">Opcional</span>
                </div>
                <FileUploader file={file} onChange={onFile} id="upload-file" />
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-medium text-fg-secondary">Imagen</span>
                  <span className="text-xs text-fg-muted">Opcional · se muestra como portada</span>
                </div>
                <FileUploader file={image} onChange={setImage} accept="image/*" title="Añade una imagen" compact id="upload-image" />
              </Card>
              <Card className="flex flex-col gap-5">
                <Textarea
                  id="upload-text"
                  label="Texto"
                  placeholder="Notas, enlaces, pasos seguidos…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] font-mono text-[13px]"
                />
                <Input id="upload-date" type="date" label="Fecha" value={date} max={toISODate(new Date())} onChange={(e) => setDate(e.target.value || toISODate(new Date()))} />
              </Card>
              <Button type="submit" size="lg" loading={phase === "loading"} className={cn("w-full", phase === "loading" && "cursor-wait")} leftIcon={<Send className="h-4 w-4" />}>
                {phase === "loading" ? "Publicando…" : "Publicar en ZyraFiles"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
