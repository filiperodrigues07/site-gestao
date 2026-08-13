import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { and, desc, eq, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { downloads } from "@/lib/db/schema";
import { DOWNLOAD_FILE_TYPES } from "@/lib/uploads/constants";
import { deleteDownload } from "./actions";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminDownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  await requirePermission("downloads");
  const { q, type } = await searchParams;

  const conditions = [];
  if (q) conditions.push(like(downloads.title, `%${q}%`));
  if (type && (DOWNLOAD_FILE_TYPES as readonly string[]).includes(type)) {
    conditions.push(eq(downloads.fileType, type as (typeof DOWNLOAD_FILE_TYPES)[number]));
  }

  const rows = await db.query.downloads.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: (d) => desc(d.createdAt),
  });
  const hasFilters = Boolean(q || type);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Downloads</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} arquivos cadastrados</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/downloads/novo" />}>
          <Plus className="size-4" />
          Novo download
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters
            searchPlaceholder="Buscar por título..."
            filters={[
              {
                param: "type",
                label: "Tipo",
                allLabel: "Tipo: todos",
                options: DOWNLOAD_FILE_TYPES.map((t) => ({ value: t, label: t })),
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
            { header: "Tipo", render: (row) => <Badge variant="secondary">{row.fileType}</Badge> },
            { header: "Tamanho", render: (row) => formatSize(row.sizeBytes) },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/downloads/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteDownload.bind(null, row.id)} />
            </>
          )}
          emptyMessage={
            hasFilters ? "Nenhum arquivo encontrado para esses filtros." : "Nenhum arquivo cadastrado ainda."
          }
        />
      </div>
    </div>
  );
}
