import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const base =
  "w-full rounded-xl border border-line bg-bg-secondary/60 px-3.5 text-[14px] text-fg placeholder:text-fg-muted/80 outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-line-hover focus:border-primary/70 focus:bg-card focus:shadow-[0_0_0_4px_rgb(var(--primary)/0.14)]";

interface FieldShellProps {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ id, label, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-fg-secondary">
          {label}
        </label>
      )}
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-fg-muted">{hint}</p> : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, className, wrapperClassName, id, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted transition-colors group-focus-within:text-primary">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={fid}
          aria-invalid={!!error || undefined}
          className={cn(base, "h-11", icon && "pl-10", error && "border-danger/60", className)}
          {...rest}
        />
      </div>
    </FieldShell>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, wrapperClassName, id, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} error={error} className={wrapperClassName}>
      <textarea ref={ref} id={fid} className={cn(base, "min-h-[104px] resize-y py-3 leading-relaxed", className)} {...rest} />
    </FieldShell>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, options, className, wrapperClassName, id, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell id={fid} label={label} hint={hint} className={wrapperClassName}>
      <div className="relative">
        <select ref={ref} id={fid} className={cn(base, "h-11 cursor-pointer appearance-none pr-10", className)} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
      </div>
    </FieldShell>
  );
});
