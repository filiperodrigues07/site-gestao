"use server";

import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { rateLimit } from "@/lib/rate-limit";
import {
  userSchema,
  type UserFormValues,
  userPermissionsSchema,
  type UserPermissionsFormValues,
  changePasswordSchema,
  type ChangePasswordFormValues,
  changePasswordByCredentialsSchema,
  type ChangePasswordByCredentialsFormValues,
} from "@/lib/validations/admin/user-schema";

export async function createUser(values: UserFormValues) {
  await requireAdmin();
  const parsed = userSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db.insert(users).values({
      name: parsed.data.name,
      username: parsed.data.username,
      passwordHash: hashPassword(parsed.data.password),
      isAdmin: parsed.data.isAdmin,
      permissions: parsed.data.isAdmin ? [] : parsed.data.permissions,
    });
  } catch {
    return { error: "Já existe um usuário com esse nome de usuário" };
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function updateUserPermissions(id: number, values: UserPermissionsFormValues) {
  await requireAdmin();
  const parsed = userPermissionsSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db
    .update(users)
    .set({
      isAdmin: parsed.data.isAdmin,
      permissions: parsed.data.isAdmin ? [] : parsed.data.permissions,
    })
    .where(eq(users.id, id));

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function deleteUser(id: number) {
  await requireAdmin();

  const [{ value: total }] = await db.select({ value: count() }).from(users);
  if (total <= 1) {
    return { error: "Não é possível excluir o único usuário do painel." };
  }

  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/admin/usuarios");
  return {};
}

export async function changeOwnPassword(values: ChangePasswordFormValues) {
  const user = await getCurrentUser();
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  if (!verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return { error: "Senha atual incorreta" };
  }

  await db
    .update(users)
    .set({ passwordHash: hashPassword(parsed.data.newPassword) })
    .where(eq(users.id, user.id));

  return { success: true };
}

// Usada na tela de login, sem sessão ativa — por isso pede usuário + senha
// atual (em vez de confiar em quem já está logado) e nunca revela se o
// usuário existe ou não, só se a combinação está certa.
export async function changePasswordByCredentials(values: ChangePasswordByCredentialsFormValues) {
  const { success, retryAfterSeconds } = await rateLimit("change-password-by-credentials", {
    limit: 5,
    windowMs: 5 * 60 * 1000,
  });
  if (!success) {
    return { error: `Muitas tentativas. Tente novamente em ${retryAfterSeconds}s.` };
  }

  const parsed = changePasswordByCredentialsSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const user = await db.query.users.findFirst({ where: eq(users.username, parsed.data.username) });
  if (!user || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return { error: "Usuário ou senha atual incorretos" };
  }

  await db
    .update(users)
    .set({ passwordHash: hashPassword(parsed.data.newPassword) })
    .where(eq(users.id, user.id));

  return { success: true };
}
