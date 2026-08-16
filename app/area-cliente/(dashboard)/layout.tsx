import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { portalLogoutAction } from "../actions";

// Sessão sempre reavaliada em tempo real, mesmo motivo do painel admin.
export const dynamic = "force-dynamic";

export default async function AreaClienteDashboardLayout({ children }: { children: ReactNode }) {
  const client = await getCurrentPortalClient();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/icon.png" alt="Gestão" width={298} height={244} className="size-7 w-auto" />
            <span className="font-heading text-sm font-medium">Área do cliente</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden text-sm text-muted-foreground sm:inline">{client.razaoSocial}</span>
            <form action={portalLogoutAction}>
              <button
                type="submit"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
