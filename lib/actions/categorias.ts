"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/admin/category-schema";

export async function createCategory(values: CategoryFormValues) {
  await verifySession();
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db.insert(categories).values(parsed.data);
  } catch {
    return { error: "Já existe uma categoria com esse slug" };
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategory(id: number, values: CategoryFormValues) {
  await verifySession();
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  try {
    await db.update(categories).set(parsed.data).where(eq(categories.id, id));
  } catch {
    return { error: "Já existe uma categoria com esse slug" };
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: number) {
  await verifySession();

  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch {
    return { error: "Não é possível excluir: existem artigos vinculados a esta categoria." };
  }

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/categorias");
  return {};
}
