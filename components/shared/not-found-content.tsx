"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechGridBackground } from "@/components/shared/tech-grid-background";

export function NotFoundContent() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPortal = pathname?.startsWith("/area-cliente");
  const backHref = isAdmin ? "/admin" : isPortal ? "/area-cliente" : "/";
  const backLabel = isAdmin ? "Voltar ao painel" : isPortal ? "Voltar à área do cliente" : "Voltar para a home";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <TechGridBackground glow="center" />

      <div className="w-full max-w-md text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20">
          <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-8 w-auto" />
        </span>
        <p className="mt-6 font-heading text-6xl font-medium text-primary">404</p>
        <h1 className="mt-2 font-heading text-2xl font-medium text-balance">Página não encontrada</h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button nativeButton={false} render={<Link href={backHref} />}>
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
          {!isAdmin && !isPortal && (
            <Button variant="outline" nativeButton={false} render={<Link href="/base-de-conhecimento" />}>
              <Search className="size-4" />
              Base de Conhecimento
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
