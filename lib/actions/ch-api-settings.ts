"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { chApiSettings } from "@/lib/db/schema";
import { testarConexaoCh, listarContasBancarias, ChApiError, type ChContaBancaria } from "@/lib/ch-api/client";
import {
  chApiSettingsSchema,
  type ChApiSettingsValues,
} from "@/lib/validations/admin/ch-api-settings-schema";

// Só os 4 campos necessários pra listar contas bancárias — chaveContaBancaria
// ainda não existe nesse ponto do fluxo (é justamente o que essa busca ajuda
// a descobrir), então não pode ser obrigatório aqui.
const contasBancariasQuerySchema = chApiSettingsSchema.pick({
  baseUrl: true,
  token: true,
  chaveEmpresa: true,
  cnpjEstrutura: true,
});

export async function updateChApiSettings(values: ChApiSettingsValues) {
  await requirePermission("portal-clientes");
  const parsed = chApiSettingsSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  const existing = await db.query.chApiSettings.findFirst();
  if (existing) {
    await db.update(chApiSettings).set(parsed.data).where(eq(chApiSettings.id, existing.id));
  } else {
    await db.insert(chApiSettings).values(parsed.data);
  }

  revalidatePath("/admin/configuracoes-ch");
  return { success: true };
}

export type TestarConexaoChResult = { success: true; totalClientes: number } | { error: string };

// Testa com os valores digitados no formulário, mesmo que ainda não salvos
// — não depende de já ter clicado em "Salvar configurações" antes.
export async function testarConexaoChAction(values: ChApiSettingsValues): Promise<TestarConexaoChResult> {
  await requirePermission("portal-clientes");
  const parsed = chApiSettingsSchema.safeParse(values);
  if (!parsed.success) return { error: "Preencha os campos corretamente antes de testar." };

  try {
    const { totalClientes } = await testarConexaoCh({
      baseUrl: parsed.data.baseUrl.replace(/\/+$/, ""),
      token: parsed.data.token,
      chaveEmpresa: parsed.data.chaveEmpresa,
      cnpjEstrutura: parsed.data.cnpjEstrutura,
      chaveContaBancaria: parsed.data.chaveContaBancaria,
    });
    return { success: true, totalClientes };
  } catch (error) {
    if (error instanceof ChApiError) return { error: error.message };
    return { error: "Não foi possível conectar ao servidor CH." };
  }
}

export type ListarContasBancariasResult = { contas: ChContaBancaria[] } | { error: string };

// Ajuda a preencher "Chave da conta bancária" sem o admin ter que adivinhar
// — busca as contas cadastradas no CH e deixa escolher pelo nome do banco.
export async function listarContasBancariasChAction(
  values: Omit<ChApiSettingsValues, "chaveContaBancaria">
): Promise<ListarContasBancariasResult> {
  await requirePermission("portal-clientes");
  const parsed = contasBancariasQuerySchema.safeParse(values);
  if (!parsed.success) return { error: "Preencha ao menos o endereço, o token e a chave da empresa." };

  try {
    const contas = await listarContasBancarias({
      baseUrl: parsed.data.baseUrl.replace(/\/+$/, ""),
      token: parsed.data.token,
      chaveEmpresa: parsed.data.chaveEmpresa,
      cnpjEstrutura: parsed.data.cnpjEstrutura,
      chaveContaBancaria: "",
    });
    return { contas };
  } catch (error) {
    if (error instanceof ChApiError) return { error: error.message };
    return { error: "Não foi possível buscar as contas bancárias agora." };
  }
}
