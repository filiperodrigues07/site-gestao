import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { deleteUpdate } from "./actions";

export default async function AdminNovidadesPage() {
  await requirePermission("novidades");
  const rows = await db.query.updates.findMany({
    orderBy: (u, { desc }) => desc(u.createdAt),
    with: { author: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Novidades da semana</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} novidades publicadas — aparecem na home, mais recentes primeiro.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/novidades/novo" />}>
          <Plus className="size-4" />
          Nova novidade
        </Button>
      </div>

      <div className="mt-6">
        <AdminList
          rows={rows}
          columns={[
            {
              header: "Imagem",
              render: (row) =>
                row.storedFileName ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/updates/${row.id}/image`}
                    alt=""
                    className="h-14 w-14 rounded-md border border-border bg-muted object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
            { header: "Título", render: (row) => <span className="font-medium">{row.title}</span> },
            { header: "Autor", render: (row) => row.author?.name ?? "—" },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/novidades/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteUpdate.bind(null, row.id)} />
            </>
          )}
          emptyMessage="Nenhuma novidade cadastrada — a seção não aparece na home até que exista pelo menos uma."
        />
      </div>
    </div>
  );
}
