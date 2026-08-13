import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { asc, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { getKbIcon } from "@/components/sections/knowledge-base/kb-icons";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { deleteCategory } from "@/lib/actions/categorias";

export default async function AdminCategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("categorias");
  const { q } = await searchParams;

  const rows = await db.query.categories.findMany({
    where: q ? like(categories.name, `%${q}%`) : undefined,
    orderBy: (c) => asc(c.name),
  });
  const hasFilters = Boolean(q);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Categorias</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} categorias cadastradas</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/categorias/novo" />}>
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters searchPlaceholder="Buscar por nome..." />
        </Suspense>
      </div>

      <div className="mt-4">
        <AdminList
          rows={rows}
          columns={[
            {
              header: "Nome",
              render: (row) => {
                const Icon = getKbIcon(row.iconKey);
                return (
                  <span className="flex items-center gap-2 font-medium">
                    <Icon className="size-4 text-primary" />
                    {row.name}
                  </span>
                );
              },
            },
            { header: "Slug", render: (row) => <code className="text-xs">{row.slug}</code> },
            { header: "Descrição", render: (row) => row.description },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/categorias/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteCategory.bind(null, row.id)} />
            </>
          )}
          emptyMessage={
            hasFilters ? "Nenhuma categoria encontrada para esses filtros." : "Nenhuma categoria cadastrada ainda."
          }
        />
      </div>
    </div>
  );
}
