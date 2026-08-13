import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/admin/auth-shell";
import { ChangePasswordByCredentialsForm } from "@/components/admin/change-password-by-credentials-form";

export const metadata: Metadata = {
  title: "Trocar senha",
  robots: { index: false, follow: false },
};

export default function TrocarSenhaLoginPage() {
  return (
    <AuthShell
      title="Trocar senha"
      description="Informe seu usuário e a senha atual para definir uma nova senha."
      footer={
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o login
        </Link>
      }
    >
      <ChangePasswordByCredentialsForm />
    </AuthShell>
  );
}
