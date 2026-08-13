import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/auth-shell";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      title="Painel administrativo"
      description="Entre com suas credenciais para gerenciar a Base de Conhecimento."
      footer={
        <Link
          href="/admin/trocar-senha"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Trocar senha
        </Link>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
