import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { deleteArticle } from "./actions";

export default async function AdminArtigosPage() {
  await requirePermission("artigos");
  const rows = await db.query.articles.findMany({
    orderBy: (a, { desc }) => desc(a.updatedAt),
    with: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Artigos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} artigos cadastrados</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/artigos/novo" />}>
          <Plus className="size-4" />
          Novo artigo
        </Button>
      </div>

      <div className="mt-6">
        <AdminList
          rows={rows}
          columns={[
            { header: "Título", render: (row) => <span className="font-medium">{row.title}</span> },
            { header: "Categoria", render: (row) => row.category?.name ?? "—" },
            {
              header: "Status",
              render: (row) => (
                <Badge variant={row.status === "published" ? "default" : "secondary"}>
                  {row.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              ),
            },
            {
              header: "Atualizado",
              render: (row) => new Date(row.updatedAt).toLocaleDateString("pt-BR"),
            },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/artigos/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteArticle.bind(null, row.id, row.slug)} />
            </>
          )}
        />
      </div>
    </div>
  );
}
