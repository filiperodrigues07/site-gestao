import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortalClientEditForm } from "@/components/admin/portal-client-edit-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";

export default async function EditarPortalClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("portal-clientes");
  const { id } = await params;
  const client = await db.query.portalClients.findFirst({ where: eq(portalClients.id, Number(id)) });
  if (!client) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Editar acesso</h1>
      <div className="mt-6">
        <PortalClientEditForm client={client} />
      </div>
    </div>
  );
}
