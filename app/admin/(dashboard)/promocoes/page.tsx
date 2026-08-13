import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { asc, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { promotions } from "@/lib/db/schema";
import { deletePromotion } from "@/lib/actions/promocoes";

export default async function AdminPromocoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("promocoes");
  const { q } = await searchParams;

  const rows = await db.query.promotions.findMany({
    where: q ? like(promotions.title, `%${q}%`) : undefined,
    orderBy: (p) => asc(p.createdAt),
  });
  const hasFilters = Boolean(q);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Promoções</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} imagens no carrossel da home — aparecem na ordem de cadastro, antes da seção
            &quot;Sobre a Gestão&quot;.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/promocoes/novo" />}>
          <Plus className="size-4" />
          Nova promoção
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
              render: (row) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/promotions/${row.id}/image`}
                  alt={row.title}
                  className="h-14 w-24 rounded-md border border-border bg-muted object-contain"
                />
              ),
            },
            { header: "Título", render: (row) => <span className="font-medium">{row.title}</span> },
            {
              header: "Link",
              render: (row) =>
                row.linkUrl ? (
                  <span className="text-xs text-muted-foreground">{row.linkUrl}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
          ]}
          actions={(row) => <DeleteButton action={deletePromotion.bind(null, row.id)} />}
          emptyMessage={
            hasFilters
              ? "Nenhuma promoção encontrada para esses filtros."
              : "Nenhuma promoção cadastrada — o carrossel não aparece na home até que exista pelo menos uma."
          }
        />
      </div>
    </div>
  );
}
