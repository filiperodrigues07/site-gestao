import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UserPermissionsForm } from "@/components/admin/user-permissions-form";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const user = await db.query.users.findFirst({ where: eq(users.id, Number(id)) });
  if (!user) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Permissões do usuário</h1>
      <div className="mt-6">
        <UserPermissionsForm user={user} />
      </div>
    </div>
  );
}
