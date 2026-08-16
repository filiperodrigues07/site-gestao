import type { Metadata } from "next";
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
    >
      <PortalLoginForm />
    </AuthShell>
  );
}
