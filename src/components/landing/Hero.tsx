import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "../../lib/router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Particles } from "../ui/bits/Particles";
import { Aurora } from "../ui/bits/Aurora";
import { BlurText } from "../ui/bits/BlurText";
import { HeroVisual } from "./HeroVisual";
import { scrollToId } from "./scroll";

export function Hero() {
  const { navigate } = useRouter();
  const { user } = useAuth();

  return (
    <section id="inicio" className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-40">
      <Aurora />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true" />
      <Particles className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 px-3.5 py-1.5 text-[13px] font-medium text-fg-secondary"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          El diario de trabajo de tu equipo
        </motion.div>

        <h1 className="h1 text-[clamp(2.6rem,8vw,5.6rem)]">
          <BlurText text="Todo lo que haces." className="block text-fg" delay={0.15} />
          <BlurText text="En un solo lugar." className="block" wordClassName="text-gradient pb-2" delay={0.45} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-fg-secondary sm:text-lg"
        >
          ZyraFiles permite a tu equipo guardar, organizar y consultar todo lo que hace cada día: archivos, imágenes, notas, documentos y mucho más.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => navigate(user ? "/app" : "/login")}>
            Acceder a ZyraFiles
          </Button>
          <Button size="lg" variant="secondary" onClick={() => scrollToId("actividad")}>
            Explorar actividad
          </Button>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}
