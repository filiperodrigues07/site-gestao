import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { PortalHeader } from "@/components/portal/portal-header";

// Sessão sempre reavaliada em tempo real, mesmo motivo do painel admin.
export const dynamic = "force-dynamic";

export default async function AreaClienteDashboardLayout({ children }: { children: ReactNode }) {
  const client = await getCurrentPortalClient();
  if (client.mustChangePassword) redirect("/area-cliente/trocar-senha");

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader razaoSocial={client.razaoSocial} />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
