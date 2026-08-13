import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { and, asc, desc, like, or, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { deleteArticle, duplicateArticle } from "./actions";

export default async function AdminArtigosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; categoria?: string }>;
}) {
  await requirePermission("artigos");
  const { q, status, categoria } = await searchParams;

  const categoryId = categoria ? Number(categoria) : undefined;
  const conditions = [];
  if (q) conditions.push(or(like(articles.title, `%${q}%`), like(articles.excerpt, `%${q}%`)));
  if (status === "draft" || status === "published") conditions.push(eq(articles.status, status));
  if (categoryId && Number.isInteger(categoryId)) conditions.push(eq(articles.categoryId, categoryId));

  const [rows, categories] = await Promise.all([
    db.query.articles.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: (a) => desc(a.updatedAt),
      with: { category: true, author: true },
    }),
    db.query.categories.findMany({ orderBy: (c) => asc(c.name) }),
  ]);
  const hasFilters = Boolean(q || status || categoria);

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
        <Suspense>
          <AdminFilters
            searchPlaceholder="Buscar por título ou resumo..."
            filters={[
              {
                param: "status",
                label: "Status",
                allLabel: "Status: todos",
                options: [
                  { value: "published", label: "Publicado" },
                  { value: "draft", label: "Rascunho" },
                ],
              },
              {
                param: "categoria",
                label: "Categoria",
                allLabel: "Categoria: todas",
                options: categories.map((c) => ({ value: String(c.id), label: c.name })),
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
            { header: "Categoria", render: (row) => row.category?.name ?? "—" },
            { header: "Autor", render: (row) => row.author?.name ?? "—" },
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
              <DuplicateButton action={duplicateArticle.bind(null, row.id)} />
              <DeleteButton action={deleteArticle.bind(null, row.id, row.slug)} />
            </>
          )}
          emptyMessage={
            hasFilters
              ? "Nenhum artigo encontrado para esses filtros."
              : "Nenhum artigo cadastrado ainda."
          }
        />
      </div>
    </div>
  );
}
