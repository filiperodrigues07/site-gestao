"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getCurrentPortalClient } from "@/lib/auth/portal-dal";
import {
  portalChangePasswordSchema,
  type PortalChangePasswordValues,
} from "@/lib/validations/portal/change-password-schema";

export async function trocarSenhaPortalAction(values: PortalChangePasswordValues) {
  const client = await getCurrentPortalClient();
  const parsed = portalChangePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  if (!verifyPassword(parsed.data.currentPassword, client.passwordHash)) {
    return { error: "Senha atual incorreta" };
  }

  await db
    .update(portalClients)
    .set({ passwordHash: hashPassword(parsed.data.newPassword), mustChangePassword: false })
    .where(eq(portalClients.id, client.id));

  redirect("/area-cliente");
}
