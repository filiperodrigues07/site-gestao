import { FAQForm } from "@/components/admin/faq-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";

export default async function NovaFAQPage() {
  await requirePermission("faq");
  const categories = await db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) });

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Nova pergunta</h1>
      <div className="mt-6">
        <FAQForm categories={categories} />
      </div>
    </div>
  );
}
