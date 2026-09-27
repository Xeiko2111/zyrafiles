import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, KeyRound, LogIn, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../lib/router";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { Logo, LogoMark } from "../components/ui/Logo";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useToast } from "../components/ui/Toast";
import { Avatar } from "../components/ui/Avatar";
import { Aurora } from "../components/ui/bits/Aurora";
import { Particles } from "../components/ui/bits/Particles";
import type { PublicUser } from "../types/user";

export default function Login() {
  const { login, users, user } = useAuth();
  const { navigate, query } = useRouter();
  const { error: toastError } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState<PublicUser | null>(null);
  const [shake, setShake] = useState(0);

  const next = query.get("next");
  const target = next && next.startsWith("/app") ? next : "/app";

  // Si ya había sesión al llegar aquí, pasamos directamente a la app.
  const hadSession = useRef(!!user);
  useEffect(() => {
    if (hadSession.current) navigate(target, { replace: true });
  }, [navigate, target]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Introduce tu usuario y tu contraseña.");
      setShake((s) => s + 1);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const u = await login(username, password);
      setWelcome(u);
      window.setTimeout(() => navigate(target, { replace: true }), 1300);
    } catch {
      setLoading(false);
      setError("Usuario o contraseña incorrectos");
      toastError("Usuario o contraseña incorrectos", "Revisa los datos e inténtalo de nuevo.");
      setShake((s) => s + 1);
    }
  };

  return (
    <div className="relative grid min-h-screen bg-bg lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca (escritorio) */}
      <aside className="relative hidden overflow-hidden border-r border-line bg-[#08070d] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Aurora intensity={1.2} />
        <Particles className="absolute inset-0 h-full w-full" density={0.00009} />
        <div className="relative">
          <button onClick={() => navigate("/")} className="rounded-xl text-white" aria-label="Volver al inicio">
            <span className="group/logo inline-flex items-center gap-2.5">
              <LogoMark size={30} />
              <span className="font-display text-[17px] font-extrabold tracking-[-0.03em] text-white">
                Zyra<span className="text-[#b18cff]">Files</span>
              </span>
            </span>
          </button>
        </div>
        <div className="relative max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h1 text-5xl text-white"
          >
            Lo que hizo tu equipo hoy, <span className="bg-gradient-to-r from-[#c4a8ff] to-[#8b5cf6] bg-clip-text text-transparent">a un clic.</span>
          </motion.h2>
          <div className="mt-10 flex flex-col gap-3">
            {users.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur"
                style={{ marginLeft: `${i * 24}px` }}
              >
                <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-sm font-semibold text-white">{u.displayName}</span>
                <span className="ml-auto font-mono text-[11px] text-white/45">{u.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/40">© 2026 ZyraFiles</p>
      </aside>

      {/* Formulario */}
      <main className="relative flex flex-col px-4 py-6 sm:px-8">
        <div className="absolute inset-0 overflow-hidden lg:hidden">
          <Aurora intensity={0.8} />
        </div>
        <div className="relative flex items-center justify-between">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fg-muted transition hover:text-fg">
            <ArrowLeft className="h-4 w-4" /> Inicio
          </button>
          <ThemeToggle />
        </div>

        <div className="relative mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }} className="relative mb-8 w-fit">
            <div className="absolute inset-0 rounded-2xl bg-primary/50 blur-2xl" />
            <Logo withWordmark={false} size={52} animated className="relative" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="h2 text-[34px]">Bienvenido de nuevo</h1>
            <p className="mt-2 text-[15px] text-fg-secondary">Entra para ver y registrar la actividad del equipo.</p>
          </motion.div>

          <motion.form
            key={shake}
            onSubmit={submit}
            noValidate
            initial={shake ? false : { opacity: 0, y: 24 }}
            animate={shake ? { opacity: 1, y: 0, x: [0, -10, 9, -6, 4, 0] } : { opacity: 1, y: 0 }}
            transition={shake ? { duration: 0.45 } : { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-4"
          >
            <Input
              id="login-user"
              label="Usuario"
              placeholder="Tu nombre de usuario"
              autoComplete="username"
              icon={<UserIcon className="h-4 w-4" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Input
              id="login-pass"
              label="Contraseña"
              type="password"
              placeholder="••••"
              autoComplete="current-password"
              icon={<KeyRound className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <Button type="submit" size="lg" loading={loading} className="mt-2 w-full" rightIcon={<LogIn className="h-4 w-4" />}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </motion.form>

        </div>
      </main>

      {/* Animación de éxito */}
      <AnimatePresence>
        {welcome && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-bg/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar src={welcome.avatar} name={welcome.displayName} size="xl" ring />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-bg bg-success text-white"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </motion.span>
              </div>
              <p className="h2 mt-6 text-3xl">
                <span className="text-success">✓</span> Bienvenido, {welcome.displayName}
              </p>
              <p className="mt-2 text-sm text-fg-muted">Preparando tu espacio…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
