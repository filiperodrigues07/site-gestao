"use server";

import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { userSchema, type UserFormValues } from "@/lib/validations/admin/user-schema";

export async function createUser(values: UserFormValues) {
  await verifySession();
  const parsed = userSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db.insert(users).values({
      name: parsed.data.name,
      username: parsed.data.username,
      passwordHash: hashPassword(parsed.data.password),
    });
  } catch {
    return { error: "Já existe um usuário com esse nome de usuário" };
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function deleteUser(id: number) {
  await verifySession();

  const [{ value: total }] = await db.select({ value: count() }).from(users);
  if (total <= 1) {
    return { error: "Não é possível excluir o único usuário do painel." };
  }

  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/admin/usuarios");
  return {};
}
