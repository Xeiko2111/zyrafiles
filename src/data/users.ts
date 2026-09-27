import type { User } from "../types/user";
import ikerAvatar from "../assets/avatars/iker.jpg";
import kilianAvatar from "../assets/avatars/kilian.jpg";
import ahmednahAvatar from "../assets/avatars/ahmednah.jpg";

/**
 * Usuarios iniciales de la demo.
 * Para cambiar una foto basta con sustituir el archivo en
 * src/assets/avatars/ (mismo nombre) o cambiar el import.
 *
 * ⚠ Credenciales solo de prototipo. No es autenticación segura.
 */
export const SEED_USERS: User[] = [
  {
    id: "u-iker",
    username: "Iker",
    password: "123",
    avatar: ikerAvatar,
    displayName: "Iker",
    role: "CEO",
  },
  {
    id: "u-kilian",
    username: "Kilian",
    password: "123",
    avatar: kilianAvatar,
    displayName: "Kilian",
    role: "Co-Owner",
  },
  {
    id: "u-ahmednah",
    username: "Ahmednah",
    password: "123",
    avatar: ahmednahAvatar,
    displayName: "Ahmednah",
    role: "Owner",
    aliases: ["Amena"],
  },
];
