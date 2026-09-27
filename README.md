# ZyraFiles

Plataforma privada para que el equipo registre y consulte todo lo que hace cada día: archivos, imágenes, documentos, textos y notas. Cada subida queda asociada automáticamente a su autor y a la fecha/hora.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de producción en dist/
```

Stack: React 19 · TypeScript · Vite · Tailwind CSS · Motion (`motion/react`) · Lucide React.

## Cuentas de la demo

| Usuario   | Contraseña |
|-----------|------------|
| Iker      | 123        |
| Kilian    | 123        |
| Ahmednah  | 123        |

`Amena` también se acepta como nombre de usuario de Ahmednah.

> ⚠ Solo para el prototipo. Las credenciales se comprueban en el navegador y los datos viven en `localStorage`. No es un sistema de autenticación seguro.

## Fotos de perfil

Están en `src/assets/avatars/` (`iker.jpg`, `kilian.jpg`, `ahmednah.jpg`) y se asignan en `src/data/users.ts`. Para cambiar una, sustituye el archivo con el mismo nombre. Cada usuario también puede cambiar su foto y su nombre desde **Configuración**.

## Estructura

```
src/
  components/
    ui/          Button, Card, Avatar, Modal, Toast, Dropdown, Field (Input/Textarea/Select),
                 Tooltip, Segmented, SearchBar, ThemeToggle, Skeleton, States, Logo, Switch…
    ui/bits/     Fondos y textos animados (Particles, Aurora, BlurText, RotatingText, CountUp)
    layout/      AppLayout, Sidebar, Topbar, CommandPalette (⌘K), PageTransition, LoadingScreen
    landing/     Navbar, Hero, Statement, Features, ActivityPreview, FinalCTA, Footer
    dashboard/   StatCard, WeeklyChart, Timeline
    uploads/     FileUploader (drag & drop), UploadForm
    activity/    ActivityItem, UploadCard, GroupedByDate, GroupedByUser, ActivityFilters, UploadDetailModal
    profile/     UserProfile
    files/       FileRow
  pages/         Landing, Login, Dashboard, Upload, Activity, MyActivity, Files, Settings, Profile, NotFound
  hooks/         useAuth, useTheme, usePreferences, useUploads, useFilteredUploads
  data/          users.ts (usuarios del equipo)
  types/         user.ts, upload.ts
  lib/           storage.ts (capa de datos), router.tsx (router por hash), utils.ts
```

Los colores salen de tokens en `src/index.css` (`--primary`, `--background`, `--card`, `--text`, `--border`…) expuestos en `tailwind.config.js` (`bg-primary`, `text-fg-muted`, `border-line`…). Modo oscuro y claro tienen paletas propias.

## Atajos de teclado

- `⌘K` / `Ctrl+K`: búsqueda global
- `/`: enfocar el buscador de la página
- `N`: nueva subida
- `G` y luego `D`, `U`, `M`, `E`, `F` o `C`: ir a Dashboard, Subir, Mi actividad, Equipo, Archivos o Configuración

## Pasar a un backend real

- **Datos**: `src/lib/storage.ts` define la interfaz `DataSource` (`listUploads`, `saveUploads`). Implementa una versión con `fetch` a tu API y pásala a `<UploadsProvider source={…}>`.
- **Archivos**: `UploadForm` hoy convierte los archivos a data URL (máx. 2,5 MB por el límite de `localStorage`). Sustitúyelo por una subida a almacenamiento (S3, Cloudflare R2…) y guarda la URL en `fileUrl` / `imageUrl`.
- **Autenticación**: `src/hooks/useAuth.tsx` mantiene la misma interfaz (`login`, `logout`, `user`). Cambia `login` por una llamada al servidor (contraseñas con hash, sesión en cookie httpOnly) y elimina `password` de `data/users.ts`.

## Nota sobre React Bits y Watermelon UI

Los componentes animados de `components/ui/bits/` siguen el estilo de React Bits (partículas, aurora, blur text, rotating text, count up) pero están escritos en el propio proyecto, sin dependencias externas. Si quieres usar los originales, puedes instalarlos con su CLI (`npx shadcn@latest add https://reactbits.dev/r/<componente>`) y sustituirlos: las props son parecidas.
