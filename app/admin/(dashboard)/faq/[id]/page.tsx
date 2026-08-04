import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { FAQForm } from "@/components/admin/faq-form";
import { db } from "@/lib/db/client";
import { faqs } from "@/lib/db/schema";

export default async function EditarFAQPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([
    db.query.faqs.findFirst({ where: eq(faqs.id, Number(id)) }),
    db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) }),
  ]);
  if (!faq) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar pergunta</h1>
      <div className="mt-6">
        <FAQForm faq={faq} categories={categories} />
      </div>
    </div>
  );
}
