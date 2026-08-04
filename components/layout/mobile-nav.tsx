"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-heading text-lg">
            {siteConfig.shortName}
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-1 px-4">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 flex flex-col gap-2 px-4">
          <Button
            nativeButton={false}
            render={
              <Link href="/contato?tipo=demo" onClick={() => setOpen(false)} />
            }
          >
            Solicitar Demonstração
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
