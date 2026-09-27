import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { NewUpload, Upload } from "../types/upload";
import type { PublicUser } from "../types/user";
import { localDataSource, storage, StorageQuotaError, type DataSource } from "../lib/storage";
import { uid } from "../lib/utils";

type Status = "loading" | "ready" | "error";

interface UploadsState {
  uploads: Upload[];
  status: Status;
  reload: () => void;
  /** Devuelve la subida creada; `persisted=false` si no cupo en el almacenamiento. */
  addUpload: (data: NewUpload, author: PublicUser) => Promise<{ upload: Upload; persisted: boolean }>;
  removeUpload: (id: string) => Promise<void>;
  /** Detalle abierto en el modal global. */
  selectedId: string | null;
  openUpload: (id: string) => void;
  closeUpload: () => void;
}

const UploadsContext = createContext<UploadsState | null>(null);

function sortDesc(list: Upload[]) {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function UploadsProvider({ children, source = localDataSource }: { children: ReactNode; source?: DataSource }) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 450)); // deja ver los skeletons, como con una API real
      let list = await source.listUploads();
      // Limpieza: elimina las publicaciones de ejemplo de versiones anteriores.
      if (list.some((u) => u.id.startsWith("seed-"))) {
        list = list.filter((u) => !u.id.startsWith("seed-"));
        await source.saveUploads(list).catch(() => undefined);
      }
      storage.remove("seeded");
      setUploads(sortDesc(list));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [source]);

  useEffect(() => {
    void load();
  }, [load]);

  const addUpload = useCallback(
    async (data: NewUpload, author: PublicUser) => {
      await new Promise((r) => setTimeout(r, 900));
      const upload: Upload = { ...data, id: uid("up"), userId: author.id, username: author.displayName, createdAt: data.createdAt ?? new Date().toISOString() };
      const next = sortDesc([upload, ...uploads]);
      let persisted = true;
      try {
        await source.saveUploads(next);
      } catch (e) {
        if (!(e instanceof StorageQuotaError)) throw e;
        // No cabe el binario en localStorage: guardamos solo los metadatos.
        persisted = false;
        const light = next.map((u) => (u.id === upload.id ? { ...u, fileUrl: undefined, imageUrl: undefined } : u));
        await source.saveUploads(light).catch(() => undefined);
      }
      setUploads(next);
      return { upload, persisted };
    },
    [uploads, source],
  );

  const removeUpload = useCallback(
    async (id: string) => {
      const next = uploads.filter((u) => u.id !== id);
      setUploads(next);
      await source.saveUploads(next).catch(() => undefined);
    },
    [uploads, source],
  );

  const value = useMemo<UploadsState>(
    () => ({
      uploads,
      status,
      reload: () => void load(),
      addUpload,
      removeUpload,
      selectedId,
      openUpload: setSelectedId,
      closeUpload: () => setSelectedId(null),
    }),
    [uploads, status, load, addUpload, removeUpload, selectedId],
  );

  return <UploadsContext.Provider value={value}>{children}</UploadsContext.Provider>;
}

export function useUploads(): UploadsState {
  const ctx = useContext(UploadsContext);
  if (!ctx) throw new Error("useUploads debe usarse dentro de <UploadsProvider>");
  return ctx;
}
