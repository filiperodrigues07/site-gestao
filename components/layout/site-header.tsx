"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Limites diferentes para recolher/expandir (com folga entre eles) —
    // um único limite fixo faz o cabeçalho tremer, já que a rolagem oscila
    // uns px pra cima e pra baixo bem perto do topo e cruza o limite várias
    // vezes seguidas, reiniciando a transição de altura a cada cruzamento.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((current) => (current ? y > 4 : y > 32));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        scrolled
          ? "h-20 border-border bg-background/95 shadow-sm shadow-black/5"
          : "h-[195px] border-border/60 bg-background/80"
      )}
    >
      <Container className="flex h-full items-center justify-between">
        <Logo className="transition-transform duration-300" scrolled={scrolled} />

        <nav className="hidden md:flex items-center gap-1">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            nativeButton={false}
            className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            render={<Link href="/area-cliente" />}
          >
            <UserRound className="size-4" />
            Área do cliente
          </Button>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
