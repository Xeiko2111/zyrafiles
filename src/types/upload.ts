export type UploadType = "file" | "image" | "document" | "text" | "other";

export interface UploadAttachment {
  name: string;
  size: number;
  mime: string;
}

export interface Upload {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  type: UploadType;
  fileUrl?: string;
  imageUrl?: string;
  textContent?: string;
  /** Fecha del trabajo (YYYY-MM-DD). */
  date: string;
  /** Momento exacto de la subida (ISO). */
  createdAt: string;
  /** Metadatos del archivo adjunto (nombre, tamaño, tipo). */
  file?: UploadAttachment;
  image?: UploadAttachment;
}

export type NewUpload = Omit<Upload, "id" | "userId" | "username" | "createdAt"> & { createdAt?: string };
