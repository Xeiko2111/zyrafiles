/** Revelado palabra a palabra con desenfoque → nítido (estilo "Blur Text" de React Bits). */
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p" | "span";
}

export function BlurText({ text, className, wordClassName, delay = 0, stagger = 0.08, as = "span" }: BlurTextProps) {
  const Tag = as;
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={cn("inline-block will-change-[transform,filter,opacity]", wordClassName)}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </Tag>
  );
}
