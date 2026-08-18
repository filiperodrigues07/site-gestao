"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechGridBackground } from "@/components/shared/tech-grid-background";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPortal = pathname?.startsWith("/area-cliente");
  const backHref = isAdmin ? "/admin" : isPortal ? "/area-cliente" : "/";
  const backLabel = isAdmin ? "Voltar ao painel" : isPortal ? "Voltar à área do cliente" : "Voltar para a home";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <TechGridBackground glow="center" />

      <div className="w-full max-w-md text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
          <Image src="/brand/icon.png" alt="" width={298} height={244} className="size-8 w-auto" />
        </span>
        <h1 className="mt-6 font-heading text-2xl font-medium text-balance">Algo deu errado</h1>
        <p className="mt-3 text-muted-foreground text-pretty">
          Encontramos um erro inesperado. Tente novamente ou volte para o começo.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()}>
            <RotateCcw className="size-4" />
            Tentar novamente
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href={backHref} />}>
            <ArrowLeft className="size-4" />
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
