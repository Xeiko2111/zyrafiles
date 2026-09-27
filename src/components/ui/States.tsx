import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Inbox, RefreshCw, TriangleAlert, Upload } from "lucide-react";
import { Button } from "./Button";
import { useRouter } from "../../lib/router";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  showUploadAction?: boolean;
}

export function EmptyState({
  title = "Todavía no hay actividad",
  description = "Cuando alguien suba algo aparecerá aquí.",
  icon,
  action,
  showUploadAction = true,
}: EmptyStateProps) {
  const { navigate } = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-card/40 px-6 py-16 text-center"
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-primary/25 blur-xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary-soft text-primary">
          {icon ?? <Inbox className="h-6 w-6" />}
        </div>
      </div>
      <h3 className="h3 text-lg text-fg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-fg-secondary">{description}</p>
      <div className="mt-6">
        {action ??
          (showUploadAction && (
            <Button leftIcon={<Upload className="h-4 w-4" />} onClick={() => navigate("/app/upload")}>
              Subir contenido
            </Button>
          ))}
      </div>
    </motion.div>
  );
}

export function ErrorState({ onRetry, title = "Algo salió mal", description = "Ha ocurrido un problema al cargar la información." }: { onRetry: () => void; title?: string; description?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-3xl border border-danger/25 bg-danger/[0.04] px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <h3 className="h3 text-lg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-fg-secondary">{description}</p>
      <Button variant="secondary" className="mt-6" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
        Intentar de nuevo
      </Button>
    </div>
  );
}
