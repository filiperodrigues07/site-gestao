import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { desc, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { deleteInstagramPost } from "@/lib/actions/instagram";

export default async function AdminInstagramPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("instagram");
  const { q } = await searchParams;

  const rows = await db.query.instagramPosts.findMany({
    where: q ? like(instagramPosts.caption, `%${q}%`) : undefined,
    orderBy: (p) => desc(p.createdAt),
  });
  const hasFilters = Boolean(q);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Publicações do Instagram</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} publicações no grid da home — curadoria manual, mais recentes primeiro.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/instagram/novo" />}>
          <Plus className="size-4" />
          Nova publicação
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters searchPlaceholder="Buscar por legenda..." />
        </Suspense>
      </div>

      <div className="mt-4">
        <AdminList
          rows={rows}
          columns={[
            {
              header: "Imagem",
              render: (row) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/instagram/${row.id}/image`}
                  alt={row.caption}
                  className="h-14 w-14 rounded-md border border-border bg-muted object-cover"
                />
              ),
            },
            { header: "Legenda", render: (row) => <span className="font-medium">{row.caption}</span> },
            {
              header: "Link",
              render: (row) =>
                row.postUrl ? (
                  <span className="text-xs text-muted-foreground">{row.postUrl}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
          ]}
          actions={(row) => <DeleteButton action={deleteInstagramPost.bind(null, row.id)} />}
          emptyMessage={
            hasFilters
              ? "Nenhuma publicação encontrada para esses filtros."
              : "Nenhuma publicação cadastrada — a seção não aparece na home até que exista pelo menos uma."
          }
        />
      </div>
    </div>
  );
}
