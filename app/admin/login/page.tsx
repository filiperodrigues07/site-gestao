import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="font-heading text-xl font-medium">Painel administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entre com suas credenciais para gerenciar a Base de Conhecimento.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <Link
          href="/admin/trocar-senha"
          className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Trocar senha
        </Link>
      </div>
    </div>
  );
}
