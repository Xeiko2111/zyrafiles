import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "../../lib/router";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { LogoMark } from "../ui/Logo";
import { Aurora } from "../ui/bits/Aurora";

export function FinalCTA() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-primary/25 bg-[#0b0912] px-6 py-16 text-center sm:px-12 sm:py-24"
      >
        <Aurora intensity={1.3} />
        <div className="bg-grid absolute inset-0 opacity-60 [--grid-alpha:0.05] [--grid-line:255_255_255] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
        <div className="relative">
          <div className="mx-auto mb-8 w-fit">
            <LogoMark size={56} />
          </div>
          <h2 className="h2 mx-auto max-w-3xl text-[clamp(2rem,5vw,3.5rem)] text-white">Empieza a organizar tu trabajo con ZyraFiles</h2>
          <p className="mt-4 text-lg text-white/65">Todo lo que haces. En un solo lugar.</p>
          <Button size="lg" className="mt-10" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => navigate(user ? "/app" : "/login")}>
            Entrar en ZyraFiles
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
