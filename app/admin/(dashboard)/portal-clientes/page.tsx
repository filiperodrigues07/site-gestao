import { Suspense } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { asc, like } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/admin-list";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFilters } from "@/components/admin/admin-filters";
import { ImportChClientsButton } from "@/components/admin/import-ch-clients-button";
import { formatCnpj } from "@/lib/portal/cnpj";
import { SENHA_PADRAO_IMPORTACAO } from "@/lib/portal/constants";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { deletePortalClient } from "@/lib/actions/portal-clientes";

export default async function AdminPortalClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requirePermission("portal-clientes");
  const { q } = await searchParams;

  const rows = await db.query.portalClients.findMany({
    where: q ? like(portalClients.razaoSocial, `%${q}%`) : undefined,
    orderBy: (c) => asc(c.razaoSocial),
  });
  const hasFilters = Boolean(q);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} clientes cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportChClientsButton />
          <Button nativeButton={false} render={<Link href="/admin/portal-clientes/novo" />}>
            <Plus className="size-4" />
            Novo acesso
          </Button>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Clientes importados do CH entram ativos com a senha padrão{" "}
        <code className="rounded bg-muted px-1 py-0.5">{SENHA_PADRAO_IMPORTACAO}</code> — troque a
        senha antes de repassar o acesso a um cliente de verdade.
      </p>

      <div className="mt-6">
        <Suspense>
          <AdminFilters searchPlaceholder="Buscar por razão social..." />
        </Suspense>
      </div>

      <div className="mt-4">
        <AdminList
          rows={rows}
          columns={[
            { header: "Razão social", render: (row) => <span className="font-medium">{row.razaoSocial}</span> },
            { header: "CNPJ", render: (row) => <code className="text-xs">{formatCnpj(row.cnpj)}</code> },
            {
              header: "Status",
              render: (row) =>
                row.isActive ? (
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Inativo
                  </Badge>
                ),
            },
          ]}
          actions={(row) => (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/admin/portal-clientes/${row.id}`} />}
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteButton action={deletePortalClient.bind(null, row.id)} />
            </>
          )}
          emptyMessage={
            hasFilters ? "Nenhum acesso encontrado para esses filtros." : "Nenhum acesso cadastrado ainda."
          }
        />
      </div>
    </div>
  );
}
