import { db } from "@/lib/db/client";

export type ChApiConfig = {
  baseUrl: string;
  token: string;
  chaveEmpresa: string;
  cnpjEstrutura: string;
  chaveContaBancaria: string;
};

// Configurado pelo admin em /admin/integracoes (tabela ch_api_settings), não
// por variável de ambiente — o servidor CH é da própria Gestão e o admin
// prefere trocar esses dados sem precisar de deploy.
async function getSettingsRow() {
  return db.query.chApiSettings.findFirst({ orderBy: (t, { desc }) => desc(t.id) });
}

export async function isChApiConfigured(): Promise<boolean> {
  const row = await getSettingsRow();
  return Boolean(
    row?.baseUrl && row?.token && row?.chaveEmpresa && row?.cnpjEstrutura && row?.chaveContaBancaria
  );
}

// Lança só quando uma função da API é de fato chamada, mesmo padrão do
// isEmailConfigured()/getClient() em lib/email/resend.ts.
export async function getChApiConfig(): Promise<ChApiConfig> {
  const row = await getSettingsRow();

  if (!row?.baseUrl || !row?.token || !row?.chaveEmpresa || !row?.cnpjEstrutura || !row?.chaveContaBancaria) {
    throw new Error("API do CH não configurada — preencha os dados em Admin > Integrações.");
  }

  return {
    baseUrl: row.baseUrl.replace(/\/+$/, ""),
    token: row.token,
    chaveEmpresa: row.chaveEmpresa,
    cnpjEstrutura: row.cnpjEstrutura,
    chaveContaBancaria: row.chaveContaBancaria,
  };
}
