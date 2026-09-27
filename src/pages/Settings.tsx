import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Camera, Check, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme, type ThemePreference } from "../hooks/useTheme";
import { usePreferences } from "../hooks/usePreferences";
import { useRouter } from "../lib/router";
import { cn, readAsDataURL } from "../lib/utils";
import { PageHeader } from "../components/layout/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Field";
import { Switch } from "../components/ui/Switch";
import { useToast } from "../components/ui/Toast";

function Section({ title, description, children, index }: { title: string; description: string; children: ReactNode; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4 border-b border-line py-8 first:pt-0 last:border-0 lg:grid-cols-[260px_1fr] lg:gap-10"
    >
      <div>
        <h2 className="h3 text-lg">{title}</h2>
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

/** Mini vista previa de cada tema. */
function ThemePreview({ mode }: { mode: "dark" | "light" | "system" }) {
  const dark = <div className="h-full w-full bg-[#0b0a10] p-2"><div className="mb-1.5 h-2 w-10 rounded bg-[#9d6eff]" /><div className="mb-1 h-1.5 w-16 rounded bg-white/25" /><div className="h-1.5 w-12 rounded bg-white/10" /><div className="mt-2 h-6 rounded-md border border-white/10 bg-white/5" /></div>;
  const light = <div className="h-full w-full bg-[#faf9fc] p-2"><div className="mb-1.5 h-2 w-10 rounded bg-[#7c3aed]" /><div className="mb-1 h-1.5 w-16 rounded bg-black/25" /><div className="h-1.5 w-12 rounded bg-black/10" /><div className="mt-2 h-6 rounded-md border border-black/10 bg-white" /></div>;
  if (mode === "system")
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0">{light}</div>
        <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)]">{dark}</div>
      </div>
    );
  return mode === "dark" ? dark : light;
}

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { preference, setPreference } = useTheme();
  const { prefs, update } = usePreferences();
  const { success, error } = useToast();
  const { navigate } = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.displayName ?? "");
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  if (!user) return null;
  const dirty = name.trim() !== user.displayName || avatar !== user.avatar;

  const pickAvatar = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return error("Formato no válido", "Elige una imagen JPG, PNG o WebP.");
    const src = await readAsDataURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 320;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const s = Math.min(img.width, img.height);
      c.getContext("2d")?.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      setAvatar(c.toDataURL("image/jpeg", 0.86));
    };
    img.src = src;
  };

  const save = () => {
    if (!name.trim()) return error("El nombre no puede estar vacío");
    const ok = updateProfile({ displayName: name.trim(), avatar });
    if (ok) success("Cambios guardados");
    else error("No se pudieron guardar los cambios", "El almacenamiento del navegador está lleno.");
  };

  const themes: Array<{ value: ThemePreference; label: string; icon: typeof Moon }> = [
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "light", label: "Claro", icon: Sun },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <div>
      <PageHeader eyebrow="Cuenta" title="Configuración" subtitle="Tu perfil, la apariencia de ZyraFiles y tus preferencias." />
      <Card className="px-5 py-8 sm:px-8">
        <Section index={0} title="Perfil" description="Así te ven los demás en la actividad del equipo.">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative w-fit">
              <Avatar src={avatar} name={name || user.displayName} size="xl" />
              <button
                onClick={() => fileInput.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-card bg-primary text-white transition hover:scale-110"
                aria-label="Cambiar foto de perfil"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={(e) => pickAvatar(e.target.files?.[0])} />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Input id="settings-name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} hint={`Usuario de acceso: @${user.username}`} />
              <div className="flex gap-2">
                <Button onClick={save} disabled={!dirty} leftIcon={<Check className="h-4 w-4" />}>
                  Guardar cambios
                </Button>
                {dirty && (
                  <Button variant="ghost" onClick={() => (setName(user.displayName), setAvatar(user.avatar))}>
                    Descartar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section index={1} title="Apariencia" description="Elige tema o sigue el de tu sistema operativo.">
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Tema">
            {themes.map((t) => {
              const active = preference === t.value;
              return (
                <button
                  key={t.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPreference(t.value)}
                  className={cn(
                    "group overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
                    active ? "border-primary ring-glow" : "border-line hover:border-line-hover",
                  )}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden border-b border-line">
                    <ThemePreview mode={t.value} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <t.icon className={cn("h-4 w-4", active ? "text-primary" : "text-fg-muted")} />
                    <span className="text-sm font-medium">{t.label}</span>
                    {active && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section index={2} title="Preferencias" description="Ajustes que solo afectan a este navegador.">
          <div className="divide-y divide-line rounded-2xl border border-line px-4">
            <Switch
              id="pref-notifications"
              label="Notificaciones"
              description="Avisos al publicar y confirmaciones."
              checked={prefs.notifications}
              onChange={(v) => {
                update({ notifications: v });
                if (v) success("Notificaciones activadas");
              }}
            />
            <Switch
              id="pref-animations"
              label="Animaciones"
              description="Desactívalas para reducir el movimiento de la interfaz."
              checked={prefs.animations}
              onChange={(v) => update({ animations: v })}
            />
          </div>
        </Section>

        <Section index={3} title="Sesión" description={`Has iniciado sesión como ${user.displayName}.`}>
          <Button
            variant="danger"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={() => {
              logout();
              success("Sesión cerrada");
              navigate("/");
            }}
          >
            Cerrar sesión
          </Button>
        </Section>
      </Card>
    </div>
  );
}
