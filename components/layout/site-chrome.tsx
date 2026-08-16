"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { FloatingWhatsappButton } from "./floating-whatsapp-button";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBareLayout = pathname?.startsWith("/admin") || pathname?.startsWith("/area-cliente");

  if (isBareLayout) return <main className="flex-1">{children}</main>;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsappButton />
    </>
  );
}
