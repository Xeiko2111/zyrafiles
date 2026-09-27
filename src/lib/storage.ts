/**
 * Capa de persistencia.
 * Hoy usa localStorage; para pasar a un backend real basta con
 * implementar la misma interfaz `DataSource` con llamadas a la API
 * (fetch a /api/uploads, subida de archivos a S3/R2, etc.).
 */
import type { Upload } from "../types/upload";

const PREFIX = "zyrafiles:";

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* sin almacenamiento disponible */
    }
  },
};

export class StorageQuotaError extends Error {
  constructor() {
    super("No hay espacio suficiente en el almacenamiento local.");
  }
}

export interface DataSource {
  listUploads(): Promise<Upload[]>;
  saveUploads(uploads: Upload[]): Promise<void>;
}

/** Implementación local (prototipo). */
export const localDataSource: DataSource = {
  async listUploads() {
    return storage.get<Upload[] | null>("uploads", null) ?? [];
  },
  async saveUploads(uploads) {
    if (!storage.set("uploads", uploads)) throw new StorageQuotaError();
  },
};
