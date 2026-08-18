import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { and, count, desc, eq, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { ADMIN_PAGE_SIZE, parsePage, buildAdminHref } from "@/lib/admin/pagination";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { faqs } from "@/lib/db/schema";
import { deleteFAQ } from "./actions";

export default async function AdminFAQPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; page?: string }>;
}) {
  await requirePermission("faq");
  const { q, categoria, page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const categoryId = categoria ? Number(categoria) : undefined;
  const conditions = [];
  if (q) conditions.push(like(faqs.question, `%${q}%`));
  if (categoryId && Number.isInteger(categoryId)) conditions.push(eq(faqs.categoryId, categoryId));
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }], categories] = await Promise.all([
    db.query.faqs.findMany({
      where: whereClause,
      orderBy: (f) => desc(f.createdAt),
      with: { category: true },
      limit: ADMIN_PAGE_SIZE,
      offset: (page - 1) * ADMIN_PAGE_SIZE,
    }),
    db.select({ total: count() }).from(faqs).where(whereClause),
    db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const buildHref = (targetPage: number) => buildAdminHref("/admin/faq", { q, categoria }, targetPage);
  const hasFilters = Boolean(q || categoria);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">FAQ</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} perguntas cadastradas</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/faq/novo" />}>
          <Plus className="size-4" />
          Nova pergunta
        </Button>
      </div>

      <div className="mt-6">
        <Suspense>
          <AdminFilters
            searchPlaceholder="Buscar por pergunta..."
            filters={[
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
            { header: "Pergunta", render: (row) => <span className="font-medium">{row.question}</span> },
            { header: "Categoria", render: (row) => row.category?.name ?? "—" },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/faq/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deleteFAQ.bind(null, row.id)} />
            </>
          )}
          emptyMessage={
            hasFilters ? "Nenhuma pergunta encontrada para esses filtros." : "Nenhuma pergunta cadastrada ainda."
          }
        />
      </div>

      <AdminPagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
