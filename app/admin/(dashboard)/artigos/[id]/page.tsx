import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    db.query.articles.findFirst({ where: eq(articles.id, Number(id)) }),
    db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) }),
  ]);
  if (!article) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar artigo</h1>
      <div className="mt-6">
        <ArticleForm article={article} categories={categories} />
      </div>
    </div>
  );
}
