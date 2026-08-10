import Link from "next/link";
import { Plus, Pencil, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/auth/dal";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/auth/permissions";
import { db } from "@/lib/db/client";
import { deleteUser } from "@/lib/actions/usuarios";

export default async function AdminUsuariosPage() {
  await requireAdmin();
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
            {
              header: "Acesso",
              render: (row) =>
                row.isAdmin ? (
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheck className="size-3" />
                    Administrador
                  </Badge>
                ) : (row.permissions as AdminSection[]).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Nenhuma tela liberada</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {(row.permissions as AdminSection[]).map((key) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {ADMIN_SECTIONS.find((s) => s.key === key)?.label ?? key}
                      </Badge>
                    ))}
                  </div>
                ),
            },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/usuarios/${row.id}`} />}
                aria-label="Editar permissões"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteUser.bind(null, row.id)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
