import { motion } from "motion/react";
import { Archive, CalendarClock, Layers, ScanSearch, type LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

const FEATURES: Array<{ icon: LucideIcon; title: string; text: string; detail: string }> = [
  { icon: Archive, title: "Guarda", text: "Sube archivos, imágenes, textos y recursos.", detail: "PDF · PNG · DOCX · ZIP · notas" },
  { icon: CalendarClock, title: "Organiza", text: "Cada subida queda asociada a usuario y fecha.", detail: "Kilian · 27 sept · 18:42" },
  { icon: ScanSearch, title: "Consulta", text: "Revisa fácilmente qué hizo cada miembro.", detail: "Filtra por persona, día o tipo" },
  { icon: Layers, title: "Centraliza", text: "Todo queda en un único espacio.", detail: "Un historial para todo el equipo" },
];

export function Features() {
  return (
    <section id="que-es" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6 }}>
            <p className="label mb-4 text-primary">¿Qué es ZyraFiles?</p>
            <h2 className="h2 text-[clamp(2rem,4.5vw,3.25rem)]">
              Tu actividad. <span className="text-gradient">Organizada automáticamente.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-lg text-[16px] leading-relaxed text-fg-secondary lg:justify-self-end"
          >
            Cada vez que alguien sube algo, ZyraFiles apunta quién fue y cuándo. Así, al final del día, la pregunta “¿qué ha hecho cada persona?” se responde con un vistazo.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Card spotlight interactive className="h-full" padded={false}>
                <div className="flex h-full flex-col p-6">
                  <span className="relative mb-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110">
                    <span className="absolute inset-0 rounded-2xl bg-primary/30 opacity-0 blur-lg transition-opacity duration-500 group-hover/card:opacity-100" />
                    <f.icon className="relative h-[22px] w-[22px]" />
                  </span>
                  <h3 className="h3 text-xl">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-secondary">{f.text}</p>
                  <p className="mt-6 border-t border-line pt-4 font-mono text-[11px] text-fg-muted">{f.detail}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
