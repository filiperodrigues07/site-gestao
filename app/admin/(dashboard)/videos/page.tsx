import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { and, count, desc, eq, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { ADMIN_PAGE_SIZE, parsePage, buildAdminHref } from "@/lib/admin/pagination";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { videos } from "@/lib/db/schema";
import { deleteVideo } from "./actions";

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; origem?: string; page?: string }>;
}) {
  await requirePermission("videos");
  const { q, origem, page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const conditions = [];
  if (q) conditions.push(like(videos.title, `%${q}%`));
  if (origem === "youtube" || origem === "upload") conditions.push(eq(videos.sourceType, origem));
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db.query.videos.findMany({
      where: whereClause,
      orderBy: (v) => desc(v.createdAt),
      limit: ADMIN_PAGE_SIZE,
      offset: (page - 1) * ADMIN_PAGE_SIZE,
    }),
    db.select({ total: count() }).from(videos).where(whereClause),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const buildHref = (targetPage: number) => buildAdminHref("/admin/videos", { q, origem }, targetPage);
  const hasFilters = Boolean(q || origem);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Vídeos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} vídeos cadastrados</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/videos/novo" />}>
          <Plus className="size-4" />
          Novo vídeo
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters
            searchPlaceholder="Buscar por título..."
            filters={[
              {
                param: "origem",
                label: "Origem",
                allLabel: "Origem: todas",
                options: [
                  { value: "youtube", label: "YouTube" },
                  { value: "upload", label: "Arquivo enviado" },
                ],
              },
            ]}
          />
        </Suspense>
      </div>

      <div className="mt-4">
        <AdminList
          rows={rows}
          columns={[
            { header: "Título", render: (row) => <span className="font-medium">{row.title}</span> },
            {
              header: "Origem",
              render: (row) => (
                <Badge variant="secondary">
                  {row.sourceType === "upload" ? "Arquivo enviado" : "YouTube"}
                </Badge>
              ),
            },
            { header: "Duração", render: (row) => row.durationLabel },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/videos/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteVideo.bind(null, row.id)} />
            </>
          )}
          emptyMessage={
            hasFilters ? "Nenhum vídeo encontrado para esses filtros." : "Nenhum vídeo cadastrado ainda."
          }
        />
      </div>

      <AdminPagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
