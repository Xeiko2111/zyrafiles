import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragOver" | "onDragEnter" | "onDragLeave" | "onDrop"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "text-primary-fg bg-[linear-gradient(135deg,rgb(var(--primary-hover)),rgb(var(--primary))_45%,rgb(var(--primary-deep)))] shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_24px_-10px_rgb(var(--primary-glow)/0.8)] hover:shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_10px_32px_-8px_rgb(var(--primary-glow)/0.95)] hover:brightness-110",
  secondary: "bg-card text-fg border border-line hover:border-line-hover hover:bg-card-hover shadow-card",
  outline: "bg-transparent text-fg border border-line hover:border-primary/60 hover:text-primary",
  ghost: "bg-transparent text-fg-secondary hover:text-fg hover:bg-fg/[0.06]",
  danger: "bg-danger/10 text-danger border border-danger/25 hover:bg-danger/15",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-xl",
  icon: "h-9 w-9 rounded-xl justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, leftIcon, rightIcon, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18 }}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex select-none items-center justify-center font-semibold whitespace-nowrap transition-[filter,box-shadow,background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner className="h-4 w-4" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
});
