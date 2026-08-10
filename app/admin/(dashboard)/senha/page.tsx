import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { getCurrentUser } from "@/lib/auth/dal";

export default async function TrocarSenhaPage() {
  await getCurrentUser();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Trocar senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Altere a sua senha de acesso ao painel administrativo.
      </p>
      <div className="mt-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
