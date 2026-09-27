import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { RouterProvider, matchPath, useRouter } from "./lib/router";
import { ThemeProvider } from "./hooks/useTheme";
import { PreferencesProvider, usePreferences } from "./hooks/usePreferences";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { UploadsProvider } from "./hooks/useUploads";
import { ToastProvider } from "./components/ui/Toast";
import { AppLayout } from "./components/layout/AppLayout";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import Activity from "./pages/Activity";
import MyActivity from "./pages/MyActivity";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function PrivatePage({ path }: { path: string }) {
  const profile = matchPath("/app/user/:id", path);
  if (profile) return <Profile userId={profile.id} />;
  switch (path.replace(/\/$/, "")) {
    case "/app":
      return <Dashboard />;
    case "/app/upload":
      return <UploadPage />;
    case "/app/me":
      return <MyActivity />;
    case "/app/activity":
      return <Activity />;
    case "/app/files":
      return <Files />;
    case "/app/settings":
      return <Settings />;
    default:
      return <NotFound />;
  }
}

function Routes() {
  const { path, navigate } = useRouter();
  const { user } = useAuth();
  const isPrivate = path.startsWith("/app");

  // Protección de rutas: sin sesión → login (volviendo después a donde iba).
  useEffect(() => {
    if (isPrivate && !user) navigate(`/login?next=${encodeURIComponent(path)}`, { replace: true });
  }, [isPrivate, user, path, navigate]);

  // Título de la pestaña según la página.
  useEffect(() => {
    const names: Record<string, string> = {
      "/": "ZyraFiles · Todo lo que haces. En un solo lugar.",
      "/login": "Acceder · ZyraFiles",
      "/app": "Dashboard · ZyraFiles",
      "/app/upload": "Nueva subida · ZyraFiles",
      "/app/me": "Mi actividad · ZyraFiles",
      "/app/activity": "Actividad del equipo · ZyraFiles",
      "/app/files": "Todos los archivos · ZyraFiles",
      "/app/settings": "Configuración · ZyraFiles",
    };
    document.title = names[path] ?? (path.startsWith("/app/user/") ? "Perfil · ZyraFiles" : "ZyraFiles");
  }, [path]);

  if (path === "/" || path === "") return <Landing />;
  if (path === "/login") return <Login />;
  if (isPrivate) {
    if (!user) return null;
    return (
      <AppLayout>
        <PrivatePage path={path} />
      </AppLayout>
    );
  }
  return <NotFound />;
}

function Shell() {
  const { prefs } = usePreferences();
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), prefs.animations ? 1100 : 200);
    return () => window.clearTimeout(t);
  }, [prefs.animations]);

  return (
    <MotionConfig reducedMotion={prefs.animations ? "user" : "always"}>
      <AnimatePresence>{booting && <LoadingScreen key="boot" />}</AnimatePresence>
      <Routes />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ThemeProvider>
        <PreferencesProvider>
          <ToastProvider>
            <AuthProvider>
              <UploadsProvider>
                <Shell />
              </UploadsProvider>
            </AuthProvider>
          </ToastProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </RouterProvider>
  );
}
