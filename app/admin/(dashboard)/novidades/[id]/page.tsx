import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UpdateForm } from "@/components/admin/update-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { updates } from "@/lib/db/schema";

export default async function EditarNovidadePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("novidades");
  const { id } = await params;
  const update = await db.query.updates.findFirst({ where: eq(updates.id, Number(id)) });
  if (!update) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar novidade</h1>
      <div className="mt-6">
        <UpdateForm update={update} />
      </div>
    </div>
  );
}
