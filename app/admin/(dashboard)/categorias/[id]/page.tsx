import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("categorias");
  const { id } = await params;
  const category = await db.query.categories.findFirst({ where: eq(categories.id, Number(id)) });
  if (!category) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar categoria</h1>
      <div className="mt-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
