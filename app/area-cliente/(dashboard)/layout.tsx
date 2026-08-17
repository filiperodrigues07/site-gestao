import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { Building2, LogOut } from "lucide-react";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { portalLogoutAction } from "../actions";

// Sessão sempre reavaliada em tempo real, mesmo motivo do painel admin.
export const dynamic = "force-dynamic";

export default async function AreaClienteDashboardLayout({ children }: { children: ReactNode }) {
  const client = await getCurrentPortalClient();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/icon.png" alt="Gestão" width={298} height={244} className="size-7 w-auto" />
            <span className="hidden font-heading text-sm font-medium sm:inline">Área do cliente</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 sm:flex">
              <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="max-w-48 truncate text-sm font-medium">{client.razaoSocial}</span>
            </div>
            <form action={portalLogoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="size-3.5" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
