"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { listarClientes, ChApiError, type ChCliente } from "@/lib/ch-api/client";
import { normalizeCnpj } from "@/lib/portal/cnpj";
import {
  portalClientCreateSchema,
  portalClientUpdateSchema,
  type PortalClientCreateValues,
  type PortalClientUpdateValues,
} from "@/lib/validations/admin/portal-client-schema";

export async function buscarClienteChAction(
  cnpj: string
): Promise<{ cliente: ChCliente } | { error: string }> {
  await requirePermission("portal-clientes");
  const alvo = normalizeCnpj(cnpj);
  if (alvo.length < 11) return { error: "Informe um CNPJ válido" };

  try {
    const clientes = await listarClientes();
    const encontrado = clientes.find((cliente) => normalizeCnpj(cliente.CNPJCPF) === alvo);
    if (!encontrado) {
      return { error: "Nenhum cliente com esse CNPJ foi encontrado no CH." };
    }
    return { cliente: encontrado };
  } catch (error) {
    if (error instanceof ChApiError) return { error: error.message };
    return { error: "Não foi possível consultar o CH agora." };
  }
}

export async function createPortalClient(values: PortalClientCreateValues) {
  await requirePermission("portal-clientes");
  const parsed = portalClientCreateSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  const { cnpj, razaoSocial, chaveCliente, password } = parsed.data;

  try {
    await db.insert(portalClients).values({
      cnpj: normalizeCnpj(cnpj),
      razaoSocial,
      chaveCliente,
      passwordHash: hashPassword(password),
    });
  } catch {
    return { error: "Já existe um acesso cadastrado para esse CNPJ" };
  }

  revalidatePath("/admin/portal-clientes");
  redirect("/admin/portal-clientes");
}

export async function updatePortalClient(id: number, values: PortalClientUpdateValues) {
  await requirePermission("portal-clientes");
  const parsed = portalClientUpdateSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  const { isActive, password } = parsed.data;
  await db
    .update(portalClients)
    .set({
      isActive,
      ...(password ? { passwordHash: hashPassword(password), mustChangePassword: true } : {}),
    })
    .where(eq(portalClients.id, id));

  revalidatePath("/admin/portal-clientes");
  redirect("/admin/portal-clientes");
}

export async function deletePortalClient(id: number) {
  await requirePermission("portal-clientes");
  await db.delete(portalClients).where(eq(portalClients.id, id));
  revalidatePath("/admin/portal-clientes");
  return {};
}
