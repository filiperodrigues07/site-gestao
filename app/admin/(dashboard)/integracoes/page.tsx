import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { IntegrationTriggerContent } from "@/components/admin/integration-trigger-content";
import { ChApiSettingsForm } from "@/components/admin/ch-api-settings-form";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { isChApiConfigured } from "@/lib/ch-api/config";

export default async function IntegracoesPage() {
  await requirePermission("portal-clientes");
  const [settings, chConfigured] = await Promise.all([
    db.query.chApiSettings.findFirst(),
    isChApiConfigured(),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium">Integrações</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Conexões com sistemas externos usadas pelo site. Clique numa integração para ver e editar os
        dados de acesso.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card px-5">
        <Accordion>
          <AccordionItem value="ch-sistemas">
            <AccordionTrigger className="items-center py-4 hover:no-underline">
              <IntegrationTriggerContent
                logoSrc="/brand/partners/ch-sistemas.svg"
                logoAlt="CH Sistemas"
                name="CH Sistemas"
                description="API IntegradorBI — consulta de contas a receber e cobrança Pix na área do cliente."
                connected={chConfigured}
              />
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Dados de conexão com o CHServerWeb da Gestão, gerados em CHServer &gt;
                Configurações &gt; Integrador BI. Usados pela área do cliente para consultar
                títulos e gerar cobranças Pix.
              </p>
              <ChApiSettingsForm settings={settings} />
            </AccordionContent>
          </AccordionItem>
          {/* Próximas integrações entram aqui como novos AccordionItem */}
        </Accordion>
      </div>
    </div>
  );
}
