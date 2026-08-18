import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import { PortalHeader } from "@/components/portal/portal-header";
import { ChangePasswordForm } from "@/components/portal/change-password-form";

export const metadata: Metadata = {
  title: "Trocar senha",
  robots: { index: false, follow: false },
};

// Sessão sempre reavaliada em tempo real, mesmo motivo do painel admin.
export const dynamic = "force-dynamic";

export default async function TrocarSenhaPage() {
  const client = await getCurrentPortalClient();

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader razaoSocial={client.razaoSocial} />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-heading text-2xl font-medium">Trocar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Altere a senha de acesso à área do cliente.
        </p>

        {client.mustChangePassword && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <p>
              Essa é a sua senha inicial — defina uma nova senha para continuar usando a área do
              cliente.
            </p>
          </div>
        )}

        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </main>
    </div>
  );
}
