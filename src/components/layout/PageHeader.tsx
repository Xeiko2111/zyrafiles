import type { ReactNode } from "react";
import { motion } from "motion/react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        {eyebrow && <p className="label mb-2 text-primary">{eyebrow}</p>}
        <h1 className="h2 text-[clamp(1.75rem,3.4vw,2.5rem)]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-fg-secondary">{subtitle}</p>}
      </motion.div>
      {actions && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="flex flex-wrap gap-2">
          {actions}
        </motion.div>
      )}
    </div>
  );
}
