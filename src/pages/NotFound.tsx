import { useRouter } from "../lib/router";
import { Button } from "../components/ui/Button";
import { LogoMark } from "../components/ui/Logo";

export default function NotFound() {
  const { navigate } = useRouter();
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <LogoMark size={56} />
      <p className="mt-8 font-mono text-sm text-primary">404</p>
      <h1 className="h2 mt-2 text-3xl">Esta página no existe</h1>
      <p className="mt-2 text-fg-secondary">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Button className="mt-8" onClick={() => navigate("/")}>Volver al inicio</Button>
    </div>
  );
}
