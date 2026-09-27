/**
 * Usuario de ZyraFiles.
 * `password` existe SOLO para el prototipo (demo local). En producción la
 * autenticación irá contra un backend con contraseñas hasheadas y nunca
 * se guardará en el cliente.
 */
export interface User {
  id: string;
  username: string;
  password: string;
  avatar: string;
  /** Nombre visible (editable en Configuración). */
  displayName: string;
  /** Rol dentro del equipo. */
  role: string;
  /** Nombres alternativos aceptados en el login. */
  aliases?: string[];
}

/** Usuario sin credenciales: lo que el resto de la app puede ver. */
export type PublicUser = Omit<User, "password" | "aliases">;
