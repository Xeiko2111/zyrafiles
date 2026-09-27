import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CountUp } from "../ui/bits/CountUp";
import { Card } from "../ui/Card";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  hint?: ReactNode;
  index?: number;
}

export function StatCard({ label, value, icon, hint, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card spotlight className="h-full">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-medium text-fg-secondary">{label}</p>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">{icon}</span>
        </div>
        <p className="mt-4 font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] text-fg">
          {typeof value === "number" ? <CountUp to={value} delay={0.2 + index * 0.08} /> : <span className="tabular-nums">{value}</span>}
        </p>
        {hint && <div className="mt-2 text-xs text-fg-muted">{hint}</div>}
      </Card>
    </motion.div>
  );
}
