"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Tema claro" },
  { value: "dark", icon: Moon, label: "Tema escuro" },
  { value: "system", icon: Monitor, label: "Tema do sistema" },
] as const;

const noopSubscribe = () => () => {};

// A preferência real só existe no cliente (evita mismatch de hidratação entre
// o HTML gerado no servidor e o tema já resolvido no navegador) — usa
// useSyncExternalStore em vez de useEffect+setState pra não disparar
// renders em cascata.
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div
      role="radiogroup"
      aria-label="Tema do site"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-0.5",
        className
      )}
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-background text-foreground shadow-sm"
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
