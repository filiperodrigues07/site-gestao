import type { ReactNode } from "react";
import Image from "next/image";
import { TechGridBackground } from "@/components/shared/tech-grid-background";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <TechGridBackground glow="center" />
      <ThemeToggle className="absolute top-4 right-4" />

      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20">
            <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-7 w-auto" />
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <h1 className="text-center font-heading text-xl font-medium">{title}</h1>
          <p className="mt-1.5 text-center text-sm text-muted-foreground text-pretty">
            {description}
          </p>
          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
