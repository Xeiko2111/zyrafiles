import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  /** Enfoca con la tecla "/" */
  shortcut?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = "Buscar…", className, shortcut = true, autoFocus }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcut]);

  return (
    <div className={cn("group relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted transition-colors group-focus-within:text-primary" />
      <input
        ref={ref}
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && (onChange(""), ref.current?.blur())}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-xl border border-line bg-card pl-10 pr-16 text-sm text-fg outline-none transition placeholder:text-fg-muted hover:border-line-hover focus:border-primary/70 focus:shadow-[0_0_0_4px_rgb(var(--primary)/0.14)] [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {value ? (
          <button onClick={() => onChange("")} className="rounded-md p-1 text-fg-muted hover:text-fg" aria-label="Limpiar búsqueda">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          shortcut && <kbd className="hidden rounded-md border border-line bg-bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-fg-muted sm:inline">/</kbd>
        )}
      </div>
    </div>
  );
}
