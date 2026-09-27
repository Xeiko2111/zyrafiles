import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  id: string;
}

export function Switch({ checked, onChange, label, description, id }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] text-fg-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300",
          checked ? "border-primary/60 bg-primary shadow-[0_0_16px_-4px_rgb(var(--primary-glow))]" : "border-line bg-fg/10",
        )}
      >
        <span
          className={cn(
            "inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]",
            checked ? "translate-x-[22px]" : "translate-x-[2px]",
          )}
        />
      </button>
    </div>
  );
}
