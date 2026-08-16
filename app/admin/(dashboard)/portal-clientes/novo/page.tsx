import { PortalClientSearchForm } from "@/components/admin/portal-client-search-form";
import { requirePermission } from "@/lib/auth/dal";

export default async function NovoPortalClientePage() {
  await requirePermission("portal-clientes");
  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Novo acesso</h1>
      <div className="mt-6">
        <PortalClientSearchForm />
      </div>
    </div>
  );
}
