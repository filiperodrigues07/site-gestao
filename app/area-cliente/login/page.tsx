import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/admin/auth-shell";
import { PortalLoginForm } from "@/components/portal/login-form";

export const metadata: Metadata = {
  title: "Área do cliente",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  return (
    <AuthShell
      title="Área do cliente"
      description="Entre com o CNPJ e a senha cadastrados pela Gestão para consultar seus títulos."
      footer={
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para o site
        </Link>
      }
    >
      <PortalLoginForm />
    </AuthShell>
  );
}
