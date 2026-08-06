import { UserForm } from "@/components/admin/user-form";

export default function NovoUsuarioPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo usuário</h1>
      <div className="mt-6">
        <UserForm />
      </div>
    </div>
  );
}
