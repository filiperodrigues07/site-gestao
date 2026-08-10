import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChangePasswordByCredentialsForm } from "@/components/admin/change-password-by-credentials-form";

export const metadata: Metadata = {
  title: "Trocar senha",
  robots: { index: false, follow: false },
};

export default function TrocarSenhaLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="font-heading text-xl font-medium">Trocar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe seu usuário e a senha atual para definir uma nova senha.
        </p>
        <div className="mt-6">
          <ChangePasswordByCredentialsForm />
        </div>
        <Link
          href="/admin/login"
          className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
