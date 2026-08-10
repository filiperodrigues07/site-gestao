import { UserForm } from "@/components/admin/user-form";
import { requireAdmin } from "@/lib/auth/dal";

export default async function NovoUsuarioPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo usuário</h1>
      <div className="mt-6">
        <UserForm />
      </div>
    </div>
  );
}
