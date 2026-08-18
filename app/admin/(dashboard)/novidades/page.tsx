import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { count, desc, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { ADMIN_PAGE_SIZE, parsePage, buildAdminHref } from "@/lib/admin/pagination";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { updates } from "@/lib/db/schema";
import { deleteUpdate } from "./actions";

export default async function AdminNovidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePermission("novidades");
  const { q, page: pageParam } = await searchParams;
  const page = parsePage(pageParam);
  const whereClause = q ? like(updates.title, `%${q}%`) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db.query.updates.findMany({
      where: whereClause,
      orderBy: (u) => desc(u.createdAt),
      with: { author: true },
      limit: ADMIN_PAGE_SIZE,
      offset: (page - 1) * ADMIN_PAGE_SIZE,
    }),
    db.select({ total: count() }).from(updates).where(whereClause),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const buildHref = (targetPage: number) => buildAdminHref("/admin/novidades", { q }, targetPage);
  const hasFilters = Boolean(q);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Novidades da semana</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} novidades publicadas — aparecem na home, mais recentes primeiro.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/novidades/novo" />}>
          <Plus className="size-4" />
          Nova novidade
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters searchPlaceholder="Buscar por título..." />
        </Suspense>
      </div>

      <div className="mt-4">
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
          emptyMessage={
            hasFilters
              ? "Nenhuma novidade encontrada para esses filtros."
              : "Nenhuma novidade cadastrada — a seção não aparece na home até que exista pelo menos uma."
          }
        />
      </div>

      <AdminPagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
