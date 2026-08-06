import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { db } from "@/lib/db/client";
import { deleteUser } from "@/lib/actions/usuarios";

export default async function AdminUsuariosPage() {
  const rows = await db.query.users.findMany({ orderBy: (u, { asc }) => asc(u.name) });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Usuários</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} usuários cadastrados</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/usuarios/novo" />}>
          <Plus className="size-4" />
          Novo usuário
        </Button>
      </div>

      <div className="mt-6">
        <AdminList
          rows={rows}
          columns={[
            { header: "Nome", render: (row) => <span className="font-medium">{row.name}</span> },
            { header: "Usuário", render: (row) => <code className="text-xs">{row.username}</code> },
          ]}
          actions={(row) => <DeleteButton action={deleteUser.bind(null, row.id)} />}
        />
      </div>
    </div>
  );
}
