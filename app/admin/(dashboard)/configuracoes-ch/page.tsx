import { ChApiSettingsForm } from "@/components/admin/ch-api-settings-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";

export default async function ChApiConfigPage() {
  await requirePermission("portal-clientes");
  const settings = await db.query.chApiSettings.findFirst();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Configurações da API do CH</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dados de conexão com o CHServerWeb da Gestão, usados pela área do cliente para consultar
        títulos e gerar cobranças Pix.
      </p>
      <div className="mt-6">
        <ChApiSettingsForm settings={settings} />
      </div>
    </div>
  );
}
