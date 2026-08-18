import Link from "next/link";
import Image from "next/image";
import { Building2, KeyRound, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { portalLogoutAction } from "@/app/area-cliente/actions";

export function PortalHeader({ razaoSocial }: { razaoSocial: string }) {
  return (
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
            <span className="max-w-48 truncate text-sm font-medium">{razaoSocial}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            aria-label="Trocar senha"
            title="Trocar senha"
            render={<Link href="/area-cliente/trocar-senha" />}
          >
            <KeyRound className="size-3.5" />
          </Button>
          <form action={portalLogoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-3.5" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
