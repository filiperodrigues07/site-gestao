import { ArticleForm } from "@/components/admin/article-form";
import { db } from "@/lib/db/client";

export default async function NovoArtigoPage() {
  const categories = await db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) });

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo artigo</h1>
      <div className="mt-6">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
